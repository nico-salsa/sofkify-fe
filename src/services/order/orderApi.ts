/**
 * Order API Service
 * Responsabilidad ÚNICA: Comunicación HTTP con backend para órdenes
 */

import type { CreateOrderRequest, Order, OrderError } from '../../types/order.types';
import { authStorage } from '../auth/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

/**
 * orderApi - Cliente HTTP para operaciones de órdenes
 */
export const orderApi = {
	/**
	 * Crea una nueva orden
	 * POST /api/v1/orders
	 *
	 * @param payload - Datos de la orden (userId, items)
	 * @returns Orden creada con ID y timestamps
	 * @throws OrderError si falla
	 */
	async createOrder(payload: CreateOrderRequest): Promise<Order> {
		// Validar que payload no contiene campos backend-managed
		if (
			'id' in payload ||
			'createdAt' in payload ||
			'updatedAt' in payload ||
			'status' in payload
		) {
			throw new Error('Payload contains backend-managed fields (id, createdAt, updatedAt, status)');
		}

		const token = authStorage.getToken();
		if (!token) {
			const error: OrderError = {
				success: false,
				code: 'UNAUTHORIZED',
				message: 'User not authenticated',
			};
			throw error;
		}

		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify(payload),
			});

			const data = await response.json();

			if (!response.ok) {
				const error: OrderError = {
					success: false,
					code: data.code || 'ORDER_CREATE_ERROR',
					message: data.message || `Backend error: ${response.status}`,
					details: data.details,
				};
				throw error;
			}

			// Validar que orden tiene campos requeridos
			if (
				!data.id ||
				!data.userId ||
				!Array.isArray(data.items) ||
				typeof data.total !== 'number'
			) {
				throw new Error('Invalid order response from server');
			}

			return data as Order;
		} catch (err) {
			if (err instanceof Error && 'code' in err) {
				throw err;
			}
			throw {
				success: false,
				code: 'NETWORK_ERROR',
				message: err instanceof Error ? err.message : 'Unknown error',
			} as OrderError;
		}
	},

	/**
	 * Obtiene detalles de una orden por ID
	 * GET /api/v1/orders/{id}
	 *
	 * @param orderId - ID de la orden a obtener
	 * @returns Detalles completos de la orden
	 * @throws OrderError si no encuentra la orden
	 */
	async getOrderById(orderId: string): Promise<Order> {
		if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
			throw new Error('orderId must be a non-empty string');
		}

		const token = authStorage.getToken();

		try {
			const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
				method: 'GET',
				headers: {
					'Authorization': token || '',
				},
			});

			if (!response.ok) {
				if (response.status === 404) {
					const error: OrderError = {
						success: false,
						code: 'NOT_FOUND',
						message: `Order ${orderId} not found`,
					};
					throw error;
				}

				const error: OrderError = {
					success: false,
					code: `HTTP_${response.status}`,
					message: `Error fetching order: ${response.status}`,
				};
				throw error;
			}

			const data = await response.json();
			return data as Order;
		} catch (err) {
			if (err instanceof Error && 'code' in err) {
				throw err;
			}
			throw {
				success: false,
				code: 'NETWORK_ERROR',
				message: err instanceof Error ? err.message : 'Unknown error',
			} as OrderError;
		}
	},
};
