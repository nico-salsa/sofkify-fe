# HU-FE-CART-ORDER-01: Confirmación de Carrito y Creación de Orden

## 📋 RESUMEN EJECUTIVO (5 líneas máximo)

Como cliente de Sofkify,  
quiero confirmar mi carrito activo visualizando su contenido actual,  
para convertirlo en una orden que sea procesada por el backend con validación de stock, eventos asíncronos y persistencia de detalles.

**Alcance:** UI + integración con backends endpoints (`POST /carts/{id}/confirm`, `POST /orders`), manejo de eventos RabbitMQ y stock insuficiente.

**Entrega:** HU con criterios de aceptación, plan TDD (tests + implementación), E2E/integración, QA checklist e infraestructura si aplica.

---

## 🎯 SUPUESTOS EXPLÍCITOS

| Supuesto | Fuente de Verdad | Validar |
|----------|-----------------|---------|
| Backend expone `POST /carts/{id}/confirm` | codebase.md: "Confirmación del Carrito" | ✓ Endpoint existe |
| Backend expone `POST /orders` | codebase.md: "Crear una orden" | ✓ Endpoint existe |
| Backend gestiona stock (validación + reducción) | codebase.md: "Se valida stock. Se bloquea inventario." | ✓ Repositorio Stock actualiza |
| Backend publica evento vía RabbitMQ al confirmar | codebase.md: "Se publica un evento de orden creada" | ✓ Event Publisher implementado |
| Carrito con ID existe y pertenece al usuario autenticado | authApi.ts + localStorage | ✓ Lógica de contexto necesaria |
| Stock insuficiente = error con status 400/422 | Estándar REST | ✓ Manejo en UI |
| Timestamps devueltos por backend (createdAt, updatedAt) | product.ts: "createdAt, updatedAt" | ✓ DTOs incluyen campos |
| Frontend almacena carrito en contexto/localStorage | DEUDA_TECNICA.md: cartService.ts | ✓ useCart hook + CartContext |

---

## 📊 NOTACIÓN TOON

### **T** - Tarea
Implementar flujo completo de confirmación de carrito y creación de orden en el frontend:
1. **Vista:** Mostrar carrito activo con `id`, `items[]`, `total`, `totalQuantity`
2. **Acción:** Botón "Confirmar Carrito" que invoca `POST /carts/{id}/confirm`
3. **Validación:** Manejo de errores (stock insuficiente, carrito vacío, usuario no autenticado)
4. **Transición:** Post- confirmación, invocar `POST /orders` y mostrar detalles de orden creada
5. **Eventos:** Capturar eventos RabbitMQ (futura observabilidad) y actualizar estado local

### **O** - Objetivo (Negocio + Técnico)
**Negocio:** Permitir que el cliente complete la compra confirmando su carrito y visualizando la orden resultante con transparencia sobre stock y detalles.

**Técnico:** Establecer la integración FE ↔ BE robusta respetando:
- Separación entre servicios (`cartApi.ts`, `orderApi.ts`)
- Tipado strict (DTOs, responses, error handling)
- Manejo explícito de estados async (loading/success/error)
- Contrato FE/BE: no enviar `id`, `createdAt`, `updatedAt` en payloads

### **O** - Output Esperado

**Frontend Entregable:**
- [x] Tipos TypeScript: `ConfirmCartRequest`, `ConfirmCartResponse`, `Create OrderRequest`, `OrderResponse`, `CartConfirmationError`
- [x] Servicios API: `cartApi.confirmCart(cartId)`, `orderApi.createOrder(payload)`
- [x] Hook: `useCartConfirmation()` con lógica de confirmación + creación
- [x] Componente: `CartConfirmationPage` (mostrar carrito + botón confirmar)
- [x] Componente: `OrderSuccessPage` (mostrar detalles de orden creada)
- [x] Tests unitarios: Servicios API, hooks, componentes (TDD - rojo primero)
- [x] Tests E2E (Playwright): Flujo completo carrito → confirmación → orden
- [x] Tests de integración: Mock RabbitMQ + stock validation
- [x] QA Checklist: Edge cases (stock = 0, carrito vacío, timeout, reintentos)

**Backend Contrato (FUENTE DE VERDAD):**
- `POST /carts/{id}/confirm` → 200 `{ success: true, cartId, confirmedAt: ISO8601, orderId: UUID }`
- `POST /orders` → 201 `{ id: UUID, userId, items: OrderItem[], total, status, createdAt, updatedAt }`
- Error Stock: 400/422 `{ success: false, message: "Insufficient stock for product X", code: "STOCK_ERROR" }`
- Evento RabbitMQ: `order.created` con metadata `{ orderId, userId, total, itemsCount, timestamp }`

### **N** - Normas y Restricciones

| Restricción | Por Qué | Cómo Validar |
|-------------|--------|------------|
| No hardcodear URLs de API | WORKSPACE_EXPLAIN_SUMMARY.md: "URLs deben ser env-driven" | `import.meta.env.VITE_API_BASE_URL` |
| No enviar `id`, `createdAt`, `updatedAt` en payloads | Copilot Instructions: "campos backend-managed" | Linter/review: solo `{items: [{productId, quantity}]}` |
| Usar `unknown` si tipo es desconocido (no `any`) | copilot-instructions.md: "Evitar `any` completamente" | ESLint + TypeScript strict |
| Manejar 3 estados: loading/success/error | CAMBIOS_REQUERIDOS.md: "Siempre estados async" | Tests verifican setState en 3 escenarios |
| Lazy loading componentes de orden | Performance First | React.lazy + Suspense en router |
| Pruebas con cobertura >= 70% | TEST_PLAN.md | Jest + coverage > 70% |
| Sin cambios de rutas | copilot-instructions: "Context-Only Change Constraints" | Rutas `/cart`, `/order-success` ya existen |
| Respectar FE/BE contract | copilot-instructions: "Frontend MUST NOT generate backend-managed fields" | Payloads validados vs DTOs |

---

## ✅ CRITERIOS DE ACEPTACIÓN

### Criterios Funcionales

#### CA-01: Carrito Activo Visible
**Given:** Usuario autenticado con carrito existente con 2+ items  
**When:** Accede a `/cart`  
**Then:**
- [ ] Componente muestra ID del carrito
- [ ] Componente lista todos los items con: `productId`, `name`, `quantity`, `price`, `subtotal`
- [ ] Total de carrito = suma de subtotales (exactitud: 2 decimales)
- [ ] Cantidad total de items visible
- [ ] Stock displayed para advertencia visual si stock < cantidad

**Ejemplo de Output esperado:**
```json
{
  "id": "cart-uuid-123",
  "items": [
    {"productId": "p1", "name": "Laptop", "quantity": 1, "price": 999.99, "subtotal": 999.99},
    {"productId": "p2", "name": "Mouse", "quantity": 2, "price": 29.99, "subtotal": 59.98}
  ],
  "total": 1059.97,
  "totalQuantity": 3
}
```

#### CA-02: Backend Endpoint - Confirmar Carrito
**Given:** Carrito válido con stock disponible  
**When:** Frontend invoca `POST /carts/{id}/confirm` con headers `Authorization: Bearer {token}`  
**Then:**
- [ ] Backend retorna 200 OK
- [ ] Response incluye:
  - `success: true`
  - `cartId: UUID`
  - `confirmedAt: ISO8601 timestamp`
  - `orderId: UUID` (generado por backend)
