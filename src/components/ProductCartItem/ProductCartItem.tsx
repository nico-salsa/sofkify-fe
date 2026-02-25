import React, { useEffect, useState } from 'react';
import type { CartItem } from '../../types/cart.types';

interface ProductCartItemProps extends CartItem {
  onUpdateQuantity?: (quantity: number) => void;
  onRemoveItem?: (productId: string) => void;
}

const ProductCartItem: React.FC<ProductCartItemProps> = ({
  id,
  name,
  image,
  price,
  quantity,
  stock,
  onUpdateQuantity,
  onRemoveItem,
}) => {
  const [cartQuantity, setCartQuantity] = useState<number>(quantity);

  // Sincronizar cantidad con las props cuando cambia
  useEffect(() => {
    setCartQuantity(quantity);
  }, [quantity]);

  const handleDecrease = () => {
    const newQty = Math.max(1, cartQuantity - 1);
    setCartQuantity(newQty);
    if (onUpdateQuantity) {
      onUpdateQuantity(newQty);
    }
  };

  const handleIncrease = () => {
    if (cartQuantity < stock) {
      const newQty = cartQuantity + 1;
      setCartQuantity(newQty);
      if (onUpdateQuantity) {
        onUpdateQuantity(newQty);
      }
    }
  };

  const handleRemove = () => {
    if (onRemoveItem) {
      onRemoveItem(id);
    }
  };
  const itemTotal = price * cartQuantity;

  return (
    <div className="flex items-center gap-4 p-4 border-b border border-sofka-primary rounded-2xl">
      <img src={image} alt={name} className="w-20 h-20 object-contain rounded" />

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium">{name}</h3>
          {onRemoveItem && (
            <button
              onClick={handleRemove}
              aria-label={`Remove ${name}`}
              className="text-sm text-red-600 hover:text-red-800 font-medium"
            >
              ✕ Quitar
            </button>
          )}
        </div>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex max-w-24 items-center border rounded overflow-hidden">
            <button
              onClick={handleDecrease}
              disabled={cartQuantity <= 1}
              className="px-3 py-1 w-1/3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Decrease ${name}`}
            >
              −
            </button>
            <input
              type="number"
              className="w-1/3 py-1 bg-white text-center border-0 outline-none"
              value={cartQuantity}
              readOnly
              min="1"
              max={stock}
            />
            <button
              onClick={handleIncrease}
              disabled={cartQuantity >= stock}
              className="px-3 py-1 w-1/3 bg-gray-100 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label={`Increase ${name}`}
            >
              +
            </button>
          </div>
          <div className="flex flex-col ml-auto text-right">
            <p className="text-sm text-gray-700">Precio: ${price.toFixed(2)}</p>
            <p className="text-sm font-semibold text-corporate-orange">Subtotal: ${itemTotal.toFixed(2)}</p>
            {cartQuantity === stock && stock > 0 && (
              <p className="text-xs text-orange-500 mt-1">Max disponible</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCartItem;
