/**
 * Cart API Service
 */

import type { ConfirmCartResponse, CartConfirmationError } from '../../types/cart.types';
import { API_CONFIG } from '../api/config';
import { HttpError, httpRequest } from '../http/httpClient';

export interface BackendCartItem {
  id: string;
  productId: string;
  productName: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
  updatedAt: string;
}

export interface BackendCartResponse {
  id: string;
  customerId: string;
  status: string;
  items: BackendCartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

const buildCustomerHeaders = (customerId: string): HeadersInit => {
  return {
    'Content-Type': 'application/json',
    'X-Customer-Id': customerId,
  };
};

const toCartError = (error: unknown): CartConfirmationError => {
  if (error instanceof HttpError) {
    if (error.status === 401 || error.status === 403) {
      return {
        success: false,
        code: 'UNAUTHORIZED',
        message: 'User not authorized',
      };
    }

    if (error.status === 404) {
      return {
        success: false,
        code: 'NOT_FOUND',
        message: 'Cart not found',
      };
    }

    if (error.status === 400 || error.status === 409) {
      return {
        success: false,
        code: 'STOCK_ERROR',
        message: error.message,
      };
    }
  }

  return {
    success: false,
    code: 'UNKNOWN_ERROR',
    message: error instanceof Error ? error.message : 'Unknown error',
  };
};

export const cartApi = {
  async addItem(customerId: string, productId: string, quantity: number): Promise<BackendCartResponse> {
    if (!customerId || !productId || quantity <= 0) {
      throw new Error('customerId, productId and quantity are required');
    }

    return httpRequest<BackendCartResponse>(`${API_CONFIG.CARTS_BASE_URL}/carts/items`, {
      method: 'POST',
      headers: buildCustomerHeaders(customerId),
      body: JSON.stringify({ productId, quantity }),
    });
  },

  async getActiveCart(customerId: string): Promise<BackendCartResponse> {
    if (!customerId) {
      throw new Error('customerId is required');
    }

    return httpRequest<BackendCartResponse>(`${API_CONFIG.CARTS_BASE_URL}/carts`, {
      method: 'GET',
      headers: {
        'X-Customer-Id': customerId,
      },
    });
  },

  async confirmCart(cartId: string, customerId: string): Promise<ConfirmCartResponse> {
    if (!cartId || !customerId) {
      throw {
        success: false,
        code: 'EMPTY_CART',
        message: 'cartId and customerId are required',
      } as CartConfirmationError;
    }

    try {
      return await httpRequest<ConfirmCartResponse>(`${API_CONFIG.CARTS_BASE_URL}/carts/${cartId}/confirm`, {
        method: 'POST',
        headers: {
          'X-Customer-Id': customerId,
        },
      });
    } catch (error) {
      throw toCartError(error);
    }
  },
};
