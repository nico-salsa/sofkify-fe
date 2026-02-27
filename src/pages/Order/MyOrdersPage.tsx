/**
 * My Orders Page
 * Muestra el historial de órdenes del usuario autenticado
 */

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderApi } from '../../services/order/orderApi';
import type { Order } from '../../types/order.types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import clsx from 'clsx';

const MyOrdersPage: React.FC = () => {
	const navigate = useNavigate();
	const { isAuthenticated, user } = useAuth();

	const [orders, setOrders] = useState<Order[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Validar autenticación
	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/auth');
		}
	}, [isAuthenticated, navigate]);

	// Cargar órdenes del usuario
	useEffect(() => {
		const fetchOrders = async () => {
			if (!user?.id) {
				setError('Usuario no identificado');
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const ordersData = await orderApi.getOrdersByCustomer(user.id);
				// Ordenar por fecha de creación (más reciente primero)
				const sortedOrders = ordersData.sort((a, b) => 
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				setOrders(sortedOrders);
			} catch (err) {
				console.error('[MyOrdersPage] Error fetching orders:', err);
				setError(
					err instanceof Error
						? err.message
						: 'No se pudieron cargar las órdenes. Por favor, intenta de nuevo.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		if (isAuthenticated && user?.id) {
			fetchOrders();
		}
	}, [isAuthenticated, user?.id]);

	// Loading state
	if (isLoading) {
		return (
			<div className="w-11/12 mx-auto max-w-286 py-16 text-center">
				<p className="text-gray-600 text-lg">Cargando tus órdenes...</p>
				<div className="mt-4 flex justify-center">
					<div className="animate-spin text-3xl">⏳</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error) {
		return (
			<div className="w-11/12 mx-auto max-w-286 py-8">
				<div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg text-center">
					<p className="text-lg font-semibold mb-4">❌ {error}</p>
					<button
						onClick={() => navigate('/')}
						className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
					>
						Volver a Tienda
					</button>
				</div>
			</div>
		);
	}

	// Empty state
	if (orders.length === 0) {
		return (
			<div className="w-11/12 mx-auto max-w-286 py-16 text-center">
				<p className="text-5xl mb-4">📦</p>
				<h1 className="text-2xl font-bold text-gray-800 mb-4">No tienes órdenes aún</h1>
				<p className="text-gray-600 mb-8">
					Cuando realices tu primera compra, aparecerá aquí.
				</p>
				<button
					onClick={() => navigate('/')}
					className="px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
				>
					🛍️ Ir a Tienda
				</button>
			</div>
		);
	}

	// Status colors and labels
	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		confirmed: 'bg-green-100 text-green-800 border-green-300',
		shipped: 'bg-blue-100 text-blue-800 border-blue-300',
		delivered: 'bg-green-100 text-green-800 border-green-300',
		cancelled: 'bg-red-100 text-red-800 border-red-300',
		failed: 'bg-red-100 text-red-800 border-red-300',
	};

	const statusLabels: Record<string, string> = {
		pending: 'Pendiente',
		confirmed: 'Confirmada',
		shipped: 'Enviada',
		delivered: 'Entregada',
		cancelled: 'Cancelada',
		failed: 'Fallida',
	};

	return (
		<div className="w-11/12 mx-auto max-w-286 py-8">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-3xl font-bold text-gray-800 mb-2">📦 Mis Órdenes</h1>
				<p className="text-gray-600">
					Historial completo de tus compras ({orders.length} {orders.length === 1 ? 'orden' : 'órdenes'})
				</p>
			</div>

			{/* Orders list */}
			<div className="space-y-6">
				{orders.map((order) => (
					<div
						key={order.id}
						className="border rounded-lg p-6 bg-white shadow-md hover:shadow-lg transition cursor-pointer"
						onClick={() => navigate(`/order-success/${order.id}`)}
					>
						{/* Header: ID, Status, Date */}
						<div className="flex justify-between items-start mb-4 pb-4 border-b">
							<div className="flex-1">
								<p className="text-sm text-gray-500 mb-1">Orden</p>
								<p className="font-bold text-gray-800 truncate text-sm">
									{order.id}
								</p>
								<p className="text-sm text-gray-600 mt-2">
									{formatDate(order.createdAt)}
								</p>
							</div>
							<div
								className={clsx(
									'px-3 py-1 rounded-full text-xs font-semibold border',
									statusColors[order.status] || statusColors.pending
								)}
							>
								{statusLabels[order.status] || order.status}
							</div>
						</div>

						{/* Items summary */}
						<div className="mb-4">
							<p className="text-sm text-gray-600 mb-2">
								{order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
							</p>
							<ul className="space-y-1">
								{order.items.slice(0, 3).map((item) => (
									<li key={item.id} className="text-sm text-gray-700">
										• {item.quantity}x Producto {item.productId}
									</li>
								))}
								{order.items.length > 3 && (
									<li className="text-sm text-gray-500 italic">
										... y {order.items.length - 3} más
									</li>
								)}
							</ul>
						</div>

						{/* Total */}
						<div className="flex justify-between items-center bg-blue-50 p-3 rounded">
							<span className="text-gray-700 font-semibold">Total</span>
							<span className="text-xl font-bold text-blue-600">
								{formatCurrency(order.total)}
							</span>
						</div>

						{/* Click hint */}
						<div className="mt-4 text-center text-sm text-gray-500">
							Haz clic para ver detalles completos →
						</div>
					</div>
				))}
			</div>

			{/* Back button */}
			<div className="mt-8">
				<button
					onClick={() => navigate('/')}
					className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
				>
					← Volver a Tienda
				</button>
			</div>
		</div>
	);
};

export default MyOrdersPage;