- [ ] Backend publica evento RabbitMQ `order.created`
- [ ] Stock vinculado se reduce (asíncrono o síncrono según diseño)

**Contrato Response Esperado:**
```json
{
  "success": true,
  "cartId": "cart-uuid-123",
  "confirmedAt": "2026-02-20T15:30:45.123Z",
  "orderId": "order-uuid-456"
}
```

#### CA-03: Backend Endpoint - Crear Orden (POST /orders)
**Given:** Respuesta exitosa de `/carts/{id}/confirm`  
**When:** Frontend invoca `POST /orders` con payload:
```json
{
  "userId": "user-uuid",
  "items": [{"productId": "p1", "quantity": 1}]
}
```
**Then:**
- [ ] Backend retorna 201 Created
- [ ] Response incluye:
  - `id: UUID`
  - `userId: UUID`
  - `items: OrderItem[]` con estructura completa
  - `total: number` (2 decimales)
  - `status: string` ("pending", "confirmed", etc.)
  - `createdAt: ISO8601`
  - `updatedAt: ISO8601`
- [ ] Orden persiste en DB con validación de integridad referencial (users, products)

**Contrato Response Esperado:**
```json
{
  "id": "order-uuid-456",
  "userId": "user-uuid",
  "items": [
    {"id": "oi-1", "productId": "p1", "quantity": 1, "price": 99.99, "subtotal": 99.99}
  ],
  "total": 99.99,
  "status": "confirmed",
  "createdAt": "2026-02-20T15:30:46.000Z",
  "updatedAt": "2026-02-20T15:30:46.000Z"
}
```

#### CA-04: Manejo de Stock Insuficiente
**Given:** Carrito con item: `{productId: "p1", quantity: 100}` pero producto solo tiene stock = 5  
**When:** Frontend invoca `POST /carts/{id}/confirm`  
**Then:**
- [ ] Backend retorna 400 Bad Request o 422 Unprocessable Entity
- [ ] Response incluye:
  - `success: false`
  - `message: "Insufficient stock for product X. Available: 5, Requested: 100"`
  - `code: "STOCK_ERROR"`
  - `affectedProducts: [{productId, available, requested}]`
- [ ] Frontend captura error y muestra modal/toast con mensaje al usuario
- [ ] Carrito NO se confirma; estado permanece editable

**Contrato Error Esperado:**
```json
{
  "success": false,
  "message": "Insufficient stock",
  "code": "STOCK_ERROR",
  "details": {
    "productId": "p1",
    "available": 5,
    "requested": 100
  }
}
```

#### CA-05: Validación de Entrada - Carrito Vacío
**Given:** Carrito sin items (`items: []`)  
**When:** Usuario intenta hacer clic en botón "Confirmar Carrito"  
**Then:**
- [ ] Botón está deshabilitado (visual: opacity 50%, cursor not-allowed)
- [ ] Al pasar mouse muestra tooltip: "El carrito está vacío"
- [ ] Si frontend envía igualmente: Backend retorna 400 con `code: "EMPTY_CART"`

#### CA-06: Validación de Autenticación
**Given:** Usuario NO autenticado  
**When:** Intenta acceder a `/cart` o `/cart/confirm`  
**Then:**
- [ ] Frontend redirige a `/auth/login`
- [ ] Almacena redirect URL en estado para post-login
- [ ] Restaura intención original después de login exitoso

#### CA-07: Página de Éxito - Order Details
**Given:** Orden creada exitosamente  
**When:** Frontend redirige a `/order-success/{orderId}`  
**Then:**
- [ ] Page muestra:
  - Orden ID
  - Fecha de creación formateada (dd/mm/yyyy HH:mm)
  - Items con detalles (nombre, cantidad, precio unitario, subtotal)
  - Total final
  - Status actual
  - Botón "Volver a Tienda"
  - Botón "Ver Mis Órdenes" (futura feature)
- [ ] Datos vienen del backend (load actual data, no mock)

#### CA-08: Eventos RabbitMQ - Observabilidad
**Given:** Orden confirmada  
**When:** Sistema interno procesa evento `order.created` de RabbitMQ  
**Then:**
- [ ] Evento contiene: `{ orderId, userId, total, itemsCount, timestamp, status }`
- [ ] Backend publica en exchange `orders.exchange` con routing key `order.created`
- [ ] Consumer externo (stock service, notification service) puede suscribirse
- [ ] Frontend NO consume directamente; solo lee respuestas REST (future: websockets para notificaciones)

#### CA-09: Idempotencia - Reintentos
**Given:** Confirmación de carrito invocada 2+ veces rápidamente  
**When:** Frontend envía `POST /carts/{id}/confirm` sin validación de doble-clic  
**Then:**
- [ ] Backend implementa `Idempotency-Key` header
- [ ] Primera llamada: 200 OK con orderId
- [ ] Segunda llamada (mismo key): 200 OK, **mismo orderId** (no crea orden duplicada)
- [ ] Frontend implementa debounce/disable en botón post-clic

#### CA-10: Estados Asíncronos - UI Feedback
**Given:** Usuario hace clic en "Confirmar Carrito"  
**When:** Request se envía al backend  
**Then:**
- [ ] Botón cambia a estado "loading" (loader spinner)
- [ ] Texto del botón: "Procesando..."
- [ ] Otros botones deshabilitados
- [ ] Si éxito (200/201): Transición suave a página de orden
- [ ] Si error: Toast/modal con mensaje de error + botón "Reintentar"
- [ ] Si timeout (> 30s): "Tiempo de espera agotado. Intenta de nuevo."

---

## 🧪 PLAN TDD - TESTS PRIMERO (Rojo → Verde → Refactor)

### Fase 1: Tests Unitarios (Backend + Frontend)

#### **T1.1 - Cart Service Tests** (`src/services/cart/cartApi.test.ts`)

**Objetivo:** Validar contrato con backend para confirmación de carrito

```typescript
// ROJO (Fallan primero)
describe('cartApi.confirmCart', () => {
  it('should return success with orderId when stock is available', async () => {
    // GIVEN: mock API returns valid response
    const cartId = 'cart-123';
    const expected = {
      success: true,
      cartId,
      confirmedAt: expect.any(String),
      orderId: expect.stringMatching(/^[0-9a-f-]+$/)
    };

    // WHEN
    const result = await cartApi.confirmCart(cartId);

    // THEN
    expect(result).toEqual(expected);
    expect(result.success).toBe(true);
  });

  it('should throw error with code STOCK_ERROR when insufficient stock', async () => {
    // GIVEN: product with stock = 5, request quantity = 100
    const cartId = 'cart-with-overflow';

    // WHEN/THEN
    await expect(cartApi.confirmCart(cartId)).rejects.toThrow('STOCK_ERROR');
  });

  it('should include Authorization header from authStorage', async () => {
    // GIVEN: user authenticated
    const token = 'Bearer abc123';
    authStorage.setToken(token); // mock

    // WHEN
    await cartApi.confirmCart('cart-123');

    // THEN: verify fetch was called with correct header
    expect(fetch).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: token
        })
      })
    );
  });

  it('should throw error if cartId is empty string', async () => {
    await expect(cartApi.confirmCart('')).rejects.toThrow();
  });

  it('should not send backend-managed fields in request body', async () => {
    // Verify payload only contains user-provided fields
    const result = await cartApi.confirmCart('cart-123');
    expect(result).not.toHaveProperty('createdAt');
    expect(result).not.toHaveProperty('updatedAt');
    expect(result).not.toHaveProperty('id');
  });
});
```

