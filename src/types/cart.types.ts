import type { Product } from './product';

//interfaz para el carrito de compras
export interface CartItem extends Omit<Product, 'status' | 'createdAt' | 'updatedAt'> {
	quantity: number;
	subtotal: number;
	onRemove?: (id: string) => void;
  	onIncrease?: (id: string) => void;
  	onDecrease?: (id: string) => void;
}

// ============================================
// Component Props Types
// ============================================

export type CartItemProps = {
	item: CartItem;
};
