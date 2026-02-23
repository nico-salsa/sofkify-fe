/**
 * Cart API Service
 * Responsabilidad ÚNICA: Comunicación HTTP con backend para carrito
 */

import type { ConfirmCartResponse, CartConfirmationError } from '../../types/cart.types';
import { authStorage } from '../auth/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * cartApi - Cliente HTTP para operaciones del carrito
 */
export const cartApi = {
	/**
	 * Confirma el carrito activo del usuario
	 * POST /api/v1/carts/{id}/confirm
	 *
	 * @param cartId - ID del carrito a confirmar
	 * @returns Respuesta con orderId y timestamps
	 * @throws CartConfirmationError si falla
	 */
	async confirmCart(cartId: string): Promise<ConfirmCartResponse> {
		// Validaciones básicas
		if (!cartId || typeof cartId !== 'string' || cartId.trim() === '') {
			throw new Error('cartId must be a non-empty string');
		}

		// Obtener token
		const token = authStorage.getToken();
		if (!token) {
			const error: CartConfirmationError = {
				success: false,
				code: 'UNAUTHORIZED',
				message: 'User not authenticated',
			};
			throw error;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/carts/${cartId}/confirm`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token, // authStorage ya incluye "Bearer "
				},
			});

			const data = await response.json();

			if (!response.ok) {
				const error: CartConfirmationError = {
					success: false,
					code: data.code || 'UNKNOWN_ERROR',
					message: data.message || `Backend error: ${response.status}`,
					details: data.details,
				};
				throw error;
			}

			// Validar que respuesta tiene campos requeridos
			if (!data.success || !data.orderId || !data.confirmedAt) {
				throw new Error('Invalid response from server');
			}

			return data as ConfirmCartResponse;
		} catch (err) {
			// Si ya es CartConfirmationError, relanzar
			if (err instanceof Error && 'code' in err) {
				throw err;
			}
			// Si es error de red u otro, convertir
			throw {
				success: false,
				code: 'UNKNOWN_ERROR',
				message: err instanceof Error ? err.message : 'Unknown error',
			} as CartConfirmationError;
		}
	},
};
