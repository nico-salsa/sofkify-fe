## Historia de Usuario: Página de Detalle de Producto

**Como** cliente del ecommerce
**Quiero** ver toda la información detallada de un producto específico
**Para** conocer sus características y poder agregarlo a mi carrito de compras

### Contexto del Negocio
- Esta página muestra la información completa de un producto individual
- El usuario llega aquí desde el catálogo (Home) al hacer click en "Ver detalles"
- Desde aquí el cliente puede agregar el producto al carrito o realizar la compra directamente
- La información del producto viene desde el backend según el ID en la URL
- Esta vista es parte del flujo: Catálogo → **Detalle** → Carrito → Orden
- Solo se pueden agregar al carrito productos activos con stock disponible

---

### Criterios de Aceptación

#### Funcionales - Información del Producto
La página debe mostrar:
- [ ] **Imagen** del producto (grande y prominente, lado izquierdo en desktop)
- [ ] **Nombre** del producto
- [ ] **Precio** del producto formateado con puntos (ej: $ 100.000)
- [ ] **Descripción** completa del producto
- [ ] **Botón "Agregar al carrito"** (con borde, estilo outline)
- [ ] **Botón "Realizar compra"** (naranja/negro, relleno sólido)

#### Funcionales - Comportamiento
- [ ] Los datos se obtienen desde el backend (GET `/api/products/:id`)
- [ ] Al hacer click en **"Agregar al carrito"**:
  - Envía petición al backend (POST `/api/cart`)
  - Muestra confirmación visual
  - NO redirige, el usuario puede seguir navegando
- [ ] Al hacer click en **"Realizar compra"**:
  - Agrega el producto al carrito
  - Redirige directamente a la página del carrito (`/cart`)
- [ ] Muestra estado de loading mientras carga el producto
- [ ] Muestra estado de error si el producto no existe o falla la petición
- [ ] Validación: no se puede agregar al carrito si no hay stock

#### No Funcionales - Responsive
- [ ] **Mobile (320px - 768px)**: 
  - Layout vertical
  - Imagen arriba (ancho completo)
  - Información del producto debajo
  - Botones apilados verticalmente
  
- [ ] **Tablet (768px - 1024px)**: 
  - Similar a desktop pero ajustado
  - Imagen y contenido lado a lado
  
- [ ] **Desktop (1024px+)**: 
  - Imagen del producto a la izquierda (~50% del ancho)
  - Información del producto a la derecha (~50% del ancho)
  - Diseño dividido en dos columnas

#### No Funcionales - Diseño
- [ ] Implementación **Mobile First**
- [ ] Estilo profesional inspirado en la imagen de referencia:
  - Fondo degradado o sólido para la imagen del producto
  - Información con fondo blanco o naranja crema muy claro
  - Título del producto: texto grande y destacado
  - Precio: grande y visible con formato de puntos
  - Descripción: texto legible y bien espaciado
  - Botón "Agregar al carrito": borde negro/gris, fondo blanco, texto negro
  - Botón "Realizar compra": fondo naranja oscuro/negro, texto blanco
- [ ] Transiciones suaves en botones
- [ ] Diseño limpio y profesional

---

### Criterios Técnicos

#### Estructura de Componentes
```
src/
├── components/
│   └── features/
│       └── product/
│           ├── ProductDetail.tsx
│           ├── ProductImage.tsx
│           ├── ProductInfo.tsx
│           └── ProductDetail.types.ts
├── pages/
│   └── ProductDetail.tsx
├── services/
│   ├── productService.ts
│   └── cartService.ts
└── types/
    └── product.types.ts
```

#### Tipos TypeScript
```typescript
interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  stock: number;
  isActive: boolean;
}

interface ProductDetailProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onBuyNow: (productId: string) => void;
  isAddingToCart: boolean;
}

interface AddToCartRequest {
  productId: string;
  quantity: number;
}
```

#### Implementación Técnica
- [ ] Usar `useParams` de React Router para obtener el ID del producto desde la URL
- [ ] Props completamente tipadas
- [ ] Fetch del producto desde API usando React Query o SWR
- [ ] Manejo de estados: loading, error, success
- [ ] Función `addToCart` que envía POST al backend
- [ ] Función `buyNow` que agrega al carrito y redirige
- [ ] Formateo de precio con puntos usando utilidad `formatCurrency()`
- [ ] Validación de stock antes de agregar al carrito
- [ ] Feedback visual al agregar al carrito (toast/mensaje de éxito)

---

### Estados de la UI

#### Loading State
```
Cargando producto...
[Skeleton del producto]
```

#### Error State
```
⚠️
No pudimos cargar este producto
[Botón: Volver al catálogo]
```

#### Success State (Producto cargado)
```
┌──────────────────────────────────────────┐
│  ┌─────────────┐  Producto 1             │
│  │             │                          │
│  │   Imagen    │  $ 100.000              │
│  │   Grande    │                          │
│  │             │  Descripción completa    │
│  │             │  del producto con todos  │
│  └─────────────┘  los detalles...        │
│                                           │
│                   [Agregar al carrito]    │
│                   [Realizar compra]       │
└──────────────────────────────────────────┘
```