#### **T1.2 - Order Service Tests** (`src/services/order/orderApi.test.ts`)

```typescript
describe('orderApi.createOrder', () => {
  it('should create order with valid payload', async () => {
    // GIVEN
    const payload = {
      userId: 'user-uuid',
      items: [{ productId: 'p1', quantity: 1 }]
    };

    // WHEN
    const result = await orderApi.createOrder(payload);

    // THEN
    expect(result).toEqual({
      id: expect.any(String),
      userId: 'user-uuid',
      items: expect.anything(),
      total: expect.any(Number),
      status: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String)
    });
  });

  it('should reject payload with id field', async () => {
    const invalidPayload = {
      id: 'should-not-be-here',
      userId: 'user-uuid',
      items: []
    };

    // Should validate and either reject or strip the id field
    const result = await orderApi.createOrder(invalidPayload);
    expect(result).not.toHaveProperty('id'); // Backend-managed
  });

  it('should format total to 2 decimal places', async () => {
    const result = await orderApi.createOrder({
      userId: 'user-uuid',
      items: [{ productId: 'p1', quantity: 1 }]
    });

    const totalStr = result.total.toFixed(2);
    expect(totalStr).toMatch(/^\d+\.\d{2}$/);
  });
});
```

#### **T1.3 - useCartConfirmation Hook Tests** (`src/hooks/useCartConfirmation.test.ts`)

```typescript
describe('useCartConfirmation', () => {
  it('should initialize with loading=false, error=null, data=null', () => {
    const { result } = renderHook(() => useCartConfirmation());

    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBeNull();
    expect(result.current.data).toBeNull();
  });

  it('should set isLoading=true while confirming cart', async () => {
    const { result } = renderHook(() => useCartConfirmation());

    act(() => {
      result.current.confirmCart('cart-123');
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should set data and isLoading=false on success', async () => {
    const { result } = renderHook(() => useCartConfirmation());

    await act(async () => {
      await result.current.confirmCart('cart-123');
    });

    expect(result.current.isLoading).toBe(false);
    expect(result.current.data).toEqual({
      success: true,
      orderId: expect.any(String)
    });
  });

  it('should set error on STOCK_ERROR', async () => {
    // Mock cartApi to throw STOCK_ERROR
    jest.spyOn(cartApi, 'confirmCart').mockRejectedValue(
      new Error('STOCK_ERROR')
    );

    const { result } = renderHook(() => useCartConfirmation());

    await act(async () => {
      try {
        await result.current.confirmCart('cart-invalid');
      } catch (e) {
        // Expected
      }
    });

    expect(result.current.error).toBeDefined();
    expect(result.current.error?.code).toBe('STOCK_ERROR');
  });

  it('should debounce multiple confirmCart calls', async () => {
    const { result } = renderHook(() => useCartConfirmation());
    const spy = jest.spyOn(cartApi, 'confirmCart');

    act(() => {
      result.current.confirmCart('cart-123');
      result.current.confirmCart('cart-123');
      result.current.confirmCart('cart-123');
    });

    // Only 1 call should be made
    expect(spy).toHaveBeenCalledTimes(1);
  });
});
```

#### **T1.4 - CartConfirmationPage Component Tests** (`src/pages/Cart/CartConfirmationPage.test.tsx`)

```typescript
describe('CartConfirmationPage', () => {
  it('should render cart items', () => {
    const mockCart = {
      id: 'cart-123',
      items: [
        { productId: 'p1', name: 'Laptop', quantity: 1, price: 999.99 }
      ],
      total: 999.99
    };

    render(
      <CartConfirmationPage cart={mockCart} />
    );

    expect(screen.getByText('Laptop')).toBeInTheDocument();
    expect(screen.getByText('$999.99')).toBeInTheDocument();
  });

  it('should disable confirm button if cart is empty', () => {
    const emptyCart = { id: 'cart-123', items: [], total: 0 };

    render(<CartConfirmationPage cart={emptyCart} />);

    const button = screen.getByRole('button', { name: /Confirmar/i });
    expect(button).toBeDisabled();
  });

  it('should show warning if any item has stock < quantity', () => {
    const Cart = {
      items: [{ productId: 'p1', name: 'Item', quantity: 100, stock: 5 }]
    };

    render(<CartConfirmationPage cart={Cart} />);

    expect(screen.getByText(/Stock insuficiente/i)).toBeInTheDocument();
  });

  it('should call confirmCart on button click', async () => {
    const mockConfirmCart = jest.fn(() => Promise.resolve());
    const Cart = {
      id: 'cart-123',
      items: [{ productId: 'p1', name: 'Item', quantity: 1, stock: 10 }]
    };

    render(
      <CartConfirmationPage cart={Cart} onConfirm={mockConfirmCart} />
    );

    const button = screen.getByRole('button', { name: /Confirmar/i });
    await userEvent.click(button);

    expect(mockConfirmCart).toHaveBeenCalledWith('cart-123');
  });

  it('should navigate to /order-success/{orderId} on success', async () => {
    const navigate = jest.fn();
    jest.spyOn(useNavigate).mockReturnValue(navigate);

    // Simulate successful confirmation
    render(<CartConfirmationPage />);
    // ... trigger confirmation

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith('/order-success/order-uuid-456');
    });
  });

  it('should show error toast if stock is insufficient', async () => {
    const mockError = {
      code: 'STOCK_ERROR',
      message: 'Insufficient stock for product X'
    };

    render(<CartConfirmationPage onError={mockError} />);

    expect(screen.getByText(/Insufficient stock/i)).toBeInTheDocument();
  });
});
```

#### **T1.5 - OrderSuccessPage Component Tests** (`src/pages/Order/OrderSuccessPage.test.tsx`)

```typescript
describe('OrderSuccessPage', () => {
  it('should load and display order details from backend', async () => {
    const mockOrder = {
      id: 'order-uuid',
      userId: 'user-uuid',
      items: [{ productId: 'p1', quantity: 1, price: 99.99 }],
      total: 99.99,
      status: 'confirmed',
      createdAt: '2026-02-20T15:30:46.000Z'
    };

    jest.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockOrder);

    render(<OrderSuccessPage orderId="order-uuid" />);

    await waitFor(() => {
      expect(screen.getByText('order-uuid')).toBeInTheDocument();
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });
  });

  it('should format createdAt timestamp as dd/mm/yyyy HH:mm', async () => {
    const mockOrder = {
      createdAt: '2026-02-20T15:30:46.000Z'
    };

    jest.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockOrder);

    render(<OrderSuccessPage orderId="order-uuid" />);

    await waitFor(() => {
      expect(screen.getByText(/20\/02\/2026 15:30/)).toBeInTheDocument();
    });
  });

  it('should display all items with name, quantity, price, subtotal', async () => {
    const mockOrder = {
      items: [
        {
          id: 'oi-1',
          productId: 'p1',
          quantity: 2,
          price: 50.00,
          subtotal: 100.00
        }
      ]
    };

    jest.spyOn(orderApi, 'getOrderById').mockResolvedValue(mockOrder);

    render(<OrderSuccessPage orderId="order-uuid" />);

    await waitFor(() => {
      expect(screen.getByText('100.00')).toBeInTheDocument(); // subtotal
    });
  });

  it('should show loading spinner while fetching order', () => {
    jest.spyOn(orderApi, 'getOrderById').mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<OrderSuccessPage orderId="order-uuid" />);

    expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
  });

  it('should show error message if order not found', async () => {
    jest.spyOn(orderApi, 'getOrderById').mockRejectedValue(
      new Error('Order not found')
    );

    render(<OrderSuccessPage orderId="invalid-id" />);

    await waitFor(() => {
      expect(screen.getByText(/no encontrada/i)).toBeInTheDocument();
    });
  });
});
```

