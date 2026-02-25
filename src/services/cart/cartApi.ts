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
 * Obtiene el Customer ID desde localStorage
 * Si no existe, genera un UUID temporal
 */
function getCustomerId(): string {
  let customerId = localStorage.getItem('customerId');
  
  if (!customerId) {
    // Generar UUID v4 temporal si no existe
    customerId = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
    localStorage.setItem('customerId', customerId);
    console.log('[cartApi] Generated temporary customer ID:', customerId);
  }
  
  return customerId;
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

			console.log('[cartApi] Adding item to cart:', { customerId, item });

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
				const error = await response.json().catch(() => ({}));
				console.error('[cartApi] Failed to add item:', { status: response.status, error });
				throw new Error(error.message || `Failed to add item to cart (${response.status})`);
			}

			console.log('[cartApi] Item added successfully');
		} catch (err) {
			console.error('[cartApi] Error adding item to cart:', err);
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

			console.log('[cartApi] Fetching active cart for customer:', customerId);

			const response = await fetch(CART_API_ENDPOINT, {
				method: 'GET',
				headers: {
					'X-Customer-Id': customerId,
				},
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				console.error('[cartApi] Failed to fetch active cart:', { status: response.status, error });
				throw new Error(error.message || `Failed to fetch active cart (${response.status})`);
			}

			const data = await response.json();
			console.log('[cartApi] Active cart fetched:', data);
			return data;
		} catch (err) {
			console.error('[cartApi] Error fetching active cart:', err);
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
			console.log('[cartApi] Fetching cart by ID:', cartId);

			const response = await fetch(`${CART_API_ENDPOINT}/${cartId}`, {
				method: 'GET',
			});

			if (response.status === 404) {
				console.warn('[cartApi] Cart not found:', cartId);
				return null;
			}

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				console.error('[cartApi] Failed to fetch cart:', { status: response.status, error });
				throw new Error(error.message || `Failed to fetch cart (${response.status})`);
			}

			const data = await response.json();
			console.log('[cartApi] Cart fetched:', data);
			return data;
		} catch (err) {
			console.error('[cartApi] Error fetching cart by ID:', err);
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
			console.log('[cartApi] Updating item quantity:', { cartItemId, quantity });

			const response = await fetch(`${CART_API_ENDPOINT}/items/${cartItemId}`, {
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ quantity }),
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				console.error('[cartApi] Failed to update item quantity:', { status: response.status, error });
				throw new Error(error.message || `Failed to update item quantity (${response.status})`);
			}

			console.log('[cartApi] Item quantity updated successfully');
		} catch (err) {
			console.error('[cartApi] Error updating item quantity:', err);
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
			console.log('[cartApi] Removing item from cart:', cartItemId);

			const response = await fetch(`${CART_API_ENDPOINT}/items/${cartItemId}`, {
				method: 'DELETE',
			});

			if (!response.ok) {
				const error = await response.json().catch(() => ({}));
				console.error('[cartApi] Failed to remove item:', { status: response.status, error });
				throw new Error(error.message || `Failed to remove item (${response.status})`);
			}

			console.log('[cartApi] Item removed successfully');
		} catch (err) {
			console.error('[cartApi] Error removing item:', err);
			throw err;
		}
	},
};
