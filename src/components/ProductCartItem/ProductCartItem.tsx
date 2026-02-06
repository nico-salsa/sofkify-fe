import React from 'react';

export interface ProductCartItemProps {
  id?: string;
  image?: string;
  title?: string;
  quantity?: number;
  price?: number; // per item
  onRemove?: (id: string) => void;
  onIncrease?: (id: string) => void;
  onDecrease?: (id: string) => void;
}

const ProductCartItem: React.FC<ProductCartItemProps> = ({
  id,
  image,
  title,
  quantity,
  price,
  onRemove,
  onIncrease,
  onDecrease,
}) => {
  const total = (price ?? 0) * (quantity ?? 0);

  return (
    <div className="flex items-center gap-4 p-4 border-b border border-sofka-primary rounded-2xl">
      <img src={image} alt={title} className="w-20 h-20 object-contain rounded" />

      <div className="flex-1">
        <div className="flex items-start justify-between">
          <h3 className="text-sm font-medium">{title}</h3>
          <button
            onClick={() => onRemove && id && onRemove(id)}
            aria-label={`Remove ${title}`}
            className="text-sm text-red-600 hover:underline ml-4"
          >
            Quitar
          </button>
        </div>

        <div className="mt-2 flex items-center gap-4">
          <div className="flex items-center border rounded overflow-hidden">
            <button
              onClick={() => onDecrease && id && onDecrease(id)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              aria-label={`Decrease ${title}`}
            >
              -
            </button>
            <div className="px-4 py-1 bg-white">{quantity}</div>
            <button
              onClick={() => onIncrease && id && onIncrease(id)}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200"
              aria-label={`Increase ${title}`}
            >
              +
            </button>
          </div>

          <div className="text-sm text-gray-700">Precio: ${(price ?? 0).toFixed(2)}</div>
          <div className="text-sm font-semibold">Total: ${total.toFixed(2)}</div>
        </div>
      </div>
    </div>
  );
};

export default ProductCartItem;
