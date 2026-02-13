import type { CartItem } from '../../types/cart.types';

export const cartItems: CartItem[] = [
  {
    id: '1',
    name: 'Product 1',
    description: 'Description 1',
    price: 10,
    stock: 2,
    image: '/sofkify_generic_product.png',
    quantity: 1,
    subtotal: 10,
  },
  {
    id: '2',
    name: 'Product 2',
    description: 'Description 2',
    price: 15,
    stock: 3,
    image: '/sofkify_generic_product.png',
    quantity: 1,
    subtotal: 15,
  },
  {
    id: '3',
    name: 'Product 3',
    description: 'Description 3',
    price: 20,
    stock: 5,
    image: '/sofkify_generic_product.png',
    quantity: 1,
    subtotal: 20,
  },
];