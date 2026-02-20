import React, { useEffect } from 'react';
import ProductCartItem from '../../components/ProductCartItem/ProductCartItem';
import { cartItems } from './data';
import type { CartItem } from '../../types/cart.types';

/**
 * Renders the cart summary view using local mock data.
 *
 * This component currently displays items, total amount, and total quantity.
 */
const Cart: React.FC = () => {
  const [items, setItems] = React.useState<CartItem[]>([]);


  useEffect(() => {
    setItems(cartItems);
  }, []);

  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div className='w-11/12 mx-auto max-w-286'>
      <h3 className="text-2xl font-bold mb-4 text-center">Carrito de compras</h3>
      <ul className='flex flex-col'>
        {items.map((item) => (
          <li key={item.id} className='first:mt-0 mt-4'>
            <ProductCartItem
              id={item.id}
              name={item.name}
              price={item.price}
              image={item.image}
              quantity={item.quantity} subtotal={0} description={''} stock={0}/>         
          </li>
        ))}
      </ul>
    <div className="flex flex-col items-end mt-2">
      <p className='text-left'>Total Price: ${totalPrice}</p>
      <p className='text-left'>Total Quantity: {totalQuantity}</p>
    </div>  
    </div>
  );
};

export default Cart;
