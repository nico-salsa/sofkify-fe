# Lista de cambios requeridos por auditoría

## Resumen ejecutivo

Base: auditoría técnica con hallazgos SOLID (S, O, L, I, D)
Propósito: Estandarizar tipos, extraer servicios y centralizar estado
Estimación total: ~20 horas de desarrollo

---

## TIPOS E INTERFACES - CREAR/MODIFICAR

### 1.1 src/types/product.ts (CREAR - CONSOLIDAR)

**Estado actual:** Tipos dispersos en product.type.ts y api/types.ts
**Cambio:** Crear archivo centralizado con modelos bien separados

```
Crear tipos:
- Product (modelo de dominio BASE)
- ProductDTO (para recibir de API)
- ProductPresentation (para mostrar en UI)
- CartItem (para carrito)

Eliminar tipos duplicados de:
- src/types/product.type.ts
- src/api/types.ts
```

**Archivos afectados:**
- Crear: [src/types/product.ts](src/types/product.ts)
- Modificar: [src/types/product.type.ts](src/types/product.type.ts) → deprecate/merge
- Modificar: [src/api/types.ts](src/api/types.ts) → importar de tipos centralizados

---

### 1.2 src/types/user.types.ts (MODIFICAR)

**Estado actual:** Tiene User, LoginCredentials, RegisterData, AuthResponse

**Cambios requeridos:**
- Cambiar `phone: number` → `phone: string`
- Agregar `CreateUserDTO` (exactamente lo que backend espera)
- Agregar `UserResponse` (lo que backend retorna)
- Separar `User` (modelo interno) de `UserDTO` (API)

**Impacto:**
- [src/components/Auth/RegisterForm.tsx](src/components/Auth/RegisterForm.tsx) - cambiar conversión de phone
- [src/components/Auth/LoginForm.tsx](src/components/Auth/LoginForm.tsx) - validar tipos
- [src/pages/Auth/Auth.tsx](src/pages/Auth/Auth.tsx) - adaptar handlers

---

### 1.3 src/types/cart.types.ts (CREAR - NUEVO)

**Estado actual:** No existe; lógica dispersa en componentes

**Crear tipos:**
```
- CartState
- CartItem (con cantidad, total)
- CartContextType (para context)
- CartActions (agregar, quitar, actualizar)
```

**Archivos que lo necesitarán:**
- [src/context/CartContext.tsx](src/context/CartContext.tsx) (crear)
- [src/hooks/useCart.ts](src/hooks/useCart.ts) (crear)

---

## SERVICIOS - CREAR/MODIFICAR

### 2.1 src/services/authService.ts (CREAR)

**Estado actual:** Lógica en [src/pages/Auth/Auth.tsx](src/pages/Auth/Auth.tsx) (console.log/setTimeout)

**Contexto Backend (sin autorización aún):**
- ❌ Sin tokens JWT
- ❌ Sin refresh tokens
- ✅ Login: POST `/auth/login` (email, password) → respuesta con estado
- ✅ Register: POST `/auth/register` (datos de usuario + password) → respuesta con estado
- ⚠️ Password enviado como texto plano (mala práctica temporal, mejorar en futuro)

**Problema Detectado:**  
Lógica de autenticación mezclada con componente; sin abstracción de servicios.

**Impacto Técnico:**
- ❌ No reutilizable entre componentes
- ❌ Difícil de testear
- ❌ Acoplado a React
- ❌ Sin validación de contratos

**Patrón que Sigue Actualmente:**  
Anti-patrón: Page with all logic

**Patrones Recomendados:**
- ✅ **Singleton Pattern**: Una única instancia del servicio en toda la app
- ✅ **Service Layer Pattern**: Abstrae lógica de negocio (llamadas a API)
- ✅ **Factory Pattern** (opcional): Para crear la instancia singleton de forma controlada
- ✅ **Dependency Inversion Principle (SOLID)**: Inyectar a través de contexto/hooks, no instanciar en componentes

**Crear funciones:**
```typescript
// Métodos principales
- login(credentials: LoginCredentials): Promise<AuthResponse>
- register(data: CreateUserDTO): Promise<AuthResponse>

// Métodos auxiliares (para futura extensión con tokens)
- validateUserExists(email: string): Promise<boolean>
- logout(): void
```

