/**
 * Order Success Page
 * Muestra detalles de la orden confirmada y permite acciones post-compra
 */

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { orderApi } from '../../services/order/orderApi';
import type { Order } from '../../types/order.types';
import { formatDate, formatCurrency } from '../../utils/formatters';
import clsx from 'clsx';

/**
 * OrderSuccessPage
 * - Cargar orden por orderId desde URL param
 * - Mostrar detalles: items, total, estado, timestamps
 * - Mostrar feedback visual (checkmark, colores tema)
 * - Botones: "Volver a tienda", "Ver mis órdenes"
 */
const OrderSuccessPage: React.FC = () => {
	const navigate = useNavigate();
	const { orderId } = useParams<{ orderId: string }>();
	const { isAuthenticated } = useAuth();

	const [order, setOrder] = useState<Order | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	// Validar autenticación
	useEffect(() => {
		if (!isAuthenticated) {
			navigate('/auth');
		}
	}, [isAuthenticated, navigate]);

	// Cargar orden por ID
	useEffect(() => {
		const fetchOrder = async () => {
			if (!orderId) {
				setError('Orden no especificada');
				setIsLoading(false);
				return;
			}

			setIsLoading(true);
			setError(null);

			try {
				const orderData = await orderApi.getOrderById(orderId);
				setOrder(orderData);
			} catch (err) {
				console.error('[OrderSuccessPage] Error fetching order:', err);
				setError(
					err instanceof Error
						? err.message
						: 'No se pudo cargar la orden. Por favor, intenta de nuevo.'
				);
			} finally {
				setIsLoading(false);
			}
		};

		fetchOrder();
	}, [orderId]);

	// Loading state
	if (isLoading) {
		return (
			<div className="w-11/12 mx-auto max-w-286 py-16 text-center">
				<p className="text-gray-600 text-lg">Cargando detalle de orden...</p>
				<div className="mt-4 flex justify-center">
					<div className="animate-spin text-3xl">⏳</div>
				</div>
			</div>
		);
	}

	// Error state
	if (error || !order) {
		return (
			<div className="w-11/12 mx-auto max-w-286 py-8">
				<div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded-lg text-center">
					<p className="text-lg font-semibold mb-4">❌ {error || 'Orden no encontrada'}</p>
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

	// Success state - show order details
	const statusColors: Record<string, string> = {
		pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
		confirmed: 'bg-green-100 text-green-800 border-green-300',
		shipped: 'bg-blue-100 text-blue-800 border-blue-300',
		delivered: 'bg-green-100 text-green-800 border-green-300',
		cancelled: 'bg-red-100 text-red-800 border-red-300',
	};

	const statusLabels: Record<string, string> = {
		pending: 'Pendiente',
		confirmed: 'Confirmada',
		shipped: 'Enviada',
		delivered: 'Entregada',
		cancelled: 'Cancelada',
	};

	return (
		<div className="w-11/12 mx-auto max-w-286 py-8">
			{/* Success header */}
			<div className="bg-green-50 border-2 border-green-500 rounded-lg p-8 mb-8 text-center">
				<p className="text-5xl mb-4">✅</p>
				<h1 className="text-3xl font-bold text-green-700 mb-2">¡Compra Confirmada!</h1>
				<p className="text-gray-600">
					Tu orden ha sido creada exitosamente. Aquí está el resumen de tu compra.
				</p>
			</div>

			{/* Order details card */}
			<div className="border rounded-lg p-6 bg-white shadow-md mb-6">
				{/* Header: ID y Status */}
				<div className="flex justify-between items-start mb-6 pb-4 border-b">
					<div>
						<p className="text-sm text-gray-500 mb-1">Número de Orden</p>
						<p className="text-xl font-bold text-gray-800 truncate">{order.id}</p>
					</div>
					<div
						className={clsx(
							'px-4 py-2 rounded-full text-sm font-semibold border',
							statusColors[order.status] || statusColors.pending
						)}
					>
						{statusLabels[order.status] || order.status}
					</div>
				</div>

				{/* Timestamps */}
				<div className="grid grid-cols-2 gap-4 mb-6 pb-4 border-b">
					<div>
						<p className="text-sm text-gray-500 mb-1">Fecha de Creación</p>
						<p className="font-semibold text-gray-800">
							{formatDate(order.createdAt)}
						</p>
					</div>
					{order.updatedAt && (
						<div>
							<p className="text-sm text-gray-500 mb-1">Última Actualización</p>
							<p className="font-semibold text-gray-800">
								{formatDate(order.updatedAt)}
							</p>
						</div>
					)}
				</div>

				{/* Items */}
				<div className="mb-6 pb-4 border-b">
					<h2 className="text-lg font-semibold mb-4 text-gray-800">Productos</h2>
					<ul className="space-y-3" role="list">
						{order.items.map((item) => (
							<li
								key={item.id}
								className="flex justify-between items-center bg-gray-50 p-3 rounded"
							>
								<div className="flex-1">
									<p className="font-semibold text-gray-800">
										{item.quantity}x Producto {item.productId}
									</p>
									<p className="text-sm text-gray-600">
										${item.price.toFixed(2)} c/u
									</p>
								</div>
								<p className="font-bold text-gray-800">
									${item.subtotal.toFixed(2)}
								</p>
							</li>
						))}
					</ul>
				</div>

				{/* Total */}
				<div className="flex justify-end bg-blue-50 p-4 rounded mb-6 border-2 border-blue-200">
					<div className="text-right">
						<p className="text-gray-600 mb-2">Total de la Orden</p>
						<p className="text-3xl font-bold text-blue-600">
							{formatCurrency(order.total)}
						</p>
					</div>
				</div>

				{/* Info box */}
				<div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-gray-700">
					<p className="mb-2">
						<strong>📧 Confirmación:</strong> Se ha enviado una confirmación a tu correo
						electrónico.
					</p>
					<p>
						<strong>🚚 Seguimiento:</strong> Podrás seguir el estado de tu orden en
						"Mis Órdenes".
					</p>
				</div>
			</div>

			{/* Actions */}
			<div className="flex flex-col gap-4">
				<button
					onClick={() => navigate('/')}
					className="w-full px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
				>
					🛍️ Continuar Comprando
				</button>

				<button
					onClick={() => navigate('/my-orders')}
					className="w-full px-6 py-3 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
				>
					📦 Ver Mis Órdenes
				</button>
			</div>

			{/* Support info */}
			<div className="mt-8 text-center text-sm text-gray-600">
				<p>
					¿Necesitas ayuda?{' '}
					<a href="#" className="text-blue-600 hover:underline">
						Contacta con Soporte
					</a>
				</p>
			</div>
		</div>
	);
};

export default OrderSuccessPage;
