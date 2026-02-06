import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useGetProducts from '../../api/useGetProducts';
import type { CartItem } from '../../api/types';

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value);
};

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const products = useGetProducts();
  const [product, setProduct] = useState<CartItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    setLoading(true);
    const p = products.find((it) => it.id === id) || null;
    setProduct(p);
    setLoading(false);
  }, [id, products]);

  if (loading) {
    return (
      <div className="container-sofka px-4 py-8">
        <p>Cargando producto...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container-sofka px-4 py-8">
        <p>Producto no encontrado.</p>
        <button className="btn-outline mt-4" onClick={() => navigate(-1)}>Volver</button>
      </div>
    );
  }

  return (
    <div className="container-sofka px-4 py-8">
      <div className="grid grid-cols-12 gap-6 items-start">
        <div className="col-span-12 md:col-span-6">
          <div className="card-sofka p-4">
            <img src={product.image} alt={product.name} className="w-full h-auto object-contain" />
          </div>
        </div>

        <div className="col-span-12 md:col-span-6">
          <h1 className="text-2xl font-bold mb-2">{product.name}</h1>
          <p className="text-gray-600 mb-4">{product.description}</p>
          <p className="text-2xl text-corporate-orange font-semibold mb-4">{formatCurrency(product.price)}</p>

          <div className="flex items-center gap-4 mb-4">
            <label className="font-medium">Cantidad:</label>
            <div className="flex items-center">
              <button className="btn-outline px-3" onClick={() => setQty((q) => Math.max(1, q - 1))}>-</button>
              <input type="number" value={qty} onChange={(e) => setQty(Math.max(1, Number(e.target.value || 1)))} className="input-sofka w-16 text-center mx-2" />
              <button className="btn-outline px-3" onClick={() => setQty((q) => q + 1)}>+</button>
            </div>
          </div>

          <div className="flex gap-3">
            <button className="btn-primary" onClick={() => alert('Añadido al carrito (mock)')}>Agregar al carrito</button>
            <button className="btn-outline" onClick={() => alert('Comprar ahora (mock)')}>Comprar ahora</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