**Responsabilidades:**
- Llamadas HTTP a `/auth/login` y `/auth/register`
- Manejo de errores (400, 500, etc.)
- Validación que los datos cumplan con tipos (LoginCredentials, CreateUserDTO)
- Persistencia de estado de sesión (localStorage para futuro uso con tokens)

**Usado por:**
- [src/hooks/useAuth.ts](src/hooks/useAuth.ts) (crear)
- [src/pages/Auth/Auth.tsx](src/pages/Auth/Auth.tsx) (refactorizar)

**Criterios de Aceptación:**

| Criterio | Descripción |
|----------|-------------|
| **Singleton** | Solo una instancia durante la app: `const authService = new AuthService()` exportada |
| **Validación SOLID** | No violar Single Responsibility: solo maneja autenticación |
| **Tipado** | Todos los parámetros y retornos tipados con TypeScript |
| **Errores** | Capturar y relanzan errores de forma consistente |
| **Sin Tokens** | Por ahora, solo guardar email del usuario en localStorage (no JWT) |
| **Extensible** | Diseño que permita agregar tokens/refresh tokens después |

---

### 2.2 src/services/productService.ts (CREAR)

**Estado actual:** Datos mockeados en [src/api/products.ts](src/api/products.ts); hook sin abstracción en [src/api/useGetProducts.ts](src/api/useGetProducts.ts)

**Crear funciones:**
```typescript
- getAllProducts(): Promise<ProductDTO[]>
- getProductById(id: string): Promise<ProductDTO>
- searchProducts(query: string): Promise<ProductDTO[]>
- filterByPrice(min: number, max: number): Promise<ProductDTO[]>
```

**Responsabilidades:**
- Llamadas a API
- Transformación de DTO → Product
- Caché/optimización
- Manejo de errores

**Usado por:**
- [src/api/useGetProducts.ts](src/api/useGetProducts.ts) (modificar)
- [src/pages/Home/Home.tsx](src/pages/Home/Home.tsx)
- [src/pages/Product/ProductDetail.tsx](src/pages/Product/ProductDetail.tsx)

---

### 2.3 src/services/cartService.ts (CREAR)

**Estado actual:** Lógica dispersa entre [src/pages/Cart/Cart.tsx](src/pages/Cart/Cart.tsx) y [src/components/ProductCartItem/ProductCartItem.tsx](src/components/ProductCartItem/ProductCartItem.tsx)

**Crear funciones:**
```typescript
- addItemToCart(product: Product, quantity: number): CartItem
- removeItemFromCart(id: string, cart: CartItem[]): CartItem[]
- updateQuantity(id: string, quantity: number, cart: CartItem[]): CartItem[]
- calculateTotal(cart: CartItem[]): number
- calculateTotalQuantity(cart: CartItem[]): number
- clearCart(): void
- persistCart(cart: CartItem[]): void (localStorage)
- loadCart(): CartItem[]
```

**Responsabilidades:**
- Cálculos de carrito
- Persistencia en localStorage
- Validación de stock

**Usado por:**
- [src/hooks/useCart.ts](src/hooks/useCart.ts)
- [src/context/CartContext.tsx](src/context/CartContext.tsx)

---

## HOOKS PERSONALIZADOS - CREAR

### 3.1 src/hooks/useAuth.ts (CREAR)

**Estado actual:** No existe; lógica en página

**Crear hook:**
```typescript
interface UseAuthReturn {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login(credentials: LoginCredentials): Promise<void>
  register(data: CreateUserDTO): Promise<void>
  logout(): void
}

export const useAuth = (): UseAuthReturn => {
  // Integrar con authService
  // Integrar con AuthContext
}
```

**Usado por:**
- [src/pages/Auth/Auth.tsx](src/pages/Auth/Auth.tsx) (reemplazar lógica)
- [src/components/Header/Header.tsx](src/components/Header/Header.tsx) (mostrar usuario)
- Rutas protegidas (crear)

---

### 3.2 src/hooks/useCart.ts (CREAR)

**Estado actual:** No existe; estado en App.tsx y componentes

**Crear hook:**
```typescript
interface UseCartReturn {
  items: CartItem[]
  total: number
  quantity: number
  isLoading: boolean
  addItem(product: Product, qty: number): void
  removeItem(id: string): void
  updateQuantity(id: string, qty: number): void
  clearCart(): void
}

export const useCart = (): UseCartReturn => {
  // Integrar con CartContext
}
```

