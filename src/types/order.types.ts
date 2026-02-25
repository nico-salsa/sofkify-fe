/**
 * Order Types - Tipos para órdenes de compra
 * Separado de cart.types.ts para mantener separación de concernos
 */

// ============================================
// Order Item - Producto en una orden
// ============================================
export interface OrderItem {
	id: string;
	productId: string;
	quantity: number;
	price: number; // precio en el momento de la orden
	subtotal: number;
}

// ============================================
// Order - Orden de compra (dominio)
// ============================================
export interface Order {
	id: string;
	userId: string;
	items: OrderItem[];
	total: number;
	status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
	createdAt: string; // ISO8601
	updatedAt: string; // ISO8601
}

// ============================================
// Order Request/Response DTOs
// ============================================
export interface CreateOrderRequest {
	userId: string;
	items: Array<{
		productId: string;
		quantity: number;
	}>;
}

export type OrderResponse = Order;

// ============================================
// Order Errors
// ============================================
export interface OrderError {
	success: false;
	code: string;
	message: string;
	details?: Record<string, unknown>;
}

// ============================================
// Order Props
// ============================================
export type OrderSuccessPageProps = {
	orderId: string;
};
