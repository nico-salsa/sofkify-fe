import type { CartItem } from '../../types/cart.types';

export interface ProductCartItemProps {
  item: CartItem;
  onRemove: (id: string) => void;
  onIncrease: (id: string) => void;
  onDecrease: (id: string) => void;
}