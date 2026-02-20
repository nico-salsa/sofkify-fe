# Copilot Instructions - Sofkify Frontend

## 🎯 Visión General del Proyecto

**sofkify-fe** es el frontend de la plataforma de e-commerce Sofkify, construido con **React**, **TypeScript**, **Vite** y **Tailwind CSS**. Sigue una arquitectura modular orientada a features y componentes reutilizables, integrándose con los microservicios del backend mediante APIs REST.

### Repositorio
- **Local**: `C:\Sofkify\sofkify-fe`
- **Remoto**: `https://github.com/nico-salsa/sofkify-fe.git`

---

## 🛠️ Stack Tecnológico

- **React**: 19.2.0 (biblioteca UI)
- **TypeScript**: 5.9.3 (type safety)
- **Vite**: 7.2.4 (build tool y dev server)
- **Tailwind CSS**: 4.1.18 (utility-first CSS)
- **React Router Dom**: 7.13.0 (navegación)
- **SweetAlert2**: 11.26.18 (modales y alertas)
- **ESLint**: 9.39.1 (linting)
- **OpenSpec**: Contratos de API sincronizados con backend

---

## 📐 Principios Arquitectónicos

### 1. Separación de Responsabilidades
- **Components**: UI pura, sin lógica de negocio
- **Pages**: Composición de componentes y coordinación de estado
- **Services**: Lógica de integración con APIs
- **Hooks**: Lógica reutilizable de estado y side effects
- **Types**: Definiciones de tipos compartidas

### 2. Type Safety Estricto
- **Evitar `any`** completamente
- Usar `unknown` si el tipo es realmente desconocido
- Definir interfaces explícitas para props, state y responses
- Usar utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`, `Record<K, V>`

### 3. Composición sobre Herencia
- Componentes pequeños y reutilizables
- Usar children props y composition patterns
- Preferir hooks sobre HOCs o render props

### 4. Performance First
- Lazy loading para rutas (React.lazy)
- Memoización con `useMemo` y `useCallback` cuando sea necesario
- `React.memo` para componentes que re-renderizan frecuentemente
- Optimización de imágenes (lazy loading, formatos modernos)

---

## 📂 Estructura del Proyecto

```
src/
├── App.tsx                    # Componente raíz con router
├── main.tsx                   # Punto de entrada
├── components/                # Componentes reutilizables
│   ├── AsideHeader/
│   ├── Auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── Header/
│   ├── Product/
│   ├── ProductCartItem/
│   └── BurguerButton/
├── pages/                     # Páginas de la aplicación
│   ├── HomePage.tsx
│   ├── ProductPage.tsx
│   ├── CartPage.tsx
│   └── LoginPage.tsx
├── services/                  # Lógica de integración con APIs
│   ├── auth/
│   │   ├── authApi.ts        # Llamadas HTTP de autenticación
│   │   └── authStorage.ts    # Persistencia de tokens
│   └── products/
│       └── productApi.ts     # Llamadas HTTP de productos
├── hooks/                     # Custom hooks
│   ├── useAuth.ts
│   ├── useCart.ts
│   └── useDebounce.ts
├── types/                     # Definiciones de tipos
│   ├── product.ts
│   ├── user.types.ts
│   └── cart.types.ts
└── utils/                     # Funciones auxiliares
    └── formatters.ts
```

---

## 💻 Convenciones de Código

### Nomenclatura

#### Archivos y Carpetas
- **Componentes**: PascalCase (`LoginForm.tsx`, `ProductCard.tsx`)
- **Hooks**: camelCase con prefijo "use" (`useAuth.ts`, `useCart.ts`)
- **Services**: camelCase con sufijo "Api" o "Storage" (`authApi.ts`, `authStorage.ts`)
- **Types**: camelCase con sufijo ".types" (`user.types.ts`, `cart.types.ts`)
- **Utils**: camelCase (`formatters.ts`, `validators.ts`)

#### Variables y Funciones
- **Variables**: `camelCase` (`productList`, `userId`, `isLoading`)
- **Constantes**: `UPPER_SNAKE_CASE` (`API_BASE_URL`, `MAX_RETRIES`)
- **Funciones**: `camelCase` con verbos (`fetchProducts`, `handleSubmit`, `validateEmail`)
- **Componentes**: `PascalCase` (`ProductCard`, `LoginForm`)
- **Interfaces/Types**: `PascalCase` (`Product`, `UserDTO`, `CartItem`)

#### Tipos TypeScript
```typescript
// ✅ BUENO: Interfaces para objetos
interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
}

