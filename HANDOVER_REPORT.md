# HANDOVER_REPORT

> Documento generado con apoyo de GitHub Copilot y validado manualmente contra el codigo del repositorio.

## 1. Resumen ejecutivo

`sofkify-fe` es el frontend del MVP e-commerce Sofkify, construido como SPA con React + TypeScript + Vite.

El frontend cubre actualmente:

- Navegacion principal y layout base.
- Pantallas de home, autenticacion, productos, detalle de producto y carrito.
- Integracion real de autenticacion contra backend.
- Catalogo y carrito en estado parcial (mock/local en varias rutas).

## 2. Que hace el sistema (funcional)

## 2.1 Rutas principales

Definidas en `src/App.tsx`:

- `/` -> Home
- `/auth` -> Login/registro
- `/product` -> Listado de productos
- `/product/:id` -> Detalle de producto
- `/cart` -> Carrito

## 2.2 Flujo funcional actual

1. Usuario navega por catalogo y detalle.
2. Usuario puede registrarse o iniciar sesion en `/auth`.
3. Login/registro usa backend (`user-service`) mediante `authApi`.
4. Vista de productos y carrito usan actualmente datos mock para parte del flujo.

## 3. Como esta construido (arquitectura)

## 3.1 Stack tecnico

- React 19
- TypeScript 5.9
- Vite 7
- React Router DOM 7
- Tailwind CSS 4

## 3.2 Organizacion por capas (frontend)

- `src/pages`: vistas por ruta (`Home`, `Auth`, `Product`, `Cart`, etc.).
- `src/components`: componentes UI reutilizables.
- `src/services`:
  - `auth/authApi.ts`: llamadas HTTP de autenticacion.
  - `products/productService.ts`: capa de productos (actualmente mock en metodos clave).
- `src/hooks`: logica reutilizable (`useLogin`, `useRegister`, `useCart`, etc.).
- `src/types`: contratos tipados de dominio frontend.
- `src/utils`: validaciones y formateadores.

## 3.3 Estado de integracion FE-BE

Integracion activa:
- `src/services/auth/authApi.ts`
  - Base URL por `VITE_API_BASE_URL` (fallback `http://localhost:8080`)
  - Endpoints:
    - `POST /api/users/auth/login`
    - `POST /api/users`

Integracion parcial/mock:
- `src/services/products/productService.ts`
  - `getAllProducts`, `getProductById`, `searchProducts`, `filterByPrice` usan mock (`products.ts`).
- `src/pages/Cart/Cart.tsx`
  - Renderiza `cartItems` locales (`src/pages/Cart/data.ts`).
- `src/pages/Cart/useCart.ts`
  - Maneja estado local de carrito en cliente.

## 4. Estructura del repositorio

Raiz:
- `src/`
- `public/`
- `package.json`
- `vite.config.ts`
- `tsconfig*.json`
- `eslint.config.js`

Comandos principales:

```bash
npm install
npm run dev
npm run build
npm run lint
```

## 5. Operacion local (estado heredado)

## 5.1 Prerrequisitos

- Node.js 20+ (recomendado 22+)
- npm 10+
- Backend corriendo para autenticacion (`user-service` en `8080`)

## 5.2 Variables de entorno

- `VITE_API_BASE_URL` (opcional)
  - Si no se define, usa `http://localhost:8080`.

## 6. Calidad y riesgos tecnicos

Fortalezas:
- Estructura modular clara (pages/components/services/hooks).
- Tipado TypeScript consistente.
- Build productivo funcional con Vite.

Riesgos/deuda actual:
- Productos y carrito aun no completamente conectados a backend real.
- Estado de carrito local (sin sincronizacion persistente server-side).
- Sin estrategia de manejo global de errores HTTP/estado de sesion.
- No hay suite amplia de pruebas automatizadas frontend en el repo actual.

## 7. Checklist de handover para nuevo equipo

1. Instalar dependencias con `npm install`.
2. Definir `VITE_API_BASE_URL` si backend no corre en `localhost:8080`.
3. Ejecutar `npm run dev` y validar rutas principales.
4. Probar login/registro contra backend activo.
5. Planificar migracion de `productService` y `Cart` desde mocks a API real.
6. Agregar pruebas (unitarias/integacion UI) para rutas y hooks criticos.

## 8. Estado del repo al entregar

- Frontend funcional para navegacion y autenticacion base.
- Integracion backend parcial (auth completa, productos/carrito en transicion).
- Base preparada para evolucionar a flujo e-commerce end-to-end completo.

