/**
 * useCartConfirmation Hook
 * Orquesta el flujo de confirmacion de carrito + creacion de orden.
 */

import { useState, useCallback, useRef } from 'react';
import type { ConfirmCartResponse, CartConfirmationError } from '../types/cart.types';
import type { Order } from '../types/order.types';
import { cartApi } from '../services/cart/cartApi';
import { orderApi } from '../services/order/orderApi';

interface UseCartConfirmationState {
  isLoading: boolean;
  error: CartConfirmationError | null;
  data: (ConfirmCartResponse & { order?: Order }) | null;
}

interface UseCartConfirmationReturn extends UseCartConfirmationState {
  confirmCart: (
    userId: string,
    items: Array<{ productId: string; quantity: number }>
  ) => Promise<void>;
  reset: () => void;
}

export const useCartConfirmation = (): UseCartConfirmationReturn => {
  const [state, setState] = useState<UseCartConfirmationState>({
    isLoading: false,
    error: null,
    data: null,
  });

  const isProcessingRef = useRef(false);

  const confirmCart = useCallback(
    async (userId: string, items: Array<{ productId: string; quantity: number }>) => {
      if (isProcessingRef.current) {
        console.warn('Cart confirmation already in progress');
        return;
      }

      isProcessingRef.current = true;
      setState({ isLoading: true, error: null, data: null });

      try {
        if (!userId || !Array.isArray(items) || items.length === 0) {
          throw {
            success: false,
            code: 'EMPTY_CART',
            message: 'Invalid userId or items',
          } as CartConfirmationError;
        }

        let backendCartId = '';

        // Materializa el carrito local en backend antes de confirmar.
        for (const item of items) {
          const cartResponse = await cartApi.addItem(userId, item.productId, item.quantity);
          backendCartId = cartResponse.id;
        }

        if (!backendCartId) {
          throw {
            success: false,
            code: 'EMPTY_CART',
            message: 'Backend cart could not be created',
          } as CartConfirmationError;
        }

        const confirmResponse = await cartApi.confirmCart(backendCartId, userId);
        const orderResponse = await orderApi.createOrderFromCart(backendCartId);

        setState({
          isLoading: false,
          error: null,
          data: {
            ...confirmResponse,
            order: orderResponse,
          },
        });

        console.log('[useCartConfirmation] Success', {
          cartId: confirmResponse.cartId,
          orderId: orderResponse.id,
        });
      } catch (err: unknown) {
        let error: CartConfirmationError;

        if (err && typeof err === 'object' && 'code' in err) {
          error = err as CartConfirmationError;
        } else if (err instanceof Error) {
          error = {
            success: false,
            code: 'UNKNOWN_ERROR',
            message: err.message,
          };
        } else {
          error = {
            success: false,
            code: 'UNKNOWN_ERROR',
            message: 'An unknown error occurred',
          };
        }

        setState({
          isLoading: false,
          error,
          data: null,
        });

        console.error('[useCartConfirmation] Error:', error);
      } finally {
        isProcessingRef.current = false;
      }
    },
    []
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
    isProcessingRef.current = false;
  }, []);

  return {
    ...state,
    confirmCart,
    reset,
  };
};
