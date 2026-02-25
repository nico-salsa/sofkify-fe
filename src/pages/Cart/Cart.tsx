import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import Swal from 'sweetalert2';

/**
 * Renders the cart view with real data from useCart hook.
 * Displays items, total amount, total quantity, and checkout functionality.
 */
const Cart: React.FC = () => {
  const navigate = useNavigate();
  const { items, total, totalQuantity, removeItem, updateQuantity } = useCart();
  const [isLoading, setIsLoading] = React.useState(false);

  console.log('[Cart] Items en el carrito:', items);
  console.log('[Cart] Total:', total, 'TotalQuantity:', totalQuantity);

  const handleRemoveItem = (productId: string) => {
    removeItem(productId);
    Swal.fire({
      icon: 'success',
      title: 'Producto eliminado',
      text: 'El producto ha sido removido del carrito',
      timer: 1500,
    });
  };

  const handleIncreaseQuantity = (productId: string, currentQuantity: number) => {
    updateQuantity(productId, currentQuantity + 1);
  };

  const handleDecreaseQuantity = (productId: string, currentQuantity: number) => {
    if (currentQuantity > 1) {
      updateQuantity(productId, currentQuantity - 1);
    } else {
      handleRemoveItem(productId);
    }
  };

  const handleCheckout = async () => {
    if (items.length === 0) {
      await Swal.fire({
        icon: 'warning',
        title: 'Carrito vacío',
        text: 'Agrega productos antes de proceder al pago',
      });
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implementar lógica de checkout/payment
      await Swal.fire({
        icon: 'success',
        title: '¡Orden creada!',
        text: 'Tu compra ha sido procesada correctamente',
      });
      navigate('/order-success');
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Something went wrong');
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-11/12 mx-auto max-w-4xl py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">🛒 Carrito de Compras</h1>

      {items.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 mb-4">Tu carrito está vacío</p>
          <button
            onClick={() => navigate('/products')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded"
          >
            Continuar comprando
          </button>
        </div>
      ) : (
        <>
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                >
                  {/* Product Image */}
                  <div className="w-24 h-24 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900">{item.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.description}</p>
                    <p className="text-blue-600 font-bold mt-2">${item.price.toFixed(2)}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
                    <button
                      onClick={() => handleDecreaseQuantity(item.id, item.quantity)}
                      className="px-3 py-1 text-red-600 hover:bg-red-100 rounded font-bold"
                      title="Disminuir cantidad"
                    >
                      −
                    </button>
                    <span className="px-4 py-1 font-semibold text-gray-900">{item.quantity}</span>
                    <button
                      onClick={() => handleIncreaseQuantity(item.id, item.quantity)}
                      className="px-3 py-1 text-green-600 hover:bg-green-100 rounded font-bold"
                      title="Aumentar cantidad"
                    >
                      +
                    </button>
                  </div>

                  {/* Subtotal */}
                  <div className="text-right min-w-max">
                    <p className="text-gray-600 text-sm">Subtotal:</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    className="px-4 py-2 ml-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition"
                    title="Eliminar del carrito"
                  >
                    🗑️ Eliminar
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <div className="space-y-3">
              <div className="flex justify-between text-gray-700">
                <span>Cantidad total de productos:</span>
                <span className="font-bold">{totalQuantity}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-3">
                <span>Total a pagar:</span>
                <span className="text-green-600">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-end">
            <button
              onClick={() => navigate('/products')}
              className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white font-bold rounded transition"
              disabled={isLoading}
            >
              ← Continuar Comprando
            </button>
            <button
              onClick={handleCheckout}
              className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-bold rounded transition disabled:opacity-50"
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? 'Procesando...' : '💳 Ir a Pagar'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;