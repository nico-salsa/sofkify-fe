import { useState, useCallback } from 'react';
import type { CartItem } from '../../types/cart.types';
import type { Product } from '../../types/product';

/**
 * Hook personalizado para manejar el carrito de compras
 * Incluye todas las operaciones CRUD del carrito
 */
export const useCart = () => {
	// Estado del carrito
	const [cart, setCart] = useState<CartItem[]>([]);

	/**
	 * Adds a product to cart or increments quantity if it already exists.
	 *
	 * @param product product selected by the user
	 * @param quantity quantity to add, defaults to 1
	 * @returns void
	 */
	const addItem = useCallback((product: Product, quantity: number = 1) => {
		setCart((prevCart) => {
			// Verificar si el producto ya existe en el carrito
			const existingItemIndex = prevCart.findIndex((item) => item.id === product.id);

			if (existingItemIndex !== -1) {
				// Si existe, actualizar la cantidad
				const updatedCart = [...prevCart];
				const newQuantity = updatedCart[existingItemIndex].quantity + quantity;
				
				// Verificar que no exceda el stock
				if (newQuantity > product.stock) {
					console.warn('No hay suficiente stock disponible');
					return prevCart;
				}

				updatedCart[existingItemIndex] = {
					...updatedCart[existingItemIndex],
					quantity: newQuantity,
					subtotal: product.price * newQuantity,
				};
				return updatedCart;
			}

			// Si no existe, crear nuevo item
			const newItem: CartItem = {
				id: product.id,
				name: product.name,
				description: product.description,
				price: product.price,
				image: product.image,
				stock: product.stock,
				quantity,
				subtotal: product.price * quantity,
			};

			return [...prevCart, newItem];
		});
	}, []);

	/**
	 * Elimina un item del carrito por su ID
	 * @param id - ID del producto a eliminar
	 */
	const removeItem = useCallback((id: string) => {
		setCart((prevCart) => prevCart.filter((item) => item.id !== id));
	}, []);

	/**
	 * Actualiza la cantidad de un item en el carrito
	 * @param id - ID del producto a actualizar
	 * @param quantity - Nueva cantidad
	 */
	const updateItemQuantity = useCallback((id: string, quantity: number) => {
		if (quantity <= 0) {
			removeItem(id);
			return;
		}

		setCart((prevCart) =>
			prevCart.map((item) => {
				if (item.id === id) {
					// Verificar que no exceda el stock
					if (quantity > item.stock) {
						console.warn('No hay suficiente stock disponible');
						return item;
					}

					return {
						...item,
						quantity,
						subtotal: item.price * quantity,
					};
				}
				return item;
			})
		);
	}, [removeItem]);

	/**
	 * Incrementa la cantidad de un item en el carrito
	 * @param id - ID del producto a incrementar
	 */
	const incrementItem = useCallback((id: string) => {
		setCart((prevCart) =>
			prevCart.map((item) => {
				if (item.id === id) {
					const newQuantity = item.quantity + 1;
					
					// Verificar que no exceda el stock
					if (newQuantity > item.stock) {
						console.warn('No hay suficiente stock disponible');
						return item;
					}

					return {
						...item,
						quantity: newQuantity,
						subtotal: item.price * newQuantity,
					};
				}
				return item;
			})
		);
	}, []);

	/**
	 * Decrementa la cantidad de un item en el carrito
	 * @param id - ID del producto a decrementar
	 */
	const decrementItem = useCallback((id: string) => {
		setCart((prevCart) =>
			prevCart.map((item) => {
				if (item.id === id) {
					const newQuantity = item.quantity - 1;
					
					// Si la cantidad llega a 0, remover el item
					if (newQuantity <= 0) {
						return item; // Se maneja en el filtro de abajo
					}

					return {
						...item,
						quantity: newQuantity,
						subtotal: item.price * newQuantity,
					};
				}
				return item;
			}).filter((item) => item.quantity > 0)
		);
	}, []);

	/**
	 * Limpia completamente el carrito
	 */
	const clearCart = useCallback(() => {
		setCart([]);
	}, []);

	/**
	 * Verifica si un producto está en el carrito
	 * @param id - ID del producto a verificar
	 * @returns true si el producto está en el carrito
	 */
	const isInCart = useCallback((id: string): boolean => {
		return cart.some((item) => item.id === id);
	}, [cart]);

	/**
	 * Obtiene la cantidad de un producto en el carrito
	 * @param id - ID del producto
	 * @returns Cantidad del producto en el carrito (0 si no está)
	 */
	const getItemQuantity = useCallback((id: string): number => {
		const item = cart.find((item) => item.id === id);
		return item ? item.quantity : 0;
	}, [cart]);

	/**
	 * Calcula el total del carrito
	 */
	const calculateTotal = useCallback((): number => {
		return cart.reduce((total, item) => total + item.subtotal, 0);
	}, [cart]);

	/**
	 * Calcula la cantidad total de items en el carrito
	 */
	const calculateTotalQuantity = useCallback((): number => {
		return cart.reduce((total, item) => total + item.quantity, 0);
	}, [cart]);

	return {
		// Estado
		cart,
		
		// Funciones de manipulación
		addItem,
		removeItem,
		updateItemQuantity,
		incrementItem,
		decrementItem,
		clearCart,
		
		// Funciones de consulta
		isInCart,
		getItemQuantity,
		
		// Cálculos
		total: calculateTotal(),
		totalQuantity: calculateTotalQuantity(),
		itemCount: cart.length,
	};
};
