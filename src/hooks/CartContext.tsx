import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CartContext } from './cart-context';
import type { CartItem } from '../types/cart.types';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem('cart');
      if (storedCart) {
        setItems(JSON.parse(storedCart));
      } else {
        setItems([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load cart'));
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoading]);

  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id
            ? { ...i, quantity: i.quantity + item.quantity, subtotal: (i.quantity + item.quantity) * i.price }
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (productId: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prevItems) =>
      prevItems.map((i) =>
        i.id === productId ? { ...i, quantity, subtotal: quantity * i.price } : i
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{ items, total, totalQuantity, isLoading, error, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
