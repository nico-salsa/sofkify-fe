/**
 * Order API Service
 */

import type { Order, OrderError, OrderStatus } from '../../types/order.types';
import { API_CONFIG } from '../api/config';
import { HttpError, httpRequest } from '../http/httpClient';

interface BackendOrderItem {
  id: string;
  productId: string;
  productName: string;
  unitPrice: number;
  quantity: number;
  subtotal: number;
  createdAt: string;
}

interface BackendOrderResponse {
  id: string;
  cartId: string;
  customerId: string;
  status: string;
  items: BackendOrderItem[];
  totalAmount: number;
  createdAt: string;
}

const normalizeStatus = (status: string): OrderStatus => {
  const value = status.toLowerCase();
  if (value === 'pending' || value === 'confirmed' || value === 'shipped' || value === 'delivered' || value === 'cancelled' || value === 'failed') {
    return value;
  }
  return 'pending';
};

const mapBackendOrder = (backendOrder: BackendOrderResponse): Order => {
  return {
    id: backendOrder.id,
    cartId: backendOrder.cartId,
    customerId: backendOrder.customerId,
    status: normalizeStatus(backendOrder.status),
    items: backendOrder.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      productName: item.productName,
      quantity: item.quantity,
      price: Number(item.unitPrice),
      subtotal: Number(item.subtotal),
    })),
    total: Number(backendOrder.totalAmount),
    createdAt: backendOrder.createdAt,
    updatedAt: backendOrder.createdAt,
  };
};

const toOrderError = (error: unknown): OrderError => {
  if (error instanceof HttpError) {
    return {
      success: false,
      code: `HTTP_${error.status}`,
      message: error.message,
      details: {
        method: error.method,
        url: error.url,
      },
    };
  }

  return {
    success: false,
    code: 'NETWORK_ERROR',
    message: error instanceof Error ? error.message : 'Unknown error',
  };
};

export const orderApi = {
  async createOrderFromCart(cartId: string): Promise<Order> {
    if (!cartId || cartId.trim() === '') {
      throw new Error('cartId must be a non-empty string');
    }

    try {
      const response = await httpRequest<BackendOrderResponse>(`${API_CONFIG.ORDERS_BASE_URL}/orders/from-cart/${cartId}`, {
        method: 'POST',
      });

      return mapBackendOrder(response);
    } catch (error) {
      throw toOrderError(error);
    }
  },

  async getOrderById(orderId: string): Promise<Order> {
    if (!orderId || orderId.trim() === '') {
      throw new Error('orderId must be a non-empty string');
    }

    try {
      const response = await httpRequest<BackendOrderResponse>(`${API_CONFIG.ORDERS_BASE_URL}/orders/${orderId}`, {
        method: 'GET',
      });

      return mapBackendOrder(response);
    } catch (error) {
      throw toOrderError(error);
    }
  },

  async getOrdersByCustomer(customerId: string): Promise<Order[]> {
    if (!customerId || customerId.trim() === '') {
      throw new Error('customerId must be a non-empty string');
    }

    try {
      const response = await httpRequest<BackendOrderResponse[]>(`${API_CONFIG.ORDERS_BASE_URL}/orders/customer/${customerId}`, {
        method: 'GET',
      });

      return response.map(mapBackendOrder);
    } catch (error) {
      throw toOrderError(error);
    }
  },
};
