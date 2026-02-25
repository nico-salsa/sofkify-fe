import type { ProductDTO, Product } from '../../types/product';

/**
 * ProductService - Service layer for product operations
 * Responsibilities:
 * - API calls to Product Service (port 8081, /api context)
 * - DTO → Product transformation
 * - Error handling
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
 * Get all products from Product Service API
 * GET /api/products (with optional status filter)
 * @returns Promise with array of ProductDTO
 */
export const getAllProducts = async (): Promise<ProductDTO[]> => {
  try {
    const response = await fetch(`${PRODUCT_API_ENDPOINT}?status=ACTIVE`);
    
    if (!response.ok) {
      throw new Error(`Product Service error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
  } catch (error) {
    console.error('Error fetching products from Product Service:', error);
    throw new Error('Failed to fetch products');
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
      return null;
    }

    if (!response.ok) {
      throw new Error(`Product Service error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    throw new Error(`Failed to fetch product ${id}`);
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
      throw new Error(`Product Service error: ${response.status}`);
    }

    const data = await response.json();
    return Array.isArray(data) ? data : data.products || [];
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
