import type { ProductDTO, Product } from '../../types/product';
import { cartItems } from './products';

/**
 * ProductService - Service layer for product operations
 * Responsibilities:
 * - API calls to Product Service (port 8081, /api context)
 * - DTO → Product transformation
 * - Error handling with fallback to mock data
 * - Future: Caching/optimization
 */

// Product Service URL configuration
const PRODUCT_SERVICE_URL = import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8081';
const PRODUCT_API_ENDPOINT = `${PRODUCT_SERVICE_URL}/api/products`;

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
 * Get all products from Product Service API with fallback to mock data
 * GET /api/products (with optional status filter)
 * @returns Promise with array of ProductDTO
 */
export const getAllProducts = async (): Promise<ProductDTO[]> => {
  try {
    const response = await fetch(`${PRODUCT_API_ENDPOINT}?status=ACTIVE`);
    
    if (!response.ok) {
      console.warn(`Product Service error: ${response.status}, using fallback data`);
      return cartItems;
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.warn('Error fetching products from Product Service, using fallback data:', error);
    // Return mock data as fallback
    return cartItems;
  }
};

/**
 * Get a single product by ID
 * GET /api/products/{productId}
 * @param id - Product ID
 * @returns Promise with ProductDTO or null if not found
 */
export const getProductById = async (id: string): Promise<ProductDTO | null> => {
  try {
    const response = await fetch(`${PRODUCT_API_ENDPOINT}/${id}`);
    
    if (response.status === 404) {
      // First try real API, if 404 fallback to mock
      const mockProduct = cartItems.find((item) => item.id === id);
      return mockProduct || null;
    }

    if (!response.ok) {
      console.warn(`Product Service error: ${response.status}, trying fallback`);
      const mockProduct = cartItems.find((item) => item.id === id);
      return mockProduct || null;
    }

    return await response.json();
  } catch (error) {
    console.warn(`Error fetching product ${id}, using fallback:`, error);
    // Fallback to mock data
    const mockProduct = cartItems.find((item) => item.id === id);
    return mockProduct || null;
  }
};

/**
 * Search products by query string
 * GET /api/products with search query params
 * @param query - Search term
 * @returns Promise with filtered ProductDTO array
 */
export const searchProducts = async (query: string): Promise<ProductDTO[]> => {
  try {
    const searchParams = new URLSearchParams({
      search: query,
      status: 'ACTIVE',
    });

    const response = await fetch(`${PRODUCT_API_ENDPOINT}?${searchParams.toString()}`);
    
    if (!response.ok) {
      console.warn(`Product Service error: ${response.status}, using fallback data`);
      // Fallback: filter mock data
      const lowerQuery = query.toLowerCase();
      return cartItems.filter(
        (item) =>
          item.name.toLowerCase().includes(lowerQuery) ||
          item.description.toLowerCase().includes(lowerQuery)
      );
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.warn('Error searching products, using fallback data:', error);
    // Fallback: filter mock data
    const lowerQuery = query.toLowerCase();
    return cartItems.filter(
      (item) =>
        item.name.toLowerCase().includes(lowerQuery) ||
        item.description.toLowerCase().includes(lowerQuery)
    );
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
    // Try API first with query params
    const searchParams = new URLSearchParams({
      status: 'ACTIVE',
      minPrice: min.toString(),
      maxPrice: max.toString(),
    });

    const response = await fetch(`${PRODUCT_API_ENDPOINT}?${searchParams.toString()}`);
    
    if (!response.ok) {
      console.warn(`Product Service error: ${response.status}, using fallback data`);
      return cartItems.filter((item) => item.price >= min && item.price <= max);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.warn('Error filtering products by price, using fallback data:', error);
    // Fallback: filter mock data
    return cartItems.filter((item) => item.price >= min && item.price <= max);
  }
};
export const transformProductDTOsToProducts = (dtos: ProductDTO[]): Product[] => {
  return dtos.map(transformProductDTOToProduct);
};