**Usado por:**
- [src/pages/Cart/Cart.tsx](src/pages/Cart/Cart.tsx)
- [src/pages/Product/ProductDetail.tsx](src/pages/Product/ProductDetail.tsx)
- [src/components/ProductCartItem/ProductCartItem.tsx](src/components/ProductCartItem/ProductCartItem.tsx)

---

### 3.3 src/hooks/useNavigation.ts (CREAR)

**Estado actual:** No existe; navigate hardcodeado en componentes

**Crear hook:**
```typescript
interface UseNavigationReturn {
  goBack(): void
  goHome(): void
  goToProduct(id: string): void
  goToCart(): void
  goToAuth(): void
}

export const useNavigation = (): UseNavigationReturn => {
  // wrapper de useNavigate()
}
```

**Usado por:**
- [src/components/Auth/LoginForm.tsx](src/components/Auth/LoginForm.tsx)
- [src/components/Auth/RegisterForm.tsx](src/components/Auth/RegisterForm.tsx)
- Varios componentes de navegación

---

## CONTEXTOS - CREAR

### 4.1 src/context/AuthContext.tsx (CREAR)

**Estado actual:** No existe

**Crear:**
```typescript
interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login(credentials: LoginCredentials): Promise<void>
  register(data: CreateUserDTO): Promise<void>
  logout(): void
  clearError(): void
}

export const AuthProvider: React.FC<{ children: ReactNode }>
export const useAuthContext = (): AuthContextType
```

**Afecta:**
- [src/main.tsx](src/main.tsx) - envolver App
- [src/hooks/useAuth.ts](src/hooks/useAuth.ts)

---

### 4.2 src/context/CartContext.tsx (CREAR)

**Estado actual:** No existe; estado en [src/App.tsx](src/App.tsx) (hardcodeado)

**Crear:**
```typescript
interface CartContextType {
  items: CartItem[]
  total: number
  quantity: number
  addItem(product: Product, qty: number): void
  removeItem(id: string): void
  updateQuantity(id: string, qty: number): void
  clearCart(): void
}

export const CartProvider: React.FC<{ children: ReactNode }>
export const useCartContext = (): CartContextType
```

**Respons:**
- Persistencia en localStorage
- Sincronización entre componentes
- Total y cantidad en tiempo real

**Afecta:**
- [src/main.tsx](src/main.tsx) - envolver App
- [src/App.tsx](src/App.tsx) - remover estado local

---

## VALIDADORES - CREAR

### 5.1 src/validators/authValidation.ts (CREAR)

**Estado actual:** Validaciones inline en componentes

**Crear esquemas Zod/Yup:**
```typescript
- loginSchema: validar email + password
- registerSchema: validar todos los campos RegisterData
- createUserDTOSchema: exactamente lo que backend espera
```

**Usado por:**
- [src/components/Auth/LoginForm.tsx](src/components/Auth/LoginForm.tsx) (reemplazar lógica)
- [src/components/Auth/RegisterForm.tsx](src/components/Auth/RegisterForm.tsx) (reemplazar lógica)
- [src/services/authService.ts](src/services/authService.ts)

**Nota:** Requiere instalar `zod` o `yup` en package.json

---

### 5.2 src/validators/productValidation.ts (CREAR)

**Estado actual:** No existe

**Crear esquemas:**
```
- ProductSchema
- CarItemSchema
- FilterCriteriaSchema
```

---

## UTILIDADES - CREAR

### 6.1 src/utils/formatters.ts (CREAR)

**Estado actual:** Funciones locales en [src/pages/Product/ProductDetail.tsx](src/pages/Product/ProductDetail.tsx)

**Crear funciones:**
```typescript
- formatCurrency(price: number, currency: string): string
- formatDate(date: string | Date): string
- formatPhoneNumber(phone: string): string
- truncateText(text: string, maxLength: number): string
```

**Usado por:**
- ProductDetail (formatCurrency ya existe aquí)
- Varios componentes

---

### 6.2 src/utils/validators.ts (CREAR)

**Estado actual:** Regex dispersas en componentes

