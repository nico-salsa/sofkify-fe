import type { Product } from './product';

// ============================================
// Cart Item - Producto en el carrito (Data Only)
// ============================================
export interface CartItem extends Omit<Product, 'status' | 'createdAt' | 'updatedAt'> {
	quantity: number;
	subtotal: number;
}

// ============================================
// Cart State - Estado del carrito
// ============================================
export interface Cart {
	id: string;
	userId: string;
	items: CartItem[];
	total: number;
	totalQuantity: number;
	createdAt: string;
	updatedAt: string;
}

// ============================================
// Cart Confirmation - Confirmación de carrito
// ============================================
export interface ConfirmCartResponse {
	success: boolean;
	cartId: string;
	confirmedAt: string; // ISO8601
	orderId: string; // UUID
}

export interface CartConfirmationError {
	success: false;
	code: 'STOCK_ERROR' | 'EMPTY_CART' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'UNKNOWN_ERROR';
	message: string;
	details?: {
		productId?: string;
		available?: number;
		requested?: number;
	};
}

// ============================================
// Component Props Types
// ============================================
export type CartItemProps = {
	item: CartItem;
};
