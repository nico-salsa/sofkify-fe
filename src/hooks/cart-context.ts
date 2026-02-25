import { createContext } from 'react';
import type { CartItem } from '../types/cart.types';

export interface CartContextValue {
  items: CartItem[];
  total: number;
  totalQuantity: number;
  isLoading: boolean;
  error: Error | null;
  addItem: (item: CartItem) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | undefined>(undefined);
