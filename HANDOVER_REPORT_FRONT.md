# HANDOVER REPORT - Sofkify (Frontend)

## Resumen rápido
Repositorio: `sofkify-fe`
Stack: React 19 + TypeScript + Vite. Estilos: TailwindCSS (si está configurado). Router: React Router v7. State: hooks locales y custom hooks (`useCart`, `useAuthValidation`). HTTP: `fetch` nativo. Algunas capas usan datos mock (`services/products/products.ts`) en vez de llamadas al backend.

## Cómo correr localmente
Desde `sofkify-fe/`:

```bash
npm install
npm run dev      # servidor Vite (p. ej. http://localhost:5173)
npm run build    # crear build de producción
```

## Archivos y hooks importantes
- Hooks: `src/hooks/useAuthValidation.ts`, `src/hooks/useLogin.ts`, `src/hooks/useRegister.ts`, `src/pages/Cart/useCart.ts`
- Servicios: `src/services/products/productService.ts` (mock o TODOs), `src/services/auth/authApi.ts`, `src/services/auth/authStorage.ts`
- Componentes principales: `src/components/Auth/LoginForm.tsx`, `src/components/Product/Product.tsx`, `src/pages/Cart/Cart.tsx`

## Problemas observados (prioridad alta → baja)
- `productService` usa mock data en `products.ts` → riesgo de divergencia con backend.
- Autenticación almacena solo email en `localStorage` (no hay JWT ni manejo real de sesiones).
- Rutas no protegidas (p. ej. `/cart`) → requiere guard auth.
- Falta de tests (unit/integration) y de CI para frontend.
- Persistencia del carrito sólo en memoria (perdida al refresh).

## Recomendaciones inmediatas
1. Reemplazar mocks en `productService` por llamadas reales a la API (añadir `VITE_API_BASE_URL` en env).  
2. Implementar JWT: actualizar `authApi` y `authStorage` para almacenar token seguro (`TOKEN_KEY`) y refresco si aplica.  
3. Añadir `ProtectedRoute` para rutas privadas (cart, checkout).  
4. Persistir carrito en `localStorage` o sincronizar con `cart-service` cuando usuario logueado.  
5. Añadir tests con Vitest + React Testing Library.

## Cómo generar documentación (TypeDoc)
Instalar y generar:

```bash
npm install --save-dev typedoc
npx typedoc --out docs/ src/
```

Agregar JSDoc a hooks y servicios para mejorar la salida.

## PRs sugeridos
- PR: migración `productService` → real API + manejo de errores.  
- PR: ProtectedRoute y redirección al login.  
- PR: persistencia carrito + sincronización con backend.  
- PR: configurar pipeline simple (GitHub Actions) con `npm ci`, `npm run build`, `npm run lint`.

## Referencias rápidas en repo
- README: `sofkify-fe/README.md`  
- Hooks: `sofkify-fe/src/hooks/useAuthValidation.ts`  
- Services: `sofkify-fe/src/services/products/productService.ts`, `sofkify-fe/src/services/auth/authApi.ts`

---

¿Quieres que proceda a crear PRs con alguno de los cambios sugeridos, o prefieres que primero inyecte documentación JSDoc/TypeDoc en los hooks y servicios?
## Documentacion tecnica consolidada (desde /doc/frontend)

### authApi
- Ubicacion: `sofkify-fe/src/services/auth/authApi.ts`
- Proposito: Centraliza llamadas HTTP de autenticacion (`login`, `register`).
- Responsabilidades:
  - Usar `VITE_API_BASE_URL` y helper `postRequest`.
  - Mapear `CreateUserDTO` al payload esperado por backend.
  - Lanzar `Error` con mensaje de backend en respuestas no-2xx.
- Helper clave: `postRequest<T>(endpoint, body)`.
- Observaciones:
  - `mapToBackendRegisterFormat` es temporal.
- Mejoras sugeridas:
  - Eliminar mapper temporal cuando backend acepte payload completo.
  - Manejar errores estructurados.
  - Agregar tests tipados de respuestas.

### productService
- Ubicacion: `sofkify-fe/src/services/products/productService.ts`
- Proposito: Capa de servicio de productos (actualmente con mocks de `products.ts`).
- Responsabilidades:
  - Exponer `getAllProducts`, `getProductById`, `searchProducts`.
  - Transformar DTO a modelo interno.
- Estado actual:
  - Llamadas reales aun en TODO; usa `cartItems` mock.
- Mejoras sugeridas:
  - Migrar a fetch real contra `/api/products`.
  - Mantener tipado estricto de respuestas.
  - Evaluar cache/paginacion y tests de integracion.

### useAuthValidation
- Ubicacion: `sofkify-fe/src/hooks/useAuthValidation.ts`
- Proposito: Hook generico para manejo de formularios auth (estado + validacion + submit).
- Responsabilidades:
  - Gestionar `formData`, `errors`, `touched`, `isSubmitting`.
  - Exponer `handleChange`, `handleBlur`, `handleSubmit`.
  - Ejecutar validaciones y `onSubmit` inyectado.
- Edge cases actuales:
  - Valida on-change solo campos tocados.
  - En submit marca todos los campos como tocados.
- Mejoras sugeridas:
  - Tipar mejor `ValidationErrors`.
  - Soportar validadores async custom.
  - Agregar tests unitarios.

### useCart
- Ubicacion: `sofkify-fe/src/pages/Cart/useCart.ts`
- Proposito: Gestionar estado y operaciones del carrito.
- Responsabilidades:
  - Mantener arreglo de `CartItem`.
  - Exponer operaciones CRUD de items y calculo de totales.
  - Respetar validacion de stock.
- Comportamientos relevantes:
  - Si excede stock, registra warning e ignora operacion.
  - Si cantidad <= 0, elimina item.
  - Estado solo en memoria (sin persistencia).
- Mejoras sugeridas:
  - Persistencia local/remota (localStorage o backend).
  - Retornar resultado de operacion (exito/fallo) en vez de solo log.
  - Tests de concurrencia y cambios simultaneos.
