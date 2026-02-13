import React from 'react';
import  type { CartItem } from '../../types/cart.types';
import { useState } from 'react';
/* export interface ProductCartItemProps {
  item: CartItem;
}
 */
const ProductCartItem: React.FC<CartItem> = ({ quantity, subtotal, onRemove, onIncrease, onDecrease, ...item  }) => {
  const [cartQuantity, setCartQuantity] = useState<number>(0);

  const handleDecrease = () => {
    // Solo disminuir si la cantidad es mayor a 0 y si existe la función
      setCartQuantity(prev => prev > 0 ? prev - 1 : 0);
  };

  const handleIncrease = () => {
    // Solo aumentar si no excede el stock disponible y si existe la función
      setCartQuantity(prev=>prev+1);
  };
  return (
    <div className="flex items-center gap-4 p-4 border-b border border-sofka-primary rounded-2xl">
      <img src={item.image} alt={item.name} className="w-20 h-20 object-contain rounded" /> 

      <div className="flex-1">
        <div className="flex items-start justify-between">
            <h3 className="text-sm font-medium">{item.name}</h3>
            {onRemove && (
              <button
                onClick={() => onRemove(item.id)}
                aria-label={`Remove ${item.name}`}
                //className="text-sm text-red-600 hover:underline ml-4"
              >
                Quitar
              </button>
            )}
          </div>

        <div className="mt-2  flex items-center gap-4">
          <div className="flex max-w-24 items-center border rounded overflow-hidden">
            <button
              onClick={handleDecrease}
              className={`px-3 py-1 w-1/3 bg-gray-100 hover:bg-gray-200`}
              aria-label={`Decrease ${item.name}`}
            >
              -
            </button>
            <input type='text' className=" w-1/3 py-1 bg-white text-center" value={cartQuantity} />
            <button
              onClick={handleIncrease}
              className={`px-3 py-1 w-1/3 bg-gray-100 hover:bg-gray-200`}
              aria-label={`Increase ${item.name}`}
            >
              +
            </button>
          </div>
          <div className='flex flex-col ml-auto'>  
            <p className="text-sm text-gray-700 ">Precio: ${item.price.toFixed(2)}</p>
            <p className="text-sm font-semibold">Total: ${(item.price * quantity).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCartItem;
