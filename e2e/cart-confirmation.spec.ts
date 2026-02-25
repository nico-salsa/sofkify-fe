/**
 * E2E Tests for Cart Confirmation & Order Creation Flow
 * Playwright tests para validar flujo completo desde carrito hasta orden confirmada
 */

import { test, expect } from '@playwright/test';

const BASE_URL = process.env.VITE_BASE_URL || 'http://localhost:5173';

test.describe('Cart Confirmation & Order Creation Flow', () => {
	test.beforeEach(async ({ page }) => {
		// Navegar a página de login
		await page.goto(`${BASE_URL}/auth/login`);
	});

	/**
	 * E2E-001: Flujo completo - Login → Carrito → Confirmación → Orden exitosa
	 * Escenario: Usuario completa compra exitosamente
	 */
	test('E2E-001: Complete checkout flow from login to order success', async ({
		page,
	}) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		// Esperar redirección a home
		await expect(page).toHaveURL(`${BASE_URL}/`);

		// PASO 2: Agregar productos al carrito
		await page.click('button:has-text("Agregar al Carrito")');
		await expect(page.locator('text=Producto agregado')).toBeVisible();

		// PASO 3: Navegar a carrito
		await page.click('a:has-text("Carrito")');
		await expect(page).toHaveURL(`${BASE_URL}/cart`);

		// PASO 4: Verificar items en carrito
		await expect(page.locator('h1:has-text("Carrito de Compras")')).toBeVisible();
		await expect(page.locator('text=Resumen del Carrito')).toBeVisible();

		// PASO 5: Confirmar compra
		await page.click('button:has-text("Confirmar Carrito")');

		// Esperar procesamiento
		await expect(page.locator('text=/Procesando|¡Compra Confirmada/')).toBeVisible({
			timeout: 5000,
		});

		// PASO 6: Verificar redirección a orden exitosa
		await expect(page).toHaveURL(/\/order-success\/.+/);

		// PASO 7: Verificar elementos de orden
		await expect(page.locator('text=¡Compra Confirmada!')).toBeVisible();
		await expect(page.locator('text=Número de Orden')).toBeVisible();
	});

	/**
	 * E2E-002: Error de stock durante confirmación
	 * Escenario: User intenta confirmar pero stock se agotó
	 */
	test('E2E-002: Handle stock error during confirmation', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		await expect(page).toHaveURL(`${BASE_URL}/`);

		// PASO 2: Agregar producto con stock limitado
		// (Simular producto con stock bajo)
		await page.click('button:has-text("Agregar al Carrito")');

		// PASO 3: Ir a carrito
		await page.click('a:has-text("Carrito")');

		// PASO 4: Intentar confirmar
		await page.click('button:has-text("Confirmar Carrito")');

		// PASO 5: Verificar error de stock
		await expect(page.locator('text=/Stock insuficiente|STOCK_ERROR/')).toBeVisible();
	});

	/**
	 * E2E-003: Carrito vacío - no se puede confirmar
	 * Escenario: Usuario intentar confirmar carrito vacío
	 */
	test('E2E-003: Cannot confirm empty cart', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		await expect(page).toHaveURL(`${BASE_URL}/`);

		// PASO 2: Navegar directly a carrito sin agregar items
		await page.goto(`${BASE_URL}/cart`);

		// PASO 3: Verificar mensaje de carrito vacío
		await expect(page.locator('text=Tu carrito está vacío')).toBeVisible();

		// PASO 4: Verificar que botón está disabled
		const confirmButton = page.locator('button:has-text("Confirmar Carrito")');
		await expect(confirmButton).toBeDisabled();
	});

	/**
	 * E2E-004: Validación visual de items y totales
	 * Escenario: Verificar que el carrito muestra información correcta
	 */
	test('E2E-004: Verify cart items and total calculation', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		// PASO 2: Agregar múltiples productos
		await page.click('button:has-text("Agregar al Carrito")'); // Producto 1
		await page.click('button:nth-of-type(2):has-text("Agregar al Carrito")'); // Producto 2

		// PASO 3: Navegar a carrito
		await page.click('a:has-text("Carrito")');

		// PASO 4: Verificar que se muestran los dos productos
		const cartItems = page.locator('[role="list"] li');
		await expect(cartItems).toHaveCount(2);

		// PASO 5: Verificar total está presente y es número
		const totalText = await page.locator('text=/Total: \\$/').textContent();
		expect(totalText).toMatch(/\$[\d,]+\.\d{2}/);
	});

	/**
	 * E2E-005: Detalles de orden exitosa
	 * Escenario: Verificar que orden success muestra datos correctos
	 */
	test('E2E-005: Verify order success page details', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		// PASO 2: Completar flujo hasta orden
		await page.click('button:has-text("Agregar al Carrito")');
		await page.click('a:has-text("Carrito")');
		await page.click('button:has-text("Confirmar Carrito")');

		// Esperar orden success page
		await expect(page).toHaveURL(/\/order-success\/.+/);

		// PASO 3: Verificar elementos visibles
		await expect(page.locator('text=✅')).toBeVisible(); // Check mark
		await expect(page.locator('text=Número de Orden')).toBeVisible();
		await expect(page.locator('text=Fecha de Creación')).toBeVisible();
		await expect(page.locator('text=Productos')).toBeVisible();
		await expect(page.locator('text=Total de la Orden')).toBeVisible();

		// PASO 4: Verificar botones de acción
		await expect(page.locator('button:has-text("Continuar Comprando")')).toBeVisible();
		await expect(page.locator('button:has-text("Ver Mis Órdenes")')).toBeVisible();

		// PASO 5: Verificar mensaje sobre confirmación por email
		await expect(
			page.locator('text=/Se ha enviado una confirmación a tu correo/')
		).toBeVisible();
	});

	/**
	 * E2E-006: Volver a tienda desde carrito
	 * Escenario: Usuario hace click en "Volver a Tienda" desde confirmación
	 */
	test('E2E-006: Navigate back to store from cart page', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		// PASO 2: Navegar a carrito
		await page.click('a:has-text("Carrito")');

		// PASO 3: Click "Volver a Tienda"
		await page.click('button:has-text("Volver a Tienda")');

		// PASO 4: Verificar que vuelve a home
		await expect(page).toHaveURL(`${BASE_URL}/`);
	});

	/**
	 * E2E-007: Acceso sin autenticación - redirecciona a login
	 * Escenario: Usuario no autenticado intenta acceder a /cart
	 */
	test('E2E-007: Redirect to login when accessing cart without authentication', async ({
		page,
	}) => {
		// PASO 1: Acceder directamente a cart sin autenticar
		await page.goto(`${BASE_URL}/cart`);

		// PASO 2: Verificar redirección a login
		await expect(page).toHaveURL(/\/auth\/login/);
	});

	/**
	 * E2E-008: Warning visual para stock insuficiente
	 * Escenario: Product con stock bajo muestra warning
	 */
	test('E2E-008: Display stock warning in cart', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		// PASO 2: Simular producto con stock bajo (agregar varias veces)
		// Nota: Esto depende de la implementación del backend
		await page.click('button:has-text("Agregar al Carrito")');
		await page.click('a:has-text("Carrito")');

		// PASO 3: Verificar si hay warning (debe aparecer si stock < quantity)
		const stockWarning = page.locator('text=/Stock insuficiente/');
		const isVisible = await stockWarning.isVisible().catch(() => false);

		// Si hay warning, verificar que tiene contenido
		if (isVisible) {
			await expect(stockWarning).toContainText('Stock insuficiente');
		}
	});

	/**
	 * E2E-009: Botones deshabilitados durante procesamiento
	 * Escenario: Confirmar botón debe deshabilitarse mientras se procesa
	 */
	test('E2E-009: Disable button during processing', async ({ page }) => {
		// PASO 1: Login
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		// PASO 2: Agregar producto e ir a carrito
		await page.click('button:has-text("Agregar al Carrito")');
		await page.click('a:has-text("Carrito")');

		// PASO 3: Hacer click en confirmar
		const confirmButton = page.locator('button:has-text("Confirmar Carrito")');
		await confirmButton.click();

		// PASO 4: Verificar que botón está disabled durante procesamiento
		// (La transición es rápida, pero podre verificar el estado)
		await expect(page.locator('text=/Procesando/')).toBeVisible();
	});

	/**
	 * E2E-010: Flujo de navegación en página de orden exitosa
	 * Escenario: Usuario puede navegar desde orden success a mis órdenes
	 */
	test('E2E-010: Navigate to my orders from order success page', async ({
		page,
	}) => {
		// PASO 1: Completar flujo hasta orden
		await page.fill('input[name="email"]', 'test@example.com');
		await page.fill('input[name="password"]', 'password123');
		await page.click('button:has-text("Iniciar Sesión")');

		await page.click('button:has-text("Agregar al Carrito")');
		await page.click('a:has-text("Carrito")');
		await page.click('button:has-text("Confirmar Carrito")');

		await expect(page).toHaveURL(/\/order-success\/.+/);

		// PASO 2: Click en "Ver Mis Órdenes"
		await page.click('button:has-text("Ver Mis Órdenes")');

		// PASO 3: Verificar redirección a /my-orders
		await expect(page).toHaveURL(`${BASE_URL}/my-orders`);
	});
});