// ✅ BUENO: Types para unions, primitivos y utilidades
type ProductStatus = 'active' | 'inactive' | 'draft';
type ProductProps = {
  product: Product;
  onAddToCart: (id: string) => void;
};

// ✅ BUENO: Separación de tipos de dominio y API
export interface Product {
  id: string;
  name: string;
  status: boolean;  // Representación interna
}

export interface ProductDTO extends Omit<Product, 'status'> {
  active: boolean;  // Representación de API
}

// ✅ BUENO: Props explícitas
interface ProductCardProps {
  product: Product;
  variant?: 'default' | 'compact';
  onAddToCart?: (productId: string) => void;
}
```

### Estructura de Componentes

#### Orden de elementos en un componente
```typescript
// 1. Imports externos
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// 2. Imports internos
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import type { Product } from '@/types/product';

// 3. Types/Interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart: (id: string) => void;
}

// 4. Component
export const ProductCard = ({ product, onAddToCart }: ProductCardProps) => {
  // 4.1 Hooks (useState, useEffect, custom hooks)
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  
  // 4.2 Derived state
  const isAvailable = product.stock > 0;
  
  // 4.3 Effects
  useEffect(() => {
    // ...
  }, [product.id]);
  
  // 4.4 Event handlers
  const handleAddToCart = () => {
    setIsLoading(true);
    onAddToCart(product.id);
  };
  
  // 4.5 Render helpers (opcional)
  const renderPrice = () => {
    return `$${product.price.toFixed(2)}`;
  };
  
  // 4.6 Return statement
  return (
    <div className="rounded-lg border p-4">
      <h3>{product.name}</h3>
      <p>{renderPrice()}</p>
      <Button onClick={handleAddToCart} disabled={!isAvailable}>
        Add to Cart
      </Button>
    </div>
  );
};
```

### Componentes React

#### Functional Components con TypeScript
```typescript
// ✅ BUENO: Componente funcional tipado
import type { FC } from 'react';

interface ProductProps {
  product: ProductDTO;
}

const Product: FC<ProductProps> = ({ product }) => {
  return (
    <Link to={`/product/${product.id}`} className="block">
      <div className="rounded-lg border border-yellow bg-gray-200 p-4">
        <img src={product.image} alt={product.name} className="h-auto w-full" />
        <h3 className="text-lg font-bold text-orange-500">{product.name}</h3>
        <p className="text-gray-600">${product.price}</p>
      </div>
    </Link>
  );
};

export default Product;

// ❌ EVITAR: Props sin tipar
const Product = ({ product }) => {  // ❌ Sin tipos
  // ...
};
```

### Custom Hooks

#### Reglas de Hooks
- Siempre empezar con prefijo `use`
- No llamar hooks condicionalmente
- Dependency arrays correctos en `useEffect`
- Extraer lógica compleja de componentes

```typescript
// ✅ BUENO: Custom hook bien estructurado
import { useState, useEffect } from 'react';

export const useDebounce = <T,>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Uso:
const searchTerm = useDebounce(inputValue, 500);
```

### Services (API Integration)

#### Estructura de un Service
```typescript
// services/products/productApi.ts
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const productApi = {
  // GET - Obtener todos los productos
  async getAll(): Promise<ProductDTO[]> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    return response.json();
  },

  // GET - Obtener un producto por ID
  async getById(id: string): Promise<ProductDTO> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products/${id}`);
    if (!response.ok) {
      throw new Error(`Product ${id} not found`);
    }
    return response.json();
  },

  // POST - Crear producto (solo Admin)
  async create(product: Omit<ProductDTO, 'id' | 'createdAt' | 'updatedAt'>): Promise<ProductDTO> {
    const response = await fetch(`${API_BASE_URL}/api/v1/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`,
      },
      body: JSON.stringify(product),
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  },
};
```

---

## 🎨 Tailwind CSS Guidelines

### Organización de Clases
- **Orden lógico**: layout → spacing → sizing → colors → typography → effects
- Usar Prettier plugin de Tailwind para auto-sort
- Mobile-first approach

