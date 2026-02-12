import type { Product } from './product';

//interfaz para el carrito de compras
export interface CartItem extends Omit<Product, 'status' | 'createdAt' | 'updatedAt'> {
	quantity: number;
	subtotal: number;
}

// ============================================
// Component Props Types
// ============================================

export type CartItemProps = {
	item: CartItem;
};
