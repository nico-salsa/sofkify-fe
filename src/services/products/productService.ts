import type { ProductDTO, Product } from '../../types/product';
import { cartItems } from './products';

/**
 * ProductService - Service layer for product operations
 * Responsibilities:
 * - API calls (currently mocked)
 * - DTO → Product transformation
 * - Error handling
 * - Future: Caching/optimization
 */

/**
 * Transforms ProductDTO from API to internal Product model
 */
const transformProductDTOToProduct = (dto: ProductDTO): Product => {
  return {
    ...dto,
    status: dto.active,
  };
};

/**
 * Get all products from API
 * @returns Promise with array of ProductDTO
 */
export const getAllProducts = async (): Promise<ProductDTO[]> => {
  try {
    // TODO: Replace with real API call
    // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}`);
    // return await response.json();
    console.log(cartItems);
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 300));
    return cartItems;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw new Error('Failed to fetch products');
  }
};

/**
 * Get a single product by ID
 * @param id - Product ID
 * @returns Promise with ProductDTO or null if not found
 */
export const getProductById = async (id: string): Promise<ProductDTO | null> => {
  try {
    // TODO: Replace with real API call
    // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}/${id}`);
    // return await response.json();
    
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = cartItems.find((item) => item.id === id);
    return product || null;
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
  }
};

/**
 * Search products by query string
 * @param query - Search term
 * @returns Promise with filtered ProductDTO array
 */
export const searchProducts = async (query: string): Promise<ProductDTO[]> => {
  try {
    // TODO: Replace with real API call with query params
    // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?search=${query}`);
    // return await response.json();
    
    await new Promise((resolve) => setTimeout(resolve, 250));
    const lowerQuery = query.toLowerCase();
    return cartItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
  } catch (error) {
    console.error('Error searching products:', error);
    throw new Error('Failed to search products');
  }
};

/**
 * Filter products by price range
 * @param min - Minimum price
 * @param max - Maximum price
 * @returns Promise with filtered ProductDTO array
 */
export const filterByPrice = async (min: number, max: number): Promise<ProductDTO[]> => {
  try {
    // TODO: Replace with real API call with query params
    // const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.PRODUCTS}?minPrice=${min}&maxPrice=${max}`);
    // return await response.json();
    
    await new Promise((resolve) => setTimeout(resolve, 250));
    return cartItems.filter((item) => item.price >= min && item.price <= max);
  } catch (error) {
    console.error('Error filtering products by price:', error);
    throw new Error('Failed to filter products');
  }
};

/**
 * Transform ProductDTO array to Product array (for internal use)
 * @param dtos - Array of ProductDTO
 * @returns Array of Product
 */
export const transformProductDTOsToProducts = (dtos: ProductDTO[]): Product[] => {
  return dtos.map(transformProductDTOToProduct);
};
