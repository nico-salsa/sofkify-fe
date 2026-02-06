import { useEffect, useState } from 'react';
import type { CartItem } from './types.ts';
import { cartItems } from './products';

const useGetProducts = () => {
  const [products, setProducts] = useState<CartItem[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProducts(cartItems);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProducts();
  }, []);

  return products;
};

export default useGetProducts;