#### Feedback al Agregar
```
✓ Producto agregado al carrito
```

---

### Testing

#### Tests Unitarios
- [ ] `ProductDetail` renderiza correctamente toda la información
- [ ] Precio se formatea con puntos correctamente
- [ ] Botones llaman a los handlers correctos
- [ ] Validación de stock funciona
- [ ] Mensaje de éxito se muestra al agregar al carrito

#### Tests de Integración
- [ ] Carga el producto correcto según el ID de la URL
- [ ] "Agregar al carrito" envía petición correcta al backend
- [ ] "Realizar compra" agrega al carrito y redirige a `/cart`
- [ ] Manejo correcto de producto no encontrado (404)
- [ ] Manejo correcto de errores del servidor

#### Tests de Accesibilidad
- [ ] Imagen tiene `alt` descriptivo
- [ ] Botones tienen labels claros
- [ ] Navegación por teclado funciona
- [ ] Información del producto es legible

---

### Definición de "Done"

- [ ] Código revisado y aprobado por reviewer autorizado
- [ ] Funciona correctamente en Chrome, Firefox, Safari
- [ ] Sin errores ni warnings en consola
- [ ] Tests unitarios escritos y pasando
- [ ] Responsive en mobile, tablet y desktop verificado
- [ ] Cumple todos los criterios de aceptación funcionales y técnicos
- [ ] Merge realizado solo desde rama `feature/xxx` hacia `develop`
- [ ] Documentación actualizada si aplica

---

### Diseño de Referencia

![Referencia de diseño](imagen_adjunta)

**Layout Desktop:**
```
┌─────────────────┬─────────────────────────┐
│                 │  Producto 1             │
│                 │                         │
│     Imagen      │  $ 100.000              │
│     Grande      │                         │
│   (Fondo con    │  Descripción completa   │
│   degradado)    │  del producto con       │
│                 │  todos los detalles     │
│                 │  y características...   │
│                 │                         │
│                 │  ┌──────────────────┐   │
│                 │  │ Agregar al       │   │
│                 │  │ carrito          │   │
│                 │  └──────────────────┘   │
│                 │  ┌──────────────────┐   │
│                 │  │ Realizar compra  │   │
│                 │  └──────────────────┘   │
└─────────────────┴─────────────────────────┘
```

**Layout Mobile:**
```
┌─────────────────────────┐
│                         │
│       Imagen            │
│       Grande            │
│                         │
├─────────────────────────┤
│  Producto 1             │
│                         │
│  $ 100.000              │
│                         │
│  Descripción completa   │
│  del producto...        │
│                         │
│  [Agregar al carrito]   │
│  [Realizar compra]      │
└─────────────────────────┘
```
** Guía de visual de ejemplo 

<img width="1013" height="603" alt="Image" src="https://github.com/user-attachments/assets/2e8d55bd-9d5b-437c-8655-4d9af69e3a6e" />

**Características visuales clave:**
- Imagen ocupa ~50% en desktop (lado izquierdo)
- Fondo degradado o color sólido en la sección de la imagen
- Información del producto con fondo claro
- Nombre del producto: texto grande y destacado (2xl o 3xl)
- Precio: grande y prominente con formato de puntos
- Descripción: párrafo legible con buen line-height
- Botón "Agregar al carrito": outline/borde, fondo blanco, texto negro
- Botón "Realizar compra": fondo naranja oscuro/negro, texto blanco
- Ambos botones con ancho completo en mobile, lado a lado o apilados en desktop
- Espaciado generoso entre elementos

---

### Dependencias

- [ ] Configuración de React Router para navegación
- [ ] Endpoint de API `GET /api/products/:id` disponible
- [ ] Endpoint de API `POST /api/cart` disponible
- [ ] Header component implementado
- [ ] Utilidad `formatCurrency()` para formatear precios

---

### Acceptance Criteria Checklist (para QA)

**Visual:**
- [ ] El diseño coincide con la referencia en mobile
- [ ] El diseño coincide con la referencia en desktop
- [ ] La imagen se ve grande y prominente
- [ ] El precio está formateado con puntos
- [ ] Los botones tienen estilos diferenciados
- [ ] El diseño es profesional y limpio

**Funcional:**
- [ ] Carga el producto correcto según el ID de la URL
- [ ] "Agregar al carrito" agrega el producto sin redirigir
- [ ] "Realizar compra" agrega el producto y redirige a `/cart`
- [ ] Muestra loading state mientras carga
- [ ] Muestra error state si el producto no existe
- [ ] Muestra confirmación al agregar al carrito
- [ ] No permite agregar si no hay stock

**Técnico:**
- [ ] No hay errores en consola
- [ ] Los datos se obtienen del backend
- [ ] Las peticiones POST al carrito funcionan correctamente
- [ ] La redirección funciona correctamente