import type { ProductDTO, Product } from '../../types/product';
import { API_CONFIG } from '../api/config';
import { httpRequest } from '../http/httpClient';

interface BackendProductResponse {
  productId: string;
  name: string;
  description: string;
  sku?: string;
  price: number;
  stock: number;
  status: string;
}

const DEFAULT_IMAGE = '/sofkify_generic_product.png';

const mapToProductDTO = (product: BackendProductResponse): ProductDTO => {
  return {
    id: product.productId,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    image: DEFAULT_IMAGE,
    stock: Number(product.stock),
    active: product.status?.toUpperCase?.() === 'ACTIVE',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getAllProducts = async (): Promise<ProductDTO[]> => {
  const response = await httpRequest<BackendProductResponse[]>(`${API_CONFIG.PRODUCTS_BASE_URL}/products`);
  return response.map(mapToProductDTO);
};

export const getProductById = async (id: string): Promise<ProductDTO | null> => {
  try {
    const response = await httpRequest<BackendProductResponse>(`${API_CONFIG.PRODUCTS_BASE_URL}/products/${id}`);
    return mapToProductDTO(response);
  } catch {
    return null;
  }
};

export const searchProducts = async (query: string): Promise<ProductDTO[]> => {
  const products = await getAllProducts();
  const lowerQuery = query.toLowerCase();

  return products.filter(
    (item) =>
      item.name.toLowerCase().includes(lowerQuery) ||
      item.description.toLowerCase().includes(lowerQuery)
  );
};

export const filterByPrice = async (min: number, max: number): Promise<ProductDTO[]> => {
  const products = await getAllProducts();
  return products.filter((item) => item.price >= min && item.price <= max);
};

export const transformProductDTOsToProducts = (dtos: ProductDTO[]): Product[] => {
  return dtos.map((dto) => ({
    ...dto,
    status: dto.active,
  }));
};
