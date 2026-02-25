/**
 * Order API Service
 * Comunicación HTTP con Order Service (puerto 8082, sin contexto /api)
 * 
 * Responsabilidad ÚNICA: Comunicación HTTP con backend para órdenes
 * - POST /orders/from-cart/{cartId} - Crear orden desde carrito
 * - GET /orders/{orderId} - Obtener orden por ID
 * - GET /orders/customer/{customerId} - Listar órdenes del cliente
 * - PUT /orders/{orderId}/status - Actualizar estado de la orden
 */

import type { CreateOrderRequest, Order, OrderError } from '../../types/order.types';
import { authStorage } from '../auth/authStorage';

const ORDER_SERVICE_URL = import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8082';
const ORDER_API_ENDPOINT = `${ORDER_SERVICE_URL}/orders`;

/**
 * orderApi - Cliente HTTP para operaciones de órdenes
 */
export const orderApi = {
	/**
	 * Crea una nueva orden a partir de un carrito
	 * POST /orders/from-cart/{cartId}
	 *
	 * @param cartId - ID del carrito a convertir en orden
	 * @returns Orden creada con ID y timestamps
	 * @throws OrderError si falla
	 */
	async createOrderFromCart(cartId: string): Promise<Order> {
		if (!cartId || typeof cartId !== 'string' || cartId.trim() === '') {
			const error: OrderError = {
				success: false,
				code: 'INVALID_INPUT',
				message: 'cartId must be a non-empty string',
			};
			throw error;
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
			const response = await fetch(`${ORDER_API_ENDPOINT}/from-cart/${cartId}`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
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
			if (!data.id || !data.customerId || typeof data.total !== 'number') {
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
	 * Crea una nueva orden con detalles
	 * POST /orders
	 *
	 * @param payload - Datos de la orden (customerId, items)
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
			const response = await fetch(ORDER_API_ENDPOINT, {
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
			if (!data.id || !data.customerId || typeof data.total !== 'number') {
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
	 * GET /orders/{orderId}
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
		if (!token) {
			const error: OrderError = {
				success: false,
				code: 'UNAUTHORIZED',
				message: 'User not authenticated',
			};
			throw error;
		}

		try {
			const response = await fetch(`${ORDER_API_ENDPOINT}/${orderId}`, {
				method: 'GET',
				headers: {
					'Authorization': token,
				},
			});

			const data = await response.json();

			if (response.status === 404) {
				const error: OrderError = {
					success: false,
					code: 'NOT_FOUND',
					message: `Order ${orderId} not found`,
				};
				throw error;
			}

			if (!response.ok) {
				const error: OrderError = {
					success: false,
					code: data.code || 'ORDER_FETCH_ERROR',
					message: data.message || `Backend error: ${response.status}`,
				};
				throw error;
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
	 * Lista todas las órdenes de un cliente
	 * GET /orders/customer/{customerId}
	 *
	 * @param customerId - ID del cliente
	 * @returns Array de órdenes del cliente
	 * @throws OrderError si no puede obtener las órdenes
	 */
	async getOrdersByCustomer(customerId: string): Promise<Order[]> {
		if (!customerId || typeof customerId !== 'string' || customerId.trim() === '') {
			throw new Error('customerId must be a non-empty string');
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
			const response = await fetch(`${ORDER_API_ENDPOINT}/customer/${customerId}`, {
				method: 'GET',
				headers: {
					'Authorization': token,
				},
			});

			const data = await response.json();

			if (!response.ok) {
				const error: OrderError = {
					success: false,
					code: data.code || 'ORDER_FETCH_ERROR',
					message: data.message || `Backend error: ${response.status}`,
				};
				throw error;
			}

			return (Array.isArray(data) ? data : data.orders || []) as Order[];
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
	 * Actualiza el estado de una orden
	 * PUT /orders/{orderId}/status
	 *
	 * @param orderId - ID de la orden
	 * @param status - Nuevo estado
	 * @returns Orden actualizada
	 * @throws OrderError si falla
	 */
	async updateOrderStatus(orderId: string, status: string): Promise<Order> {
		if (!orderId || typeof orderId !== 'string' || orderId.trim() === '') {
			throw new Error('orderId must be a non-empty string');
		}

		if (!status || typeof status !== 'string' || status.trim() === '') {
			throw new Error('status must be a non-empty string');
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
			const response = await fetch(`${ORDER_API_ENDPOINT}/${orderId}/status`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': token,
				},
				body: JSON.stringify({ status }),
			});

			const data = await response.json();

			if (!response.ok) {
				const error: OrderError = {
					success: false,
					code: data.code || 'ORDER_UPDATE_ERROR',
					message: data.message || `Backend error: ${response.status}`,
				};
				throw error;
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
};
