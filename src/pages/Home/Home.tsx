import React from 'react';
import useGetProducts from '../../api/useGetProducts';
import Product from '../../components/Product/Product';

const Home: React.FC = () => {
  const products = useGetProducts();

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center mt-2">Nuestros productos</h1>
      <ul className="grid grid-cols-3 gap-4">
        {products?.length > 0 ? (
          products.map((product, index) => (
            <li key={index} className="bg-gray-200 p-4">
              <Product product={product} />
            </li>
          ))
        ) : (
          <p className="text-center text-gray-500">No products available</p>
        )}
      </ul>
    </div>
  );
};

export default Home;