import { useEffect, useState } from 'react';
import ProductComponent from '../../components/Product/Product';
import { getAllProducts } from '../../services/products/productService';
import type { ProductDTO } from '../../types/product';

const Product: React.FC = () => {
  const [products, setProducts] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const settedProducts = await getAllProducts();
        setProducts(settedProducts);
        setLoading(false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-gray-500">Cargando productos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <p className="text-center text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-2xl font-bold mb-4 text-center mt-2">Nuestros productos</h1>
      <ul className="grid max-sm:grid-cols-1 grid-cols-3 gap-4 w-11/12 mx-auto max-w-286 max-md:grid-cols-2">
        {products.length > 0 ? (
          products.map((product, index) => (
            <li key={index}>
              <ProductComponent product={product} />
            </li>
          ))
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">No hay productos disponibles</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Product;