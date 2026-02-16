## Historia de Usuario: Página de Autenticación (Login/Register)

**Como** usuario nuevo o existente del ecommerce
**Quiero** poder iniciar sesión o registrarme en la misma página con transición visual
**Para** acceder a mi cuenta de forma intuitiva sin cambiar de página

### Contexto del Negocio
- Esta es la página unificada de autenticación que maneja tanto login como registro
- Existen dos tipos de usuarios: Clientes y Administradores
- Los usuarios pueden alternar entre login y registro sin cambiar de ruta
- La imagen decorativa se anima cambiando de lado para indicar el modo activo
- Después de un login/registro exitoso, el usuario es redirigido al Home (/)

---

### Criterios de Aceptación

#### Funcionales - Modo Login
El formulario de login debe contener:
- [ ] Campo **Email** (tipo email, requerido)
- [ ] Campo **Contraseña** (tipo password, requerido)
- [ ] Botón **"Ingresa a tu cuenta"**
- [ ] Link **"¿Aún no tienes cuenta? Regístrate"** que cambia a modo registro

#### Funcionales - Modo Register
El formulario de registro debe contener:
- [ ] Campo **Nombre** (tipo text, requerido)
- [ ] Campo **Apellido** (tipo text, requerido)
- [ ] Campo **Email** (tipo email, requerido)
- [ ] Campo **Contraseña** (tipo password, requerido)
- [ ] Campo **Dirección** (tipo text, requerido)
- [ ] Campo **Teléfono** (tipo number, requerido)
- [ ] Botón **"Crear cuenta"**
- [ ] Link **"¿Ya tienes cuenta? Inicia sesión"** que cambia a modo login

#### Funcionales - Comportamiento
- [ ] Al hacer click en "Regístrate": 
  - La imagen se mueve de izquierda a derecha (desktop/tablet)
  - Se muestra el formulario de registro
  - Transición suave animada
  
- [ ] Al hacer click en "Inicia sesión":
  - La imagen se mueve de derecha a izquierda (desktop/tablet)
  - Se muestra el formulario de login
  - Transición suave animada

- [ ] **Login exitoso**: redirige a `/`
- [ ] **Registro exitoso**: redirige a `/` (auto-login)
- [ ] **Login/Registro fallido**: muestra mensaje de error del backend
- [ ] Validación básica: campos no pueden estar vacíos
- [ ] Validación de formato de email
- [ ] Muestra estado de loading mientras se procesa

#### No Funcionales - Responsive

- [ ] **Mobile (320px - 768px)**: 
  - Solo se muestra el formulario activo (login o registro)
  - NO se muestra la imagen decorativa
  - Layout vertical centrado
  - Campos ocupan ancho completo
  - Link de cambio de modo visible debajo del botón
  - 
  
- [ ] **Tablet (768px - 1024px)**: 
  - Imagen decorativa visible
  - Animación de cambio de lado funcional
  - Layout de dos columnas ajustado
  
- [ ] **Desktop (1024px+)**: 
  - Imagen decorativa a la izquierda en modo login
  - Imagen decorativa a la derecha en modo registro
  - Formulario ocupa el lado opuesto a la imagen
  - Transición suave con animación de deslizamiento

#### No Funcionales - Diseño
- [ ] Implementación **Mobile First**
- [ ] Estilo consistente en ambos modos:
  - Fondo naranja crema #ffdb66
  - Títulos claros: "Bienvenido nuevamente" (login) / "Bienvenido" (registro)
  - Subtítulos en naranja
  - Inputs con fondo blanco y borde redondeado
  - Botón naranja con texto blanco
  - Links de cambio de modo en texto naranja y subrayado
- [ ] Transiciones suaves en:
  - Cambio entre modos (300-500ms)
  - Inputs y botones
  - Hover states

---

### Criterios Técnicos

#### Estructura de Componentes
```
src/
├── components/
│   └── Auth/                         # NEW
│       ├── LoginForm.tsx             # Formulario de login
│       ├── RegisterForm.tsx          # Formulario de registro
│       ├── AuthImage.tsx             # Imagen decorativa animada
│       ├── Auth.types.ts             # Tipos compartidos
│       └── data.ts                   # Configuración compartida
├── pages/
    └── Auth/
        └── Auth.tsx                  # Página de autenticación

```

#### Tipos TypeScript
```typescript
interface User {
  name: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: number;
}

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData {
  name: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  phone: number;
}

type AuthMode = 'login' | 'register';

interface AuthPageProps {
  initialMode?: AuthMode;
}
```

#### Implementación Técnica
- [ ] Usar `useState` para manejar el modo activo ('login' | 'register')
- [ ] Props completamente tipadas
- [ ] Componentes separados para LoginForm y RegisterForm
- [ ] Componente AuthImage con prop `position: 'left' | 'right'`
- [ ] Manejo de estados: loading, error, success
- [ ] Validaciones:
  - Email válido
  - Campos no vacíos
  - Teléfono solo números
- [ ] Animación con Tailwind transitions y transforms
- [ ] Redirección con React Router después del éxito

#### Ejemplo de Lógica de Animación
```typescript
const [mode, setMode] = useState<AuthMode>('login');

// En el JSX:
<div className={`transition-all duration-500 ${mode === 'login' ? 'order-first' : 'order-last'}`}>
  <AuthImage />
</div>
```

---

### Estados de la UI