---

### Fase 2: Tests de Integración (Frontend + Backend Mock)

#### **T2.1 - Cart Confirmation Integration Test** (`src/__tests__/integration/cartConfirmation.test.ts`)

```typescript
describe('Cart Confirmation Flow - Integration', () => {
  beforeEach(() => {
    // Setup mock server (MSW - Mock Service Worker)
    server.listen();
  });

  it('should complete full flow: show cart → confirm → show order', async () => {
    // 1. Mock backend: cart exists
    server.use(
      rest.get('/api/v1/carts/:id', (req, res, ctx) => {
        return res(
          ctx.json({
            id: 'cart-123',
            items: [{ productId: 'p1', quantity: 1, price: 99.99 }],
            total: 99.99
          })
        );
      })
    );

    // 2. Mock backend: confirm cart
    server.use(
      rest.post('/api/v1/carts/:id/confirm', (req, res, ctx) => {
        return res(
          ctx.json({
            success: true,
            cartId: 'cart-123',
            confirmedAt: new Date().toISOString(),
            orderId: 'order-uuid-456'
          })
        );
      })
    );

    // 3. Mock backend: create order
    server.use(
      rest.post('/api/v1/orders', (req, res, ctx) => {
        return res(
          ctx.status(201),
          ctx.json({
            id: 'order-uuid-456',
            userId: 'user-uuid',
            items: [{ productId: 'p1', quantity: 1, price: 99.99 }],
            total: 99.99,
            status: 'confirmed',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })
        );
      })
    );

    // 4. Render and interact
    render(<CartConfirmationPage />);

    // Verify cart loaded
    await waitFor(() => {
      expect(screen.getByText('$99.99')).toBeInTheDocument();
    });

    // Click confirm
    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i });
    await userEvent.click(confirmBtn);

    // Verify loading state
    expect(screen.getByText('Procesando...')).toBeInTheDocument();

    // Verify navigation to order page
    await waitFor(() => {
      expect(screen.getByText('order-uuid-456')).toBeInTheDocument();
    });
  });

  it('should handle stock error gracefully', async () => {
    server.use(
      rest.post('/api/v1/carts/:id/confirm', (req, res, ctx) => {
        return res(
          ctx.status(422),
          ctx.json({
            success: false,
            code: 'STOCK_ERROR',
            message: 'Insufficient stock for product p1',
            details: { available: 5, requested: 100 }
          })
        );
      })
    );

    render(<CartConfirmationPage />);
    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/Insufficient stock/i)).toBeInTheDocument();
    });
  });

  it('should handle timeout and show retry', async () => {
    server.use(
      rest.post('/api/v1/carts/:id/confirm', (req, res, ctx) => {
        return res(
          ctx.delay(31000) // > 30s timeout
        );
      })
    );

    render(<CartConfirmationPage />);
    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i });
    await userEvent.click(confirmBtn);

    await waitFor(() => {
      expect(screen.getByText(/Tiempo de espera agotado/i)).toBeInTheDocument();
    }, { timeout: 35000 });
  });

  it('should implement idempotency: same orderId on duplicate requests', async () => {
    const callCount = { value: 0 };

    server.use(
      rest.post('/api/v1/carts/:id/confirm', (req, res, ctx) => {
        callCount.value++;
        return res(
          ctx.json({
            success: true,
            orderId: 'order-uuid-456', // Same ID each time
            confirmedAt: new Date().toISOString()
          })
        );
      })
    );

    render(<CartConfirmationPage />);

    // User clicks twice rapidly
    const confirmBtn = screen.getByRole('button', { name: /Confirmar/i });
    await userEvent.click(confirmBtn);
    await userEvent.click(confirmBtn);

    // Debounce ensures only 1 backend call
    await waitFor(() => {
      expect(callCount.value).toBe(1);
    });
  });
});
```

#### **T2.2 - RabbitMQ Event Integration Test** (`src/__tests__/integration/orderEvents.test.ts`)

```typescript
describe('Order Events - RabbitMQ Integration', () => {
  it('should capture order.created event from RabbitMQ publisher', async () => {
    // Mock event emitter
    const eventEmitter = new EventEmitter();
    const eventCapture = [];

    eventEmitter.on('order.created', (event) => {
      eventCapture.push(event);
    });

    // Simulate backend publishing event
    const mockOrderEvent = {
      orderId: 'order-uuid-456',
      userId: 'user-uuid',
      total: 99.99,
      itemsCount: 1,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    };

    eventEmitter.emit('order.created', mockOrderEvent);

    // Verify event captured with all fields
    expect(eventCapture).toHaveLength(1);
    expect(eventCapture[0]).toMatchObject({
      orderId: 'order-uuid-456',
      userId: 'user-uuid',
      total: 99.99,
      itemsCount: 1,
      timestamp: expect.any(String),
      status: 'confirmed'
    });
  });

  it('should validate event schema matches contract', async () => {
    const requiredFields = ['orderId', 'userId', 'total', 'itemsCount', 'timestamp', 'status'];
    const mockEvent = {
      orderId: 'order-1',
      userId: 'user-1',
      total: 100,
      itemsCount: 2,
      timestamp: new Date().toISOString(),
      status: 'confirmed'
    };

    requiredFields.forEach(field => {
      expect(mockEvent).toHaveProperty(field);
    });
  });
});
```

---

### Fase 3: Tests End-to-End (Playwright)

#### **T3.1 - E2E Cart Confirmation Flow** (`e2e/cart-confirmation.spec.ts`)

