import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { CartContext } from './cart-context';
import type { CartItem } from '../types/cart.types';
import { cartApi } from '../services/cart/cartApi';
import { authStorage } from '../services/auth/authStorage';

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [backendCartId, setBackendCartId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Cargar carrito al iniciar: primero desde localStorage, luego intentar desde API
  useEffect(() => {
    const loadCart = async () => {
      try {
        // Intenta cargar desde API si hay usuario autenticado
        const token = authStorage.getToken();
        if (token) {
          try {
            console.log('[CartContext] Attempting to load cart from API...');
            const activeCart = await cartApi.getActiveCart();
            if (activeCart && activeCart.items) {
              setItems(activeCart.items);
              setError(null);
              setIsLoading(false);
              return;
            }
          } catch (apiErr) {
            console.warn('[CartContext] Failed to load from API, using localStorage:', apiErr);
          }
        }

        // Fallback: cargar desde localStorage
        const storedCart = localStorage.getItem('cart');
        if (storedCart) {
          setItems(JSON.parse(storedCart));
        } else {
          setItems([]);
        }
        setError(null);
      } catch (err) {
        console.error('[CartContext] Error loading cart:', err);
        setError(err instanceof Error ? err : new Error('Failed to load cart'));
        setItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, []);

  // Sincronizar cambios a localStorage siempre
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('cart', JSON.stringify(items));
    }
  }, [items, isLoading]);

  const total = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const addItem = async (item: CartItem) => {
    try {
      // Items are stored locally only. Backend sync happens atomically
      // in useCartConfirmation.confirmCart() to avoid double-quantity issues.
      setItems((prevItems) => {
        const existingItem = prevItems.find((i) => i.id === item.id);
        if (existingItem) {
          return prevItems.map((i) =>
            i.id === item.id
              ? {
                  ...i,
                  quantity: i.quantity + item.quantity,
                  subtotal: (i.quantity + item.quantity) * i.price,
                }
              : i
          );
        }
        return [...prevItems, item];
      });
    } catch (err) {
      console.error('[CartContext] Error adding item:', err);
      setError(err instanceof Error ? err : new Error('Failed to add item'));
    }
  };

  const removeItem = async (productId: string) => {
    try {
      const token = authStorage.getToken();

      // Intentar eliminar del API si hay usuario autenticado
      if (token) {
        try {
          console.log('[CartContext] Removing item from API:', productId);
          await cartApi.removeItem(productId);
          console.log('[CartContext] Item removed from API successfully');
        } catch (apiErr) {
          console.warn('[CartContext] Failed to remove from API, using local only:', apiErr);
        }
      }

      // Actualizar estado local en cualquier caso
      setItems((prevItems) => prevItems.filter((i) => i.id !== productId));
    } catch (err) {
      console.error('[CartContext] Error removing item:', err);
      setError(err instanceof Error ? err : new Error('Failed to remove item'));
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    try {
      if (quantity <= 0) {
        removeItem(productId);
        return;
      }

      const token = authStorage.getToken();

      // Intentar actualizar en el API si hay usuario autenticado
      if (token) {
        try {
          console.log('[CartContext] Updating quantity in API:', productId, quantity);
          await cartApi.updateItemQuantity(productId, quantity);
          console.log('[CartContext] Quantity updated in API successfully');
        } catch (apiErr) {
          console.warn('[CartContext] Failed to update in API, using local only:', apiErr);
        }
      }

      // Actualizar estado local en cualquier caso
      setItems((prevItems) =>
        prevItems.map((i) =>
          i.id === productId ? { ...i, quantity, subtotal: quantity * i.price } : i
        )
      );
    } catch (err) {
      console.error('[CartContext] Error updating quantity:', err);
      setError(err instanceof Error ? err : new Error('Failed to update quantity'));
    }
  };

  const clearCart = () => {
    setItems([]);
    setBackendCartId(null); // Reset backend cart ID
    localStorage.removeItem('cart');
  };

  return (
    <CartContext.Provider
      value={{ items, total, totalQuantity, backendCartId, isLoading, error, addItem, removeItem, updateQuantity, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
};