**Crear funciones:**
```typescript
- isValidEmail(email: string): boolean
- isValidPassword(password: string): boolean
- isValidPhone(phone: string): boolean
- isValidURL(url: string): boolean
```

---

### 6.3 src/utils/localStorage.ts (CREAR)

**Estado actual:** No existe

**Crear funciones:**
```typescript
- setItem(key: string, value: any): void
- getItem(key: string): any
- removeItem(key: string): void
- clearAll(): void
```

---

### 6.4 src/config/api.config.ts (CREAR)

**Estado actual:** No existe

**Crear configuración:**
```typescript
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
  TIMEOUT: import.meta.env.VITE_API_TIMEOUT || 5000,
  ENDPOINTS: {
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    PRODUCTS: '/products',
    CART: '/cart',
  }
}
```

---

## COMPONENTES - MODIFICAR

### 7.1 src/components/Auth/LoginForm.tsx (MODIFICAR)

**Cambios requeridos:**
- Quitar validaciones inline → usar `loginSchema` de `authValidation.ts`
- Quitar conversión de datos → usar `CreateUserDTO`
- Agregar botón "Volver" (usar `useNavigation`)
- Separar componentes reutilizables: FormInput, FormButton

**Líneas afectadas:**
- Validación: líneas 9-26
- Envío: línea 37-40

---

### 7.2 src/components/Auth/RegisterForm.tsx (MODIFICAR)

**Cambios requeridos:**
- Quitar validaciones inline → `registerSchema`
- Cambiar `phone: number` → `phone: string`
- Quitar conversión de phone → `Number(formData.phone)` (línea 69)
- Agregar botón "Volver"
- Extraer componentes presentacionales

**Líneas afectadas:**
- Todo el componente (validación + UI mixtas)

---

### 7.3 src/components/Auth/AuthImage.tsx (SIN CAMBIOS)

**Estado:** Correcto, es presentacional puro

---

### 7.4 src/components/Product/Product.tsx (MODIFICAR)

**Estado actual:**
```tsx
interface ProductProps {
  product: CartItem  // PROBLEMA: debería ser Product o ProductPresentation
}
```

**Cambios:**
- Cambiar `CartItem` → `ProductPresentation`
- Tipar correctamente props
- Agregar fallback para imágenes (alt mejorado)
- Mejorar accesibilidad

**Archivos afectados:**
- Cambiar importación de tipos
- [src/pages/Home/Home.tsx](src/pages/Home/Home.tsx) - ajustar mapeo

---

### 7.5 src/components/ProductCartItem/ProductCartItem.tsx (MODIFICAR)

**Estado actual:** Todas las props opcionales; handlers como callbacks

**Cambios:**
- Tipar props correctamente (obligatorios vs opcionales)
- Handlers deben venir del hook `useCart`, no como props
- Separar lógica de presentación
- Mejorar cálculo de totales

**Impacto:**
- Conectar con `useCart` en lugar de callbacks
- Remover estado local de cantidad

---

### 7.6 src/components/Header/Header.tsx (MODIFICAR)

**Cambios requeridos:**
- Agregar integración con `useAuth` para mostrar usuario/logout
- Condicional: mostrar "Iniciar Sesión" o usuario + "Logout"
- Icono de carrito → mostrar cantidad (desde `useCart`)

**Usado por:**
- [src/App.tsx](src/App.tsx) - pasar contextos

---

### 7.7 src/components/BurguerButton/BurguerButton.tsx (SIN CAMBIOS)

**Estado:** Presentacional, está bien

---

### 7.8 src/components/AsideHeader/AsideHeader.tsx (MODIFICAR)

**Cambios:**
- Integrar con `useAuth` para mostrar menú dinámico
- Agregar logout al aside

---

### 7.9 src/components/common/FormInput.tsx (CREAR - NUEVO)

**Estado:** No existe; inputs duplicados en formularios

**Crear componente reutilizable:**
```tsx
interface FormInputProps {
  label: string
  name: string
  type: 'text' | 'email' | 'password' | 'tel' | 'number'
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  error?: string
  disabled?: boolean
}

export const FormInput: React.FC<FormInputProps>
```

**Usado en:**
- [src/components/Auth/LoginForm.tsx](src/components/Auth/LoginForm.tsx)
- [src/components/Auth/RegisterForm.tsx](src/components/Auth/RegisterForm.tsx)