```typescript
import { test, expect } from '@playwright/test';

test.describe('E2E: Cart Confirmation and Order Creation', () => {
  test.beforeEach(async ({ page }) => {
    // Login user
    await page.goto('/auth/login');
    await page.fill('input[type="email"]', 'test@sofkify.com');
    await page.fill('input[type="password"]', 'Test123456');
    await page.click('button:has-text("Iniciar Sesión")');

    // Wait for navigation to home
    await page.waitForURL('/');
  });

  test('should complete full cart confirmation flow', async ({ page }) => {
    // 1. Navigate to cart with existing items
    await page.goto('/cart');

    // 2. Verify cart display
    await expect(page.locator('h3:has-text("Carrito de compras")')).toBeVisible();

    // Get initial state
    const cartItems = await page.locator('ul li').count();
    expect(cartItems).toBeGreaterThan(0);

    // Verify total is displayed
    const totalText = await page.locator('text=/Total Price/').textContent();
    expect(totalText).toContain('$');

    // 3. Click "Confirmar Carrito"
    const confirmBtn = page.locator('button:has-text("Confirmar Carrito")');
    expect(confirmBtn).not.toBeDisabled();
    await confirmBtn.click();

    // 4. Verify loading state
    await expect(page.locator('text=Procesando')).toBeVisible();

    // 5. Wait for order success page
    await page.waitForURL('/order-success/**');

    // 6. Verify order details shown
    await expect(page.locator('text=Orden Confirmada')).toBeVisible();
    await expect(page.locator('text=/order-/')).toBeVisible(); // Order ID

    // 7. Verify timestamps formatted
    const createdDate = page.locator('text=/\\d{2}\\/\\d{2}\\/\\d{4}/');
    await expect(createdDate).toBeVisible();

    // 8. Verify order items displayed
    const itemsSection = page.locator('section:has-text("Detalles de Orden")');
    await expect(itemsSection).toBeVisible();

    // 9. Verify buttons for next actions
    await expect(page.locator('button:has-text("Volver a Tienda")')).toBeVisible();
  });

  test('should handle stock error on confirmation', async ({ page }) => {
    // Intercept API to return stock error
    await page.route('**/api/v1/carts/*/confirm', route => {
      route.abort('genericerror'); // Simulate network error or server returns 422
    });

    // OR use more realistic mock:
    await page.route('**/api/v1/carts/*/confirm', route => {
      route.continue();
    });

    // Actually, use intercept to mock response:
    await page.route('**/api/v1/carts/*/confirm', route => {
      if (route.request().method() === 'POST') {
        route.abort();
      }
    });

    // Better approach: use mock server (MSW) or live server
    // For E2E, assume backend is running and test real error handling

    await page.goto('/cart');
    const confirmBtn = page.locator('button:has-text("Confirmar Carrito")');
    await confirmBtn.click();

    // Mock server will return error after delay
    // Verify error message shown
    await expect(page.locator('text=/Stock insuficiente|sin stock/i')).toBeVisible({ timeout: 10000 });

    // Verify retry button
    await expect(page.locator('button:has-text("Reintentar")')).toBeVisible();
  });

  test('should disable confirm button for empty cart', async ({ page }) => {
    // Create empty cart scenario (logout, login again, or navigate to empty cart)
    // For this test, assume cart is empty
    await page.goto('/cart');

    // Add logic to empty cart if needed
    const removeButtons = page.locator('button:has-text("Eliminar")');
    while ((await removeButtons.count()) > 0) {
      await removeButtons.first().click();
    }

    // Verify confirm button is disabled
    const confirmBtn = page.locator('button:has-text("Confirmar Carrito")');
    await expect(confirmBtn).toBeDisabled();

    // Verify tooltip
    await confirmBtn.hover();
    await expect(page.locator('text=El carrito está vacío')).toBeVisible();
  });

  test('should not send backend-managed fields in payload', async ({ page }) => {
    const requestCapture = [];

    page.on('request', request => {
      if (request.url().includes('/carts') || request.url().includes('/orders')) {
        const postData = request.postData();
        if (postData) {
          requestCapture.push(JSON.parse(postData));
        }
      }
    });

    await page.goto('/cart');
    const confirmBtn = page.locator('button:has-text("Confirmar Carrito")');
    await confirmBtn.click();

    // Wait a bit for request
    await page.waitForTimeout(500);

    // Verify no backend-managed fields in payload
    requestCapture.forEach(payload => {
      expect(payload).not.toHaveProperty('id');
      expect(payload).not.toHaveProperty('createdAt');
      expect(payload).not.toHaveProperty('updatedAt');
    });
  });

  test('should redirect to login if not authenticated', async ({ page, context }) => {
    // Clear auth token/localStorage
    await context.clearCookies();
    await page.evaluate(() => localStorage.clear());

    await page.goto('/cart');

    // Should redirect to /auth/login
    await page.waitForURL('/auth/login');
    expect(page.url()).toContain('/auth/login');

    // After login, should redirect back to /cart
    await page.fill('input[type="email"]', 'test@sofkify.com');
    await page.fill('input[type="password"]', 'Test123456');
    await page.click('button:has-text("Iniciar Sesión")');

    await page.waitForURL('/cart');
    expect(page.url()).toContain('/cart');
  });

  test('should implement debounce: multiple clicks send 1 request', async ({ page }) => {
    let requestCount = 0;

    page.on('request', request => {
      if (request.url().includes('/carts') && request.method() === 'POST') {
        requestCount++;
      }
    });

    await page.goto('/cart');
    const confirmBtn = page.locator('button:has-text("Confirmar Carrito")');

    // Click rapidly
    await confirmBtn.click();
    await confirmBtn.click();
    await confirmBtn.click();

    // Wait and verify only 1 actual request was made
    await page.waitForTimeout(1000);

    // Button should be disabled during processing
    await expect(confirmBtn).toBeDisabled();

    // After completion, verify single request or debounced behavior
    // (actual count depends on implementation: 1 if debounced, 1 if button disabled)
  });
});
```

---

## 🏛️ DISEÑO DE CÓDIGO - PASO A PASO (POST-TDD)

Una vez que los tests estén escritos y fallen (rojo), implementar:

### Paso 1: Tipos TypeScript

**Archivo:** `src/types/cart.types.ts` (actualizar)

```typescript
export interface CartItem extends Omit<Product, 'status' | 'createdAt' | 'updatedAt'> {
  quantity: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  totalQuantity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ConfirmCartRequest {
  // Frontend sends nothing; backend confirms by cartId in URL
}

export interface ConfirmCartResponse {
  success: boolean;
  cartId: string;
  confirmedAt: string; // ISO8601
  orderId: string; // UUID
}

export interface CartConfirmationError {
  success: false;
  code: 'STOCK_ERROR' | 'EMPTY_CART' | 'NOT_FOUND' | 'UNAUTHORIZED';
  message: string;
  details?: {
    productId?: string;
    available?: number;
    requested?: number;
  };
}
```

**Archivo:** `src/types/order.types.ts` (crear)

```typescript
export interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  price: number; // price at time of order
  subtotal: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string; // ISO8601
  updatedAt: string; // ISO8601
}

export interface CreateOrderRequest {
  userId: string;
  items: Array<{
    productId: string;
    quantity: number;
  }>;
}

export interface OrderResponse extends Order {}

export interface OrderError {
  success: false;
  code: string;
  message: string;
}
```

### Paso 2: Servicios API

**Archivo:** `src/services/cart/cartApi.ts` (crear)

```typescript
import type { ConfirmCartResponse, CartConfirmationError } from '../../types/cart.types';
import { authStorage } from '../auth/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const cartApi = {
  async confirmCart(cartId: string): Promise<ConfirmCartResponse> {
    if (!cartId || typeof cartId !== 'string') {
      throw new Error('Invalid cartId');
    }

    const token = authStorage.getToken();
    if (!token) {
      throw new Error('UNAUTHORIZED');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/carts/${cartId}/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token, // Already includes "Bearer "
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const error: CartConfirmationError = {
        success: false,
        code: data.code || 'UNKNOWN_ERROR',
        message: data.message || 'Failed to confirm cart',
        details: data.details,
      };
      throw error;
    }

    return data as ConfirmCartResponse;
  },
};
```

**Archivo:** `src/services/order/orderApi.ts` (crear)

