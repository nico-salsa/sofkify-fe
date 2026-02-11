import React from 'react';
import ProductCartItem from '../../components/ProductCartItem/ProductCartItem';
interface ICartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  image: string;
}

interface ICartProps {
  items: ICartItem[];
}

const product = {
  id: "1",
  title: "Product 1",
  price: 19.99,
  image: "/sofkify_generic_product.png",
};


const Cart: React.FC<ICartProps> = ({ items }) => {
  const totalPrice = items.reduce((acc, item) => acc + item.price * item.stock, 0);
  const totalQuantity = items.reduce((acc, item) => acc + item.stock, 0);

  return (
    <div className='w-11/12 mx-auto max-w-286'>
      <h3 className="text-2xl font-bold mb-4 text-center">Carrito de compras</h3>
      <ul className='flex flex-col'>
        <ProductCartItem id={product.id} price={product.price} image={product.image} title={product.title} />
        {items.map((item) => (
          <li key={item.name}>
            <span>{item.name}</span>
            <span>${item.price}</span>
            <span>{item.stock}</span>
          </li>
        ))}
      </ul>
      <p>Total Price: ${totalPrice}</p>
      <p>Total Quantity: {totalQuantity}</p>
    </div>
  );
};

export default Cart;