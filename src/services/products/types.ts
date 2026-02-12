import type { ProductDTO } from '../../types/product';

/**
 *  Este archivo re-exporta tipos desde src/types/product.ts
 * Importa directamente desde src/types/product.ts en su lugar
 */
export interface UseGetProductsReturn {
  products: ProductDTO[];
  loading: boolean;
  error: string | null;
}

export type { CartItem } from '../../types/cart.types';
export type { Product, ProductDTO, ProductPresentation } from '../../types/product';