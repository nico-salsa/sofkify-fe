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
        console.warn('[useCartConfirmation] Cart confirmation already in progress');
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

        // Ensure a backend cart exists with all items.
        // addItem is idempotent: existing products increment quantity,
        // and the backend creates a new ACTIVE cart if none exists.
        let backendCartId = '';
        let shouldCreateNewCart = false;

        // Paso 1: Intentar obtener el carrito activo existente
        try {
          const existingCart = await cartApi.getActiveCart(userId);
          
          if (existingCart && existingCart.status === 'ACTIVE') {
            backendCartId = existingCart.id;
            console.log('[useCartConfirmation] Using existing active cart:', backendCartId);
            
            // Verificar si los items del carrito backend coinciden con los locales
            const backendItemsCount = existingCart.items?.length || 0;
            if (backendItemsCount === 0 && items.length > 0) {
              // El carrito backend está vacío pero el local tiene items
              // Necesitamos agregar los items
              shouldCreateNewCart = false;
              console.log('[useCartConfirmation] Backend cart is empty, will add items');
            }
          } else if (existingCart && existingCart.status === 'CONFIRMED') {
            // Si el carrito ya está confirmado, necesitamos crear uno nuevo
            console.log('[useCartConfirmation] Cart is already confirmed, will create new cart');
            shouldCreateNewCart = true;
            backendCartId = '';
          }
        } catch (err: unknown) {
          // Si no existe carrito activo (404), creamos uno nuevo
          if (err && typeof err === 'object' && 'code' in err) {
            const error = err as CartConfirmationError;
            if (error.code === 'NOT_FOUND') {
              console.log('[useCartConfirmation] No active cart found, will create new one');
              shouldCreateNewCart = true;
            } else {
              throw error; // Re-lanzar otros errores
            }
          }
        }

        // Paso 2: Materializar el carrito local en backend
        if (!backendCartId || shouldCreateNewCart) {
          console.log('[useCartConfirmation] Creating/updating cart with items');
          for (const item of items) {
            try {
              const cartResponse = await cartApi.addItem(userId, item.productId, item.quantity);
              backendCartId = cartResponse.id;
            } catch (addItemError) {
              console.error('[useCartConfirmation] Error adding item:', addItemError);
              throw addItemError;
            }
          }

          if (!backendCartId) {
            throw {
              success: false,
              code: 'EMPTY_CART',
              message: 'Backend cart could not be created',
            } as CartConfirmationError;
          }
          console.log('[useCartConfirmation] Cart created/updated:', backendCartId);
        }

        // Paso 3: Confirmar el carrito
        console.log('[useCartConfirmation] Confirming cart:', backendCartId);
        const confirmResponse = await cartApi.confirmCart(backendCartId, userId);
        console.log('[useCartConfirmation] Cart confirmed:', confirmResponse);

        // Paso 4: Crear la orden desde el carrito confirmado
        console.log('[useCartConfirmation] Creating order from cart:', backendCartId);
        const orderResponse = await orderApi.createOrderFromCart(backendCartId);
        console.log('[useCartConfirmation] Order created:', orderResponse.id);

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
