import React from 'react';

interface ICartItem {
  name: string;
  price: number;
  quantity: number;
}

interface ICartProps {
  items: ICartItem[];
}

const Cart: React.FC<ICartProps> = ({ items }) => {
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <div>
      <h2>Cart</h2>
      <ul>
        {items.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>${item.price}</span>
            <span>{item.quantity}</span>
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice}</p>
      <p>Total Quantity: {totalQuantity}</p>
    </div>
  );
};

export default Cart;