---

### 7.10 src/components/common/FormButton.tsx (CREAR - NUEVO)

**Crear componente reutilizable:**
```tsx
interface FormButtonProps {
  label: string
  isLoading: boolean
  disabled?: boolean
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline'
  type?: 'button' | 'submit'
}

export const FormButton: React.FC<FormButtonProps>
```

---

## PÁGINAS - MODIFICAR

### 8.1 src/pages/Auth/Auth.tsx (MODIFICAR)

**Estado actual:** Tiene lógica de login/register con console.log/setTimeout

**Cambios:**
- Quitar lógica local → usar `useAuth`
- Usar `authService` para llamadas reales
- Agregar redirección si user ya autenticado
- Mejorar manejo de errores

**Líneas que cambian:**
- handleLogin (línea 14-23)
- handleRegister (línea 25-39)

---

### 8.2 src/pages/Home/Home.tsx (MODIFICAR)

**Estado actual:**
```tsx
const products = useGetProducts()
products.map(product => <Product product={product} />)
```

**Cambios:**
- Cambiar `CartItem` → `Product` en tipado
- Agregar estados loading/error
- Agregar fallback UI si no hay productos
- Agregar botón "Agregar al carrito" en listado
- Usar `useCart` para agregar items

**Impacto:**
- [src/api/useGetProducts.ts](src/api/useGetProducts.ts) - agregar estados
- [src/components/Product/Product.tsx](src/components/Product/Product.tsx) - tipar

---

### 8.3 src/pages/Product/Product.tsx (SIN CAMBIOS)

**Estado:** Es index/redirección

---

### 8.4 src/pages/Product/ProductDetail.tsx (MODIFICAR)

**Estado actual:**
- formatCurrency inline
- "Agregar al carrito" con alert()
- Estado local de qty

**Cambios:**
- Usar `formatCurrency` de `utils/formatters.ts`
- Usar `useCart` para agregar items reales
- Usar `useNavigation` para volver
- Mejorar loading state
- Validar stock antes de agregar

---

### 8.5 src/pages/Cart/Cart.tsx (MODIFICAR)

**Estado actual:**
- Recibe items como prop (hardcodeado en App)
- Tiene interface duplicada `ICartItem`
- Sin handlers reales

**Cambios:**
- Usar `useCart` para obtener items
- Remover props (ya no necesarias)
- Implementar handlers: quitar, actualizar qty
- Agregar botones: "Continuar comprando", "Proceder a checkout", "Vaciar carrito"
- Calculadora de totales desde `useCart`
- Mensaje si carrito vacío

**Archivos afectados:**
- [src/App.tsx](src/App.tsx) - remover cartItems prop

---

### 8.6 src/pages/NotFound/NotFound.tsx (SIN CAMBIOS)

**Estado:** Está bien

---

## CONFIGURACIÓN E INFRAESTRUCTURA - CREAR

### 9.1 Dockerfile (CREAR)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 5173
CMD ["npm", "run", "dev"]
```

---

### 9.2 docker-compose.yml (CREAR)

```yaml
version: '3.8'
services:
  frontend:
    build: .
    ports:
      - "5173:5173"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - VITE_API_BASE_URL=http://localhost:3000
```

---

### 9.3 .env.example (CREAR)

```
VITE_API_BASE_URL=http://localhost:3000
VITE_API_TIMEOUT=5000
```

---

### 9.4 .commitlintrc.json (CREAR)

```json
{
  "extends": ["@commitlint/config-conventional"],
  "rules": {
    "type-enum": [
      2,
      "always",
      ["feat", "fix", "refactor", "audit", "docs", "style", "test", "chore"]
    ]
  }
}
```

---

### 9.5 CONTRIBUTING.md (CREAR)

Requerimientos:
- Convención de commits
- Estructura de ramas
- Guía de código
- Setup local

---

## ARCHIVOS QUE NECESITAN INSTALACIONES

### package.json - AGREGAR DEPENDENCIAS

**Dependencias necesarias:**
```json
{
  "zod": "^3.x.x",
  "axios": "^1.x.x"
}
```

**DevDependencies:**
```json
{
  "@commitlint/cli": "^19.x.x",
  "@commitlint/config-conventional": "^19.x.x",
  "husky": "^9.x.x"
}
```

---

## ARCHIVOS A MANTENER/USAR

### src/main.tsx (MODIFICAR - agregar providers)

**Cambios:**
```tsx
import { AuthProvider } from './context/AuthContext'
import { CartProvider } from './context/CartContext'

