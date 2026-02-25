/**
 * useCartConfirmation Hook
 * Orquesta el flujo de confirmación de carrito + creación de orden
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
	confirmCart: (cartId: string, userId: string, items: Array<{ productId: string; quantity: number }>) => Promise<void>;
	reset: () => void;
}

/**
 * Hook para manejar confirmación de carrito
 * Secuencia:
 * 1. Confirma carrito (POST /carts/{id}/confirm)
 * 2. Crea orden (POST /orders)
 * 3. Retorna datos combinados
 */
export const useCartConfirmation = (): UseCartConfirmationReturn => {
	const [state, setState] = useState<UseCartConfirmationState>({
		isLoading: false,
		error: null,
		data: null,
	});

	// Flag para evitar double-submit (debounce manual)
	const isProcessingRef = useRef(false);

	const confirmCart = useCallback(
		async (
			cartId: string,
			userId: string,
			items: Array<{ productId: string; quantity: number }>
		) => {
			// Debounce: si ya está procesando, no hacer nada
			if (isProcessingRef.current) {
				console.warn('Cart confirmation already in progress');
				return;
			}

			isProcessingRef.current = true;
			setState({ isLoading: true, error: null, data: null });

			try {
				// Validar inputs básicos
				if (!cartId || !userId || !Array.isArray(items) || items.length === 0) {
					throw {
						success: false,
						code: 'EMPTY_CART',
						message: 'Invalid cartId, userId, or items',
					} as CartConfirmationError;
				}

				// Step 1: Confirmar carrito
				console.log(`[useCartConfirmation] Confirming cart: ${cartId}`);
				const confirmResponse = await cartApi.confirmCart(cartId);

				// Step 2: Crear orden
				console.log(`[useCartConfirmation] Creating order for user: ${userId}`);
				const orderResponse = await orderApi.createOrder({
					userId,
					items,
				});

				// Step 3: Éxito - guardar ambos datos
				setState({
					isLoading: false,
					error: null,
					data: {
						...confirmResponse,
						order: orderResponse,
					},
				});

				console.log('[useCartConfirmation] Success:', {
					cartId: confirmResponse.cartId,
					orderId: confirmResponse.orderId,
				});
			} catch (err: unknown) {
				// Convertir a CartConfirmationError
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
