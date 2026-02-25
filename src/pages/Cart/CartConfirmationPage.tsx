/**
 * Cart Confirmation Page
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth.ts';
import { useCart } from '../../hooks/useCart';
import type { CartItem } from '../../types/cart.types';
import { useCartConfirmation } from '../../hooks/useCartConfirmation';
import ProductCartItem from '../../components/ProductCartItem/ProductCartItem';

const CartConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    items: cartItems = [],
    total = 0,
    totalQuantity = 0,
    updateQuantity,
    removeItem,
    clearCart,
  } = useCart();
  const { isLoading, error, data, confirmCart } = useCartConfirmation();
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth', { state: { from: '/cart/confirmation' } });
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    if (data?.order?.id) {
      clearCart();
      navigate(`/order-success/${data.order.id}`);
    }
  }, [clearCart, data?.order?.id, navigate]);

  const handleConfirmClick = async () => {
    setLocalError(null);

    if (cartItems.length === 0) {
      setLocalError('El carrito esta vacio');
      return;
    }

    const stockIssue = cartItems.find((item: CartItem) => item.quantity > item.stock);
    if (stockIssue) {
      setLocalError(`Stock insuficiente para ${stockIssue.name}. Disponible: ${stockIssue.stock}`);
      return;
    }

    if (!user?.id) {
      setLocalError('Error: usuario no autenticado correctamente');
      return;
    }

    try {
      await confirmCart(
        user.id,
        cartItems.map((item: CartItem) => ({
          productId: item.id,
          quantity: item.quantity,
        }))
      );
    } catch (err) {
      setLocalError('Error al procesar la solicitud. Intenta de nuevo.');
      console.error('[CartConfirmationPage] Error:', err);
    }
  };

  const isConfirmDisabled = cartItems.length === 0 || isLoading;

  return (
    <div className="w-11/12 mx-auto max-w-286 py-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Carrito de Compras</h1>

      {cartItems.length === 0 && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 text-lg mb-4">Tu carrito esta vacio</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Volver a Tienda
          </button>
        </div>
      )}

      {cartItems.length > 0 && (
        <>
          <div className="border rounded-lg p-4 bg-gray-50 mb-6">
            <h2 className="text-lg font-semibold mb-4">Resumen del Carrito</h2>

            <ul className="space-y-4" role="list">
              {cartItems.map((item: CartItem) => (
                <li key={item.id} className="border-b pb-4 last:border-b-0">
                  <ProductCartItem
                    {...item}
                    onUpdateQuantity={(qty) => updateQuantity(item.id, qty)}
                    onRemoveItem={() => removeItem(item.id)}
                  />

                  {item.quantity > item.stock && (
                    <div className="mt-2 bg-red-100 border border-red-400 text-red-700 p-2 rounded text-sm">
                      Stock insuficiente: {item.stock} disponible(s), solicitados: {item.quantity}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-end bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-lg mb-2">
              <strong>Cantidad Total:</strong> {totalQuantity} items
            </p>
            <p className="text-3xl font-bold text-blue-600">
              <strong>Total:</strong> ${total.toFixed(2)}
            </p>
          </div>

          {(localError || error) && (
            <div className="mb-6 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
              <p className="font-semibold">{localError || error?.message}</p>
              {error?.details && (
                <p className="text-sm mt-2 text-red-600">
                  {error.details.productId && `Producto: ${error.details.productId} | `}
                  {error.details.available !== undefined && `Disponible: ${error.details.available} | `}
                  {error.details.requested !== undefined && `Solicitado: ${error.details.requested}`}
                </p>
              )}
            </div>
          )}

          <div className="flex justify-between gap-4">
            <button
              onClick={() => navigate('/')}
              className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
            >
              Volver a Tienda
            </button>

            <button
              onClick={handleConfirmClick}
              disabled={isConfirmDisabled}
              className={`flex-1 px-8 py-3 rounded font-semibold transition flex items-center justify-center gap-2 ${
                isConfirmDisabled
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
                  : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
              }`}
              title={isConfirmDisabled ? 'El carrito esta vacio o no hay stock disponible' : ''}
            >
              {isLoading ? 'Procesando...' : 'Confirmar Carrito'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CartConfirmationPage;
