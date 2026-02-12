import { useEffect, useState } from 'react';
import type { ProductDTO } from '../types/product';
import { cartItems } from './products';

const useGetProducts = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);

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