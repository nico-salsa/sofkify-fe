import React from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from './types';

interface ProductProps {
  product: CartItem;
}

const Product: React.FC<ProductProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="w-full p-4 rounded-lg border border-yellow bg-gray-200">
        <img src={product.image} alt={product.name} className="w-full h-auto" />
        <h3 className="text-lg font-bold text-orange-500">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </Link>
  );
};

export default Product;