```tsx
// ✅ BUENO: Clases organizadas
<div className="flex items-center justify-between rounded-lg bg-white px-4 py-2 shadow-md transition-shadow hover:shadow-lg">

// ❌ EVITAR: Clases desordenadas
<div className="shadow-md bg-white px-4 rounded-lg flex py-2 items-center hover:shadow-lg justify-between transition-shadow">
```

### Responsive Design
```tsx
// ✅ BUENO: Mobile-first
<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">

// ❌ EVITAR: Desktop-first
<div className="grid grid-cols-3 lg:grid-cols-3 md:grid-cols-2 grid-cols-1">
```

### Clases Condicionales
```typescript
import { clsx } from 'clsx';

interface ButtonProps {
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

const Button = ({ variant = 'primary', disabled }: ButtonProps) => (
  <button
    className={clsx(
      'rounded px-4 py-2 font-semibold transition-colors',
      variant === 'primary' && 'bg-blue-500 text-white hover:bg-blue-600',
      variant === 'secondary' && 'bg-gray-200 text-gray-800 hover:bg-gray-300',
      disabled && 'cursor-not-allowed opacity-50'
    )}
    disabled={disabled}
  >
    Click me
  </button>
);
```

---

## 🔄 Integración con Backend (API)

### Reglas de Contratos

#### Campos Gestionados por Backend (NUNCA enviar desde frontend)
- `id`: UUID generado por backend
- `createdAt`: Timestamp de creación
- `updatedAt`: Timestamp de última modificación
- `status`: Estado calculado por lógica de negocio

#### Request Payloads
```typescript
// ✅ BUENO: Solo enviar campos del usuario
interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  stock: number;
  // NO incluir: id, createdAt, updatedAt
}

// ❌ EVITAR: Enviar campos del backend
interface CreateProductRequest {
  id: string;           // ❌ Backend lo genera
  name: string;
  createdAt: string;    // ❌ Backend lo genera
}
```

### Manejo de Estados Asíncronos
```typescript
// ✅ BUENO: Estados explícitos
const [data, setData] = useState<Product[]>([]);
const [isLoading, setIsLoading] = useState(false);
const [error, setError] = useState<Error | null>(null);

useEffect(() => {
  const fetchProducts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const products = await productApi.getAll();
      setData(products);
    } catch (err) {
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  };

  fetchProducts();
}, []);

// Render estados
if (isLoading) return <LoadingSpinner />;
if (error) return <ErrorMessage error={error} />;
return <ProductList products={data} />;
```

### Variables de Entorno
```typescript
// ✅ BUENO: Usar variables de entorno
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ❌ EVITAR: Hardcodear URLs
const API_BASE_URL = 'http://localhost:8080';  // ❌ No hardcodear
```

---

## 📋 Reglas de Negocio (UI Validations)

### Product
- **Precio**: Debe ser > 0
- **Stock**: Debe ser >= 0
- **Solo productos con stock** pueden agregarse al carrito
- Mostrar indicador visual si stock = 0

### Cart
- **Cantidad**: Debe ser > 0
- Validar disponibilidad antes de agregar
- Actualizar subtotal automáticamente
- Un usuario solo puede tener un carrito activo

### User
- **Email**: Validar formato
- **Password**: Mínimo 8 caracteres (según backend)
- **Role por defecto**: Cliente
- Roles: Cliente, Admin

### Validaciones en Formularios
```typescript
// ✅ BUENO: Validación antes de enviar
const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  
  // Validaciones
  if (price <= 0) {
    showError('Price must be greater than 0');
    return;
  }
  
  if (stock < 0) {
    showError('Stock cannot be negative');
    return;
  }
  
  // Enviar solo si pasa validaciones
  await productApi.create({ name, description, price, stock });
};
```

---

## 🧪 Testing

### Principios
- **Unit Tests**: Hooks y funciones puras
- **Component Tests**: Componentes aislados
- **Integration Tests**: Flujos completos (login → carrito → checkout)
- Cobertura mínima: 70%

### Ejemplo de Test
```typescript
import { render, screen } from '@testing-library/react';
import { ProductCard } from './ProductCard';

test('should render product name and price', () => {
  const product = {
    id: '1',
    name: 'Test Product',
    price: 19.99,
    stock: 10,
  };

  render(<ProductCard product={product} />);

  expect(screen.getByText('Test Product')).toBeInTheDocument();
  expect(screen.getByText('$19.99')).toBeInTheDocument();
});
```