#### Loading State
```
[Botón deshabilitado mostrando "Cargando..."]
[Formulario deshabilitado]
```

#### Error State
```
⚠️ [Mensaje de error del backend]
Ejemplos: 
- "Correo o contraseña incorrectos"
- "El correo ya está registrado"
- "Error en el servidor"
```

#### Success State
```
✓ [Login/Registro] exitoso
[Redirige automáticamente a /]
```

---

### Testing

#### Tests Unitarios
- [ ] `AuthPage` cambia de modo correctamente
- [ ] `LoginForm` renderiza todos los campos
- [ ] `RegisterForm` renderiza todos los campos
- [ ] Validaciones funcionan en ambos formularios
- [ ] Click en links de cambio de modo funciona
- [ ] Mensaje de error se muestra correctamente

#### Tests de Integración
- [ ] Login exitoso redirige a `/`
- [ ] Registro exitoso redirige a `/`
- [ ] Login fallido muestra mensaje de error
- [ ] Registro fallido muestra mensaje de error
- [ ] Cambio entre modos mantiene el estado limpio (no hay datos residuales)
- [ ] Animación de transición se ejecuta

#### Tests de Accesibilidad
- [ ] Todos los inputs tienen labels claros
- [ ] Navegación por teclado funciona en ambos formularios
- [ ] Links son accesibles por teclado
- [ ] Botones tienen estado disabled visible

---

### Definición de "Done"

- [ ] Código revisado y aprobado por reviewer autorizado
- [ ] Funciona correctamente en Chrome, Firefox, Safari
- [ ] Sin errores ni warnings en consola
- [ ] Tests unitarios escritos y pasando
- [ ] Responsive en mobile, tablet y desktop verificado
- [ ] Animación fluida en desktop/tablet
- [ ] Ambos modos (login/register) funcionan correctamente
- [ ] Cumple todos los criterios de aceptación funcionales y técnicos
- [ ] Merge realizado solo desde rama `feature/xxx` hacia `develop`
- [ ] Documentación actualizada si aplica

---

### Diseño de Referencia

**Modo Login (Desktop/Tablet):**
```
┌─────────────────┬─────────────────┐
│                 │  Bienvenido     │
│                 │  nuevamente     │
│    Imagen       │                 │
│   Decorativa    │  [Email]        │
│    (Izquierda)  │  [Contraseña]   │
│                 │  [Ingresar]     │
│                 │                 │
│                 │  ¿No tienes     │
│                 │  cuenta?        │
│                 │  Regístrate     │
└─────────────────┴─────────────────┘
```

**Modo Register (Desktop/Tablet):**
```
┌─────────────────┬─────────────────┐
│  Bienvenido     │                 │
│                 │                 │
│  [Nombre]       │    Imagen       │
│  [Apellido]     │   Decorativa    │
│  [Email]        │   (Derecha)     │
│  [Contraseña]   │                 │
│  [Dirección]    │                 │
│  [Teléfono]     │                 │
│  [Crear cuenta] │                 │
│                 │                 │
│  ¿Ya tienes     │                 │
│  cuenta?        │                 │
│  Inicia sesión  │                 │
└─────────────────┴─────────────────┘
```

**Mobile:**
```
┌─────────────────┐
│  Formulario     │
│  Activo         │
│  (Login o       │
│  Register)      │
│                 │
│  [Campos]       │
│  [Botón]        │
│  [Link cambio]  │
└─────────────────┘
```
**Imagen de referencia

<img width="1205" height="846" alt="Image" src="https://github.com/user-attachments/assets/26210839-d0a6-4b35-a267-05ecedb4a249" />

**Características visuales clave:**
- Imagen decorativa ocupa 50% (solo desktop/tablet)
- Formulario ocupa 50% con fondo naranja crema
- Título "Bienvenido nuevamente" en negro (login) / "Bienvenido" (registro)
- Subtítulo en naranja
- Campos con placeholders descriptivos
- Botón naranja con texto centrado
- Links de cambio visibles y claros

---

### Dependencias

- [ ] Configuración de React Router para navegación
- [ ] Endpoint de API `/api/auth/login` disponible
- [ ] Endpoint de API `/api/auth/register` disponible
- [ ] No tendrá autorización por token en la primera versión

---

### Acceptance Criteria Checklist (para QA)

**Visual:**
- [ ] Diseño coincide con referencia en mobile (sin imagen)
- [ ] Diseño coincide con referencia en desktop
- [ ] Animación de cambio de lado es suave y fluida
- [ ] La imagen se posiciona correctamente según el modo
- [ ] Los colores siguen la paleta naranja crema
- [ ] Links de cambio de modo son visibles y claros
- [ ] La imagen decorativa se oculta en mobile

**Funcional:**
- [ ] Login exitoso redirige a `/`
- [ ] Registro exitoso redirige a `/`
- [ ] Login fallido muestra mensaje de error
- [ ] Registro fallido muestra mensaje de error
- [ ] Cambio entre modos funciona correctamente
- [ ] Validaciones de campos funcionan en ambos modos
- [ ] Email inválido muestra error
- [ ] Campos vacíos no permiten submit
- [ ] Loading state se muestra correctamente

**Técnico:**
- [ ] No hay errores en consola
- [ ] Los datos se envían al backend
- [ ] La animación no causa problemas de rendimiento
- [ ] Estado se limpia al cambiar de modo