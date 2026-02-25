/**
 * Order types aligned with backend contracts.
 */

export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export type OrderStatus = 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled' | 'failed';

export interface Order {
  id: string;
  cartId: string;
  customerId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt?: string;
}

export interface OrderError {
  success: false;
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export type OrderSuccessPageProps = {
  orderId: string;
};
