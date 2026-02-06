import React from 'react';
import type { CartItem } from './types';

interface ProductProps {
  product: CartItem;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <div className="w-full p-4 rounded-lg border border-yellow bg-gray-200">
      <img src={product.image} alt={product.name} className="w-full h-auto" />
      <h3 className="text-lg font-bold text-orange-500">{product.name}</h3>
      <p className="text-gray-600">${product.price}</p>
    </div>
  );
};

export default Product;