---

## 🚀 Workflow de Desarrollo

### Metodología: Desarrollo Guiado por Arquitectura con IA

1. **Planificación**: Arquitecto define historia de usuario
2. **Implementación**: IA genera componentes según especificación
3. **Validación**: Arquitecto revisa diseño y funcionalidad
4. **Ajuste**: IA refactoriza según feedback
5. **Aprobación**: Arquitecto integra al proyecto

### Fase QA
- Validar flujos funcionales
- Ejecutar tests unitarios y de integración
- Validar accesibilidad (WCAG 2.1 AA)
- Verificar responsividad en múltiples dispositivos

---

## 🚫 Antipatrones (EVITAR)

### ❌ Lógica de negocio en componentes
```typescript
// ❌ MAL: Lógica de API en componente
const ProductPage = () => {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    fetch(`${API_URL}/products/1`)  // ❌ Lógica de API aquí
      .then(res => res.json())
      .then(data => setProduct(data));
  }, []);
};

// ✅ BUENO: Lógica en service
const ProductPage = () => {
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    productApi.getById('1')  // ✅ Usar service
      .then(setProduct);
  }, []);
};
```

### ❌ Uso de `any`
```typescript
// ❌ MAL: Uso de any
const handleData = (data: any) => {  // ❌ Evitar any
  console.log(data.name);
};

// ✅ BUENO: Tipos explícitos
const handleData = (data: Product) => {  // ✅ Tipo explícito
  console.log(data.name);
};
```

### ❌ Hardcodear valores
```typescript
// ❌ MAL: Hardcodear URL
const API_URL = 'http://localhost:8080';  // ❌ No hardcodear

// ✅ BUENO: Variable de entorno
const API_URL = import.meta.env.VITE_API_BASE_URL;  // ✅ Variable de entorno
```

---

## 📚 Documentación de Referencia

### Documentos Clave
- `instructions/week_1/AI_workflow.md`: Guía de desarrollo con IA
- `instructions/week_2/CALIDAD.md`: Estándares de calidad
- `instructions/week_2/DEUDA_TECNICA.md`: Deuda técnica identificada
- `instructions/WORKSPACE_EXPLAIN_SUMMARY.md`: Resumen del workspace

### Archivos de Configuración
- `eslint.config.js`: Reglas de linting
- `tsconfig.json`: Configuración de TypeScript
- `vite.config.ts`: Configuración de Vite
- `tailwind.config.js`: Personalización de Tailwind

---

## 🎯 Cuando generes código:

1. **Types primero**: Define interfaces antes de implementar
2. **Componentes pequeños**: Una responsabilidad por componente
3. **Services para APIs**: Nunca fetch directo en componentes
4. **Hooks para lógica**: Extraer lógica reutilizable
5. **Mobile-first**: Diseñar primero para móvil
6. **Validar en UI**: Respetar reglas de negocio del backend
7. **Estados asíncronos**: Siempre manejar loading, error, success
8. **Accessibility**: Usar semantic HTML y aria labels
9. **Performance**: Lazy loading, memoization cuando sea necesario
10. **Consistency**: Seguir convenciones del proyecto existente

---

## ⚠️ Restricciones Críticas

- **NUNCA** usar `any` (usar `unknown` si es necesario)
- **NUNCA** hacer fetch directo en componentes (usar services)
- **NUNCA** hardcodear URLs de API (usar `import.meta.env`)
- **NUNCA** enviar campos gestionados por backend (`id`, `createdAt`, etc.)
- **SIEMPRE** tipar props, state y responses
- **SIEMPRE** manejar estados de loading y error
- **SIEMPRE** validar inputs antes de enviar al backend
- **SIEMPRE** usar Tailwind CSS (no inline styles)

---

## 🚫 Fuera de Alcance

- No implementar flujos de pagos o envíos a menos que se solicite explícitamente
- No cambiar rutas o comportamiento de features como parte de tareas de solo contexto
- No modificar contratos de API sin coordinación con backend

---

**Fecha de última actualización**: Febrero 2026  
**Versión**: 2.0  
**Mantenido por**: Equipo Sofkify Frontend
