/**
 * Cart API Service
 * Comunicación HTTP con Cart Service (puerto 8083, /api context)
 * 
 * Responsabilidad ÚNICA: Comunicación HTTP con backend para carrito
 * - POST /api/carts/items - Agregar productos al carrito
 * - GET /api/carts - Obtener carrito activo
 * - GET /api/carts/{cartId} - Obtener carrito por ID
 * - PUT /api/carts/items/{cartItemId} - Actualizar cantidad
 * - DELETE /api/carts/items/{cartItemId} - Eliminar item
 */

import type { ConfirmCartResponse, CartConfirmationError, CartItem } from '../../types/cart.types';
import { authStorage } from '../auth/authStorage';

const CART_SERVICE_URL = import.meta.env.VITE_CART_SERVICE_URL || 'http://localhost:8083';
const CART_API_ENDPOINT = `${CART_SERVICE_URL}/api/carts`;

/**
 * Obtiene el Customer ID desde el token o authStorage
 */
function getCustomerId(): string {
  const token = authStorage.getToken();
  if (!token) {
    throw new Error('User not authenticated');
  }
  // TODO: Parsear el token JWT para extraer el customerId
  // Por ahora usar una versión simplificada
  return localStorage.getItem('userId') || '';
}

/**
 * cartApi - Cliente HTTP para operaciones del carrito
 */
export const cartApi = {
	/**
	 * Agrega un producto al carrito
	 * POST /api/carts/items
	 * Requiere header: X-Customer-Id
	 *
	 * @param item - Producto a agregar al carrito
	 * @returns Carrito actualizado
	 */
	async addItemToCart(item: CartItem): Promise<void> {
		try {
			const customerId = getCustomerId();

			const response = await fetch(`${CART_API_ENDPOINT}/items`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'X-Customer-Id': customerId,
				},
				body: JSON.stringify({
					productId: item.id,
					quantity: item.quantity,
					price: item.price,
				}),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to add item to cart');
			}
		} catch (err) {
			console.error('Error adding item to cart:', err);
			throw err;
		}
	},

	/**
	 * Obtiene el carrito activo del cliente
	 * GET /api/carts
	 * Requiere header: X-Customer-Id
	 *
	 * @returns Carrito activo del cliente
	 */
	async getActiveCart(): Promise<any> {
		try {
			const customerId = getCustomerId();

			const response = await fetch(CART_API_ENDPOINT, {
				method: 'GET',
				headers: {
					'X-Customer-Id': customerId,
				},
			});

			if (!response.ok) {
				throw new Error('Failed to fetch active cart');
			}

			return await response.json();
		} catch (err) {
			console.error('Error fetching active cart:', err);
			throw err;
		}
	},

	/**
	 * Obtiene un carrito por ID
	 * GET /api/carts/{cartId}
	 *
	 * @param cartId - ID del carrito
	 * @returns Detalles del carrito
	 */
	async getCartById(cartId: string): Promise<any> {
		try {
			const response = await fetch(`${CART_API_ENDPOINT}/${cartId}`, {
				method: 'GET',
			});

			if (response.status === 404) {
				return null;
			}

			if (!response.ok) {
				throw new Error('Failed to fetch cart');
			}

			return await response.json();
		} catch (err) {
			console.error('Error fetching cart by ID:', err);
			throw err;
		}
	},

	/**
	 * Actualiza la cantidad de un item en el carrito
	 * PUT /api/carts/items/{cartItemId}
	 *
	 * @param cartItemId - ID del item en el carrito
	 * @param quantity - Nueva cantidad
	 */
	async updateItemQuantity(cartItemId: string, quantity: number): Promise<void> {
		try {
			const response = await fetch(`${CART_API_ENDPOINT}/items/${cartItemId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ quantity }),
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to update item quantity');
			}
		} catch (err) {
			console.error('Error updating item quantity:', err);
			throw err;
		}
	},

	/**
	 * Elimina un item del carrito
	 * DELETE /api/carts/items/{cartItemId}
	 *
	 * @param cartItemId - ID del item a eliminar
	 */
	async removeItem(cartItemId: string): Promise<void> {
		try {
			const response = await fetch(`${CART_API_ENDPOINT}/items/${cartItemId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json();
				throw new Error(error.message || 'Failed to remove item from cart');
			}
		} catch (err) {
			console.error('Error removing item from cart:', err);
			throw err;
		}
	},
};