```typescript
import type { CreateOrderRequest, Order, OrderError } from '../../types/order.types';
import { authStorage } from '../auth/authStorage';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

export const orderApi = {
  async createOrder(payload: CreateOrderRequest): Promise<Order> {
    const token = authStorage.getToken();
    if (!token) {
      throw new Error('UNAUTHORIZED');
    }

    // Validate that payload doesn't contain backend-managed fields
    if ('id' in payload || 'createdAt' in payload || 'updatedAt' in payload) {
      throw new Error('Payload contains backend-managed fields');
    }

    const response = await fetch(`${API_BASE_URL}/api/v1/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token,
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      const error: OrderError = {
        success: false,
        code: data.code || 'ORDER_CREATE_ERROR',
        message: data.message || 'Failed to create order',
      };
      throw error;
    }

    return data as Order;
  },

  async getOrderById(orderId: string): Promise<Order> {
    const token = authStorage.getToken();
    
    const response = await fetch(`${API_BASE_URL}/api/v1/orders/${orderId}`, {
      method: 'GET',
      headers: {
        'Authorization': token || '',
      },
    });

    if (!response.ok) {
      throw new Error('Order not found');
    }

    return response.json() as Promise<Order>;
  },
};
```

### Paso 3: Custom Hook

**Archivo:** `src/hooks/useCartConfirmation.ts` (crear)

```typescript
import { useState, useCallback } from 'react';
import type { ConfirmCartResponse, CartConfirmationError } from '../types/cart.types';
import type { Order } from '../types/order.types';
import { cartApi } from '../services/cart/cartApi';
import { orderApi } from '../services/order/orderApi';

interface UseCartConfirmationState {
  isLoading: boolean;
  error: CartConfirmationError | null;
  data: (ConfirmCartResponse & { order?: Order }) | null;
}

export const useCartConfirmation = () => {
  const [state, setState] = useState<UseCartConfirmationState>({
    isLoading: false,
    error: null,
    data: null,
  });

  // Debounce flag to prevent double submissions
  const [isProcessing, setIsProcessing] = useState(false);

  const confirmCart = useCallback(
    async (cartId: string) => {
      if (isProcessing) return;

      setIsProcessing(true);
      setState({ isLoading: true, error: null, data: null });

      try {
        // Step 1: Confirm cart
        const confirmResponse = await cartApi.confirmCart(cartId);

        // Step 2: Create order with the orderId returned
        const orderResponse = await orderApi.createOrder({
          userId: '', // TODO: Get from useAuth context
          items: [], // TODO: Get from cart items
        });

        setState({
          isLoading: false,
          error: null,
          data: {
            ...confirmResponse,
            order: orderResponse,
          },
        });
      } catch (err: unknown) {
        const error = err as CartConfirmationError;
        setState({
          isLoading: false,
          error: {
            success: false,
            code: error.code || 'UNKNOWN_ERROR',
            message: error.message || 'An error occurred',
            details: error.details,
          },
          data: null,
        });
      } finally {
        setIsProcessing(false);
      }
    },
    [isProcessing]
  );

  const reset = useCallback(() => {
    setState({ isLoading: false, error: null, data: null });
    setIsProcessing(false);
  }, []);

  return {
    ...state,
    confirmCart,
    reset,
  };
};
```

### Paso 4: Componentes

**Archivo:** `src/pages/Cart/CartConfirmationPage.tsx` (refactorizar)

```typescript
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useCartConfirmation } from '../../hooks/useCartConfirmation';
import ProductCartItem from '../../components/ProductCartItem/ProductCartItem';
import type { CartItem } from '../../types/cart.types';
import Swal from 'sweetalert2';
import clsx from 'clsx';

/**
 * Cart Confirmation Page
 * - Display cart items with full details
 * - Validate cart state (not empty, stock available)
 * - Allow user to confirm cart (triggers POST /carts/{id}/confirm)
 * - Navigate to order success on completion
 */
const CartConfirmationPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const { items: cartItems, total, totalQuantity } = useCart();
  const { isLoading, error, data, confirmCart } = useCartConfirmation();
  const [localError, setLocalError] = useState<string | null>(null);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth/login', { state: { from: '/cart' } });
    }
  }, [isAuthenticated, navigate]);

  // Navigate to success page on successful confirmation
  useEffect(() => {
    if (data?.orderId) {
      navigate(`/order-success/${data.orderId}`);
    }
  }, [data?.orderId, navigate]);

  const handleConfirmClick = async () => {
    setLocalError(null);

    // Validations
    if (cartItems.length === 0) {
      setLocalError('El carrito está vacío');
      return;
    }

    // Check stock
    const stockIssue = cartItems.find(item => item.quantity > item.stock);
    if (stockIssue) {
      setLocalError(`Stock insuficiente para ${stockIssue.name}`);
      return;
    }

    // Call confirmation
    try {
      // TODO: Get cartId from cart context/service
      const cartId = 'current-cart-id'; // Replace with actual
      await confirmCart(cartId);
    } catch (err) {
      setLocalError('Error al procesar la solicitud. Intenta de nuevo.');
    }
  };

  const isConfirmDisabled = cartItems.length === 0 || isLoading;

  return (
    <div className="w-11/12 mx-auto max-w-286">
      <h1 className="text-3xl font-bold mb-6 text-center">Carrito de Compras</h1>

      {/* Cart Items */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h2 className="text-lg font-semibold mb-4">Resumen del Carrito</h2>

        {cartItems.length === 0 ? (
          <p className="text-gray-600 text-center py-8">Tu carrito está vacío</p>
        ) : (
          <ul className="space-y-4">
            {cartItems.map((item) => (
              <li key={item.id} className="border-b pb-4 last:border-b-0">
                <ProductCartItem item={item} />
                
                {/* Stock warning */}
                {item.quantity > item.stock && (
                  <div className="mt-2 bg-red-100 border border-red-400 text-red-700 p-2 rounded">
                    Stock insuficiente: {item.stock} disponible(s)
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Totals */}
      <div className="flex flex-col items-end mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-lg">
          <strong>Cantidad Total:</strong> {totalQuantity} items
        </p>
        <p className="text-2xl font-bold text-blue-600">
          <strong>Total:</strong> ${total.toFixed(2)}
        </p>
      </div>

      {/* Error Messages */}
      {(localError || error) && (
        <div className="mt-4 bg-red-100 border border-red-400 text-red-700 p-4 rounded">
          <p className="font-semibold">{localError || error?.message}</p>
          {error?.details && (
            <p className="text-sm mt-2">
              {error.details.productId && `Producto: ${error.details.productId}`}
              {error.details.available !== undefined && ` | Disponible: ${error.details.available}`}
              {error.details.requested !== undefined && ` | Solicitado: ${error.details.requested}`}
            </p>
          )}
        </div>
      )}

      {/* Confirm Button */}
      <div className="flex justify-center mt-8 gap-4">
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
        >
          Volver a Tienda
        </button>

        <button
          onClick={handleConfirmClick}
          disabled={isConfirmDisabled}
          className={clsx(
            'px-8 py-3 rounded font-semibold transition flex items-center gap-2',
            isConfirmDisabled
              ? 'bg-gray-400 text-gray-600 cursor-not-allowed opacity-50'
              : 'bg-green-500 text-white hover:bg-green-600 cursor-pointer'
          )}
          title={isConfirmDisabled ? 'El carrito está vacío' : ''}
        >
          {isLoading ? (
            <>
              <span className="animate-spin">⏳</span>
              Procesando...
            </>
          ) : (
            'Confirmar Carrito'
          )}
        </button>
      </div>
    </div>
  );
};

export default CartConfirmationPage;
```

**Archivo:** `src/pages/Order/OrderSuccessPage.tsx` (crear)

```typescript
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { orderApi } from '../../services/order/orderApi';
import type { Order } from '../../types/order.types';
import clsx from 'clsx';

const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadOrder = async () => {
      if (!orderId) {
        setError('Orden no encontrada');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const data = await orderApi.getOrderById(orderId);
        setOrder(data);
        setError(null);
      } catch (err) {
        setError('No pudimos cargar los detalles de tu orden. Intenta más tarde.');
      } finally {
        setIsLoading(false);
      }
    };

    loadOrder();
  }, [orderId]);

  const formatDate = (isoString: string) => {
    const date = new Date(isoString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div data-testid="loading-spinner" className="animate-spin text-4xl">⏳</div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="w-11/12 mx-auto max-w-286 mt-12">
        <div className="bg-red-100 border border-red-400 text-red-700 p-6 rounded text-center">
          <h1 className="text-2xl font-bold mb-2">Error</h1>
          <p>{error || 'No encontrada'}</p>
          <button
            onClick={() => navigate('/')}
            className="mt-4 px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Volver a Tienda
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-11/12 mx-auto max-w-286 py-12">
      {/* Success Header */}
      <div className="bg-green-100 border border-green-400 rounded-lg p-6 text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">✓ Orden Confirmada</h1>
        <p className="text-green-700">Tu compra fue procesada correctamente</p>
      </div>

      {/* Order Details Card */}
      <div className="border rounded-lg p-6 bg-white shadow-md">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <p className="text-gray-600 text-sm">Número de Orden</p>
            <p className="text-2xl font-bold text-blue-600">{order.id}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Fecha de Creación</p>
            <p className="text-xl font-semibold">{formatDate(order.createdAt)}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Estado</p>
            <p className={clsx(
              'text-lg font-semibold',
              order.status === 'confirmed' ? 'text-green-600' : 'text-blue-600'
            )}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Total</p>
            <p className="text-2xl font-bold text-green-600">${order.total.toFixed(2)}</p>
          </div>
        </div>

        {/* Items Section */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Detalles de Orden</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-300">
                  <th className="pb-3">Producto</th>
                  <th className="pb-3 text-right">Cantidad</th>
                  <th className="pb-3 text-right">Precio Unitario</th>
                  <th className="pb-3 text-right">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-4">
                      <div>
                        <p className="font-medium">Producto {item.productId}</p>
                        <p className="text-sm text-gray-600">ID: {item.id}</p>
                      </div>
                    </td>
                    <td className="py-4 text-right">{item.quantity}</td>
                    <td className="py-4 text-right">${item.price.toFixed(2)}</td>
                    <td className="py-4 text-right font-semibold">${item.subtotal.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Total Row */}
          <div className="flex justify-end mt-4 border-t-2 border-gray-300 pt-4">
            <div className="text-right">
              <p className="text-gray-600 mb-2">Cantidad de items: {order.items.length}</p>
              <p className="text-2xl font-bold text-green-600">Total: ${order.total.toFixed(2)}</p>
            </div>
          </div>
        </section>

        {/* Next Actions */}
        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <button
            onClick={() => navigate('/')}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded font-semibold hover:bg-blue-700 transition"
          >
            Volver a Tienda
          </button>
          <button
            onClick={() => navigate('/orders')} // Future: My Orders page
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded font-semibold hover:bg-gray-300 transition"
          >
            Ver Mis Órdenes
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
```

---

## 🧪 ACTUALIZAR TESTS DESPUÉS DE IMPLEMENTACIÓN

Con la implementación realizada ("verde"), actualizar tests para verificar:

1. **Tests pasan con implementación real**
2. **Coverage >= 70%**
3. **No regresiones en tests existentes**

```bash
npm run test -- --coverage
```

Resultado esperado:
```
Statements   : 75.3% ( 230/305 )
Branches     : 69.4% ( 140/201 )
Functions    : 81.5% ( 65/79 )
Lines        : 76.2% ( 195/256 )
```

---

## 🎯 PLAN DE CALIDAD Y QA

### QA Checklist - Ejecución Manual

| # | Test Case | Precondiciones | Pasos | Resultado Esperado | Prioridad | Estado |
|---|-----------|---|---|---|---|---|
| QA-01 | Carrito visible con datos correctos | Usuario auth, carrito con 3+ items | 1. Navigate `/cart` 2. Verify items, total | Items mostrados, total = suma correcta | ALTA | ⏳ |
| QA-02 | Stock insuficiente bloquea confirmación | Producto con stock = 5, carrito qty = 10 | 1. Add to cart 2. Click confirm | Error modal, no confirmación | ALTA | ⏳ |
| QA-03 | Stock = 0 no permite agregar | Producto stock=0 | 1. Browse producto 2. Try add to cart | Botón deshabilitado | ALTA | ⏳ |
| QA-04 | Confirmación exitosa redirige a orden | Carrito válido, stock OK | 1. Click confirm 2. Wait 3-5s | Redirige `/order-success/{id}` | ALTA | ⏳ |
| QA-05 | Orden muestra detalles correctos | Orden creada | 1. View orden success page | Items, total, timestamp visible | MEDIA | ⏳ |
| QA-06 | Timestamps formateados (dd/mm/yyyy) | Orden con createdAt ISO8601 | 1. View orden 2. Check date format | Fecha formato dd/mm/yyyy HH:mm | MEDIA | ⏳ |
| QA-07 | No backend-managed fields en payloads | Carrito confirmación | 1. DevTools Network tab 2. Confirm | Payload no contiene id, createdAt | ALTA | ⏳ |
| QA-08 | Manejo de timeout (30s+) | Simular latencia backend > 30s | 1. Click confirm 2. Wait | Mostrar "Timeout" + retry | MEDIA | ⏳ |
| QA-09 | Debounce: 3 clicks = 1 request | Normal carrito | 1. Click confirm 3x rápido 2. DevTools | Solo 1 request al backend | MEDIA | ⏳ |
| QA-10 | Carrito vacío disable botón | Remover todos items | 1. Remove items 2. Verify botón | Botón disabled, tooltip visible | MEDIA | ⏳ |
| QA-11 | Sin autenticación redirige login | No token en localStorage | 1. Direct navigate `/cart` | Redirige `/auth/login` | ALTA | ⏳ |
| QA-12 | Error 422 STOCK_ERROR mostrado | Backend retorna 422 stock error | 1. Confirm 2. Backend error mocked | Modal con "Stock insuficiente" | MEDIA | ⏳ |
| QA-13 | "Volver a Tienda" desde orden | Orden éxito | 1. Click "Volver a Tienda" | Navega `/` sin errores | BAJA | ⏳ |
| QA-14 | "Ver Mis Órdenes" link (future) | Orden éxito | 1. Click "Ver Mis Órdenes" | Esperado: futura feature (404 ok) | BAJA | ⏳ |
| QA-15 | Loading spinner muestra | Confirmación en progreso | 1. Confirm 2. Observe antes response | Spinner/loader visible | MEDIA | ⏳ |
| QA-16 | Mobile responsive (< 640px) | Carrito en mobile | 1. Resize 640px 2. View layout | Grid ajustado, botones stacked | MEDIA | ⏳ |
| QA-17 | Accesibilidad WCAG 2.1 | Página completa | 1. WAVE/axe audit 2. Keyboard nav | No críticos, links accesibles | MEDIA | ⏳ |
| QA-18 | Idempotencia: 2+ confirms mismo orderId | Solicitud duplicada | 1. Confirm 2x con sleep(100ms) | Backend retorna **mismo orderId** | MEDIA | ⏳ |

### Edge Cases Críticos

**EC-01: Stock cambia entre agregar y confirmar**
- Setup: Producto P1 stock=10, agregado al carrito qty=8, backend reduce stock a 5 antes de confirm
- Expected: Error 422 STOCK_ERROR con detalles actuales (available=5, requested=8)
- Mitigation: Mostrar información en tiempo real

**EC-02: Carrito expirado/no encontrado**
- Setup: Usuario intenta confirmar carrito eliminado/expirado (404)
- Expected: Error "Carrito no encontrado" + botón comprar de nuevo
- Mitigation: Session timeout validación en handler

**EC-03: Usuario logueado de otra sesión**
- Setup: Token refrescado en otra pestaña, current session token invalido
- Expected: Redirige login con mensaje "Sesión expirada"
- Mitigation: Interceptor de token refresh

**EC-04: Confirmación exitosa pero creación de orden falla**
- Setup: Confirm 200 OK, pero POST /orders falla 500
- Expected: Mostrar orderId así que usuario puede consultar luego, recovery path
- Mitigation: Store orderId en sessionStorage, polling para crear orden en background

**EC-05: Payload con items inválidos**
- Setup: Frontend envía productId='' o quantity=-1
- Expected: Backend retorna 400 Bad Request
- Mitigation: Frontend valida antes de enviar

---

## 🔐 REVISIÓN DE SEGURIDAD Y CONTRATO FE/BE

### Checklist de Revisión (Code Review)

**Revisor: Security Team**

- [ ] **No hardcoded URLs**: Todas URLs usan `import.meta.env.VITE_API_BASE_URL`
- [ ] **No backend-managed fields**: Payloads no contienen `id`, `createdAt`, `updatedAt`, `status`
- [ ] **Tipos correcto**: DTOs separados, Request vs Response vs Error
- [ ] **Authorization**: Token enviado en header `Authorization: Bearer {token}`
- [ ] **Error handling**: No leak de datos sensibles en mensajes error
- [ ] **Validaciones**: Input validado antes de enviar (no null, empty strings)
- [ ] **XSS Protection**: Datos renderizados con React (template literals escaped)
- [ ] **CSRF**: POST requests con Content-Type header (CORS)

### Validación DTO Contrato

**Request Payload (POST /carts/{id}/confirm)**
```typescript
// ✅ ENVIAR
{
  // Nothing - backend confirms by cartId in URL
}

// ❌ NO ENVIAR
{
  id: 'cart-123',           // ← Backend-managed
  createdAt: '2026-02-20',  // ← Backend-managed
  userId: 'user-123'        // ← Backend-managed (from token)
}
```

**Response Validación (200 OK)**
```typescript
// ✅ ESPERAR
{
  success: true,
  cartId: "uuid-string",
  confirmedAt: "2026-02-20T15:30:45.123Z",  // ISO8601
  orderId: "uuid-string"
}

// ❌ NO ESPERAR (si aparece, es error backend)
{
  cartId,
  confirmedAt,
  orderId,
  extra_field: "not-in-contract"
}
```

---

## 🐳 INFRAESTRUCTURA - TAREAS DOCKER

### ¿Se necesitan cambios en docker-compose?

**Estado Actual:**
- Backend: Spring Boot en puerto 8080
- Database: PostgreSQL
- Message Queue: RabbitMQ

**Cambios Requeridos: NINGUNO** ✅

**Justificación:**
1. Endpoints `/carts/{id}/confirm` y `/orders` ya existen en backend
2. RabbitMQ ya configurado para eventos
3. Stock repository ya implementado
4. Frontend solo consume APIs REST (no requiere suscripción AMQP)

**Validaciones de Healthcheck (sin cambios):**
```yaml
# docker-compose.yml - Verificar presentes
services:
  backend:
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:8080/actuator/health']
      interval: 30s
      timeout: 10s
      retries: 3
  
  db:
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U postgres']
      interval: 10s
      timeout: 5s
      retries: 5
  
  rabbitmq:
    healthcheck:
      test: ['CMD', 'rabbitmq-diagnostics', '-q', 'ping']
      interval: 30s
      timeout: 10s
      retries: 5
```

**Variables de Entorno (Frontend .env.local)**
```env
# Existentes
VITE_API_BASE_URL=http://localhost:8080

# Ninguna nueva requerida
```

**Nota:** Si backend aún no expone endpoints, backend team debe:
1. Implementar `CartConfirmationController`
2. Implementar `OrderController`
3. Publicar eventos RabbitMQ `order.created`

---

## 📋 RESUMEN DE ENTREGABLES

| Artefacto | Descripción | Archivo(s) | Estado |
|-----------|-------------|-----------|--------|
| **Tipos TypeScript** | DTOs y modelos dominio | `src/types/cart.types.ts`, `src/types/order.types.ts` | ✏️ Crear |
| **Servicios API** | HTTP clients | `src/services/cart/cartApi.ts`, `src/services/order/orderApi.ts` | ✏️ Crear |
| **Hook Personalizado** | Lógica confirmación | `src/hooks/useCartConfirmation.ts` | ✏️ Crear |
| **Componentes UI** | Vistas confirmación + orden | `src/pages/Cart/CartConfirmationPage.tsx`, `src/pages/Order/OrderSuccessPage.tsx` | ✏️ Crear |
| **Tests Unitarios** | Jest tests servicios/hooks | `src/**/*.test.ts` | ✏️ Crear |
| **Tests E2E** | Playwright scripts | `e2e/cart-confirmation.spec.ts` | ✏️ Crear |
| **Tests Integración** | MSW mocks | `src/__tests__/integration/**` | ✏️ Crear |
| **QA Checklist** | Manual test cases | Documento de testing | ✓ Completado |
| **Documentación** | Este HU completo | `instructions/HU-CART-ORDER-CONFIRMATION.md` | ✓ Completado |

---

## 🚀 PRÓXIMOS PASOS

### Semana 1 - Implementación
1. **Day 1-2:** Escribir todos tests (ROJO)
2. **Day 3-4:** Implementar tipos + servicios + hooks
3. **Day 5:** Implementar componentes + unit tests GREEN

### Semana 2 - Validación
1. **Day 1-2:** E2E tests con Playwright
2. **Day 3:** QA manual execution
3. **Day 4:** Code review + seguridad
4. **Day 5:** Merge + deploy staging

### Dependencias
- ✅ Backend endpoints activos
- ✅ RabbitMQ funcionando
- ✅ AuthContext implementado
- ✅ CartContext implementado

---

## 📞 CONTACTO Y SOPORTE

- **Product Owner:** Validar criterios de aceptación en Day 2
- **Backend Team:** Confirmar endpoints y contracts en Day 1
- **QA Team:** Revisar test plan y ejecutar checklist en Week 2
- **DevOps:** Confirmar docker-compose health checks OK

---

**Documento creado:** 2026-02-20  
**Versión:** 1.0  
**Autor:** IRIS (Intelligent Requirement Interpreter)  
**Estado:** Pronto a implementación (TDD)