<AuthProvider>
  <CartProvider>
    <App />
  </CartProvider>
</AuthProvider>
```

---

### src/App.tsx (MODIFICAR)

**Cambios:**
- Remover estado local `cartItems`
- Remover `toggleOpen` a Hook personalizado
- Usar `useCart` en lugar de prop Cart
- Integrar providers existentes

---

## RESUMEN DE ARCHIVOS POR ACCIÓN

### CREAR (19 archivos)
- src/services/authService.ts
- src/services/productService.ts
- src/services/cartService.ts
- src/hooks/useAuth.ts
- src/hooks/useCart.ts
- src/hooks/useNavigation.ts
- src/context/AuthContext.tsx
- src/context/CartContext.tsx
- src/validators/authValidation.ts
- src/validators/productValidation.ts
- src/utils/formatters.ts
- src/utils/validators.ts
- src/utils/localStorage.ts
- src/config/api.config.ts
- src/components/common/FormInput.tsx
- src/components/common/FormButton.tsx
- Dockerfile
- docker-compose.yml
- .env.example
- .commitlintrc.json
- CONTRIBUTING.md

### MODIFICAR (13 archivos)
- src/types/product.ts (consolidar types)
- src/types/user.types.ts (cambios phone, DTOs)
- src/components/Auth/LoginForm.tsx
- src/components/Auth/RegisterForm.tsx
- src/components/Product/Product.tsx
- src/components/ProductCartItem/ProductCartItem.tsx
- src/components/Header/Header.tsx
- src/components/AsideHeader/AsideHeader.tsx
- src/pages/Auth/Auth.tsx
- src/pages/Home/Home.tsx
- src/pages/Product/ProductDetail.tsx
- src/pages/Cart/Cart.tsx
- src/main.tsx
- src/App.tsx
- package.json
- README.md

### REFACTORIZAR (2 archivos)
- src/api/useGetProducts.ts (usar productService)
- src/api/types.ts (usar tipos centralizados)

### DEPRECATE (1 archivo)
- src/types/product.type.ts (mover a product.ts)

---

## ORDEN RECOMENDADO DE IMPLEMENTACIÓN

1. **Fase 1 - Base (2h):** Tipos y validadores
   - Consolidar src/types/product.ts
   - Actualizar src/types/user.types.ts
   - Crear authValidation.ts y productValidation.ts

2. **Fase 2 - Servicios (3h):** Capas de negocio
   - Crear authService.ts
   - Crear productService.ts
   - Crear cartService.ts

3. **Fase 3 - Contextos y Hooks (3h):** Estado global
   - Crear AuthContext + useAuth
   - Crear CartContext + useCart
   - Crear useNavigation

4. **Fase 4 - Componentes comunes (2h):** Reutilización
   - FormInput y FormButton
   - Actualizar formularios Auth

5. **Fase 5 - Páginas (4h):** Integración final
   - Auth.tsx, Home.tsx, ProductDetail.tsx, Cart.tsx
   - Header y AsideHeader

6. **Fase 6 - Infraestructura (1h):** Docker y docs
   - Dockerfile, docker-compose.yml, .env.example
   - CONTRIBUTING.md

7. **Fase 7 - Ajustes finales (2h):** Testing y pulido

---

## CRITERIOS DE ACEPTACIÓN POR HALLAZGO

| Hallazgo | Criterio de aceptación |
|---|---|
| S-1 | Validaciones en esquema, componentes sin lógica de transformación |
| S-2 | useCart centraliza, componentes son presentacionales |
| O-1 | Un único Product.ts, DTOs separadas |
| O-2 | productService abstrae mocks, hook reutilizable |
| O / I-1 | Props específicas y pequeñas, no opcionales sin razón |
| D-1 | Servicios inyectados via hooks/context, no hardcodeados |
| T-1 | Docker funcional, npm run dev en contenedor |
| T-2 | .commitlintrc.json + CONTRIBUTING.md documentados |

