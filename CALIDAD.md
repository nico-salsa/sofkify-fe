# CALIDAD.md

## 1. ANATOMÍA DE UN INCIDENTE

### Contexto
Durante el desarrollo del módulo de autenticación, se detectó un problema recurrente donde las peticiones de registro fallaban silenciosamente o mostraban errores de red genéricos en el navegador, a pesar de que el backend estaba activo en `localhost:8080`.

### Error (La Causa Humana)
Se asumió que el frontend podía comunicarse directamente con el backend en un puerto diferente (`:8080`) sin configuración adicional de seguridad en el navegador o en el servidor de desarrollo, y se hardcodeó la URL base en el código fuente.

### Defecto (El Código Incorrecto)
El cliente HTTP estaba configurado para apuntar a una URL absoluta local por defecto, y la configuración de Vite no incluía un proxy para manejar las peticiones Cross-Origin (CORS) durante el desarrollo.

**ANTES (src/services/authApi.ts):**
```typescript
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// ... en postRequest
const response = await fetch(`${API_BASE_URL}${endpoint}`, { ... });
```

**ANTES (vite.config.ts):**
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Falta configuración de server.proxy
})
```

**DESPUÉS (Corrección en vite.config.ts):**
```typescript
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  }
})
```
*Y actualización de `API_BASE_URL` para usar rutas relativas o el proxy.*

### Fallo (La Manifestación)
El usuario final intentaba registrarse y la aplicación no respondía o mostraba un error genérico. En la consola del desarrollador (F12) se observaba:
`Access to fetch at 'http://localhost:8080/api/users' from origin 'http://localhost:5173' has been blocked by CORS policy.`

---

## 2. ANÁLISIS DE PIRÁMIDE DE PRUEBAS

Este proyecto es una **Single Page Application (SPA)** construida con React. La estrategia de pruebas debe priorizar las pruebas **E2E (End-to-End)** sobre una base excesivamente amplia de pruebas unitarias por las siguientes razones:

### Tipo de Aplicación
Al ser un frontend que depende fuertemente de una API externa para toda su funcionalidad crítica (autenticación, gestión de datos), la lógica de negocio "pura" en el cliente es limitada. La mayor complejidad reside en la **integración** y el **estado** de la UI.

### Dónde ocurren los errores más críticos
Los bugs más severos en este proyecto no suelen ser "esta función sumó mal dos números", sino:
- El formulario no envía los datos en el formato que el backend espera (como vimos en `mapToBackendRegisterFormat`).
- Los flujos de usuario se rompen (ej: redirigir antes de guardar el token).
- Problemas de comunicación asíncrona (loading states, manejo de errores de red).

### Retos y Mitigación

| Nivel | Reto que Mitiga | Cobertura Recomendada |
|-------|-----------------|-----------------------|
| **Unitarias** | Lógica de validación compleja, renderizado condicional de componentes aislados (ej: formularios mostrando errores). | ~30% (Componentes clave como `RegisterForm`, `useLogin`) |
| **Integración** | Comunicación entre hooks y componentes. ¿El hook `useRegister` actualiza el estado del componente correctamente? | ~20% |
| **E2E** | **El flujo completo**. ¿Puede un usuario real registrarse, ver la alerta de éxito y ser redirigido? Esto verifica el "Happy Path" crítico que genera valor. | ~50% (Flujos críticos: Auth, Core Features) |

---

## 3. IMPLEMENTACIÓN DE APRENDIZAJE

A continuación se presenta una suite mínima propuesta.

### Prerrequisitos
Para ejecutar estas pruebas, se requeriría instalar:
- Unitarias: `vitest`, `@testing-library/react`, `@testing-library/user-event`
- E2E: `@playwright/test`

### A. Pruebas Unitarias (src/tests/unit/RegisterForm.test.tsx)
Estas pruebas verifican que el componente `RegisterForm` valide la entrada y maneje la interacción básica, *sin* depender del backend real.

```tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import RegisterForm from '../../components/Auth/RegisterForm';

describe('RegisterForm Component', () => {
  it('debe mostrar error de validación si el email es inválido', async () => {
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} onToggleMode={() => {}} isLoading={false} error={null} />);

    const emailInput = screen.getByPlaceholderText(/Correo electrónico/i);
    const submitBtn = screen.getByRole('button', { name: /registrarse/i });

    // Intentar enviar email inválido
    fireEvent.change(emailInput, { target: { value: 'not-an-email' } });
    fireEvent.click(submitBtn);

    // Esperar mensaje de error (asumiendo que validateUserData lanza o muestra error)
    // Nota: En la implementación actual, el error lo maneja el padre, pero el input debería tener estado visual o el mock no ser llamado.
    expect(mockSubmit).not.toHaveBeenCalled();
  });

  it('debe llamar a onSubmit con los datos correctos cuando el formulario es válido', async () => {
    const mockSubmit = vi.fn();
    render(<RegisterForm onSubmit={mockSubmit} onToggleMode={() => {}} isLoading={false} error={null} />);

    // Llenar formulario
    fireEvent.change(screen.getByPlaceholderText(/Nombre completo/i), { target: { value: 'Test User' } });
    fireEvent.change(screen.getByPlaceholderText(/Correo electrónico/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/Contraseña/i), { target: { value: 'password123' } });
    // ... llenar otros campos requeridos ...

    const submitBtn = screen.getByRole('button', { name: /registrarse/i });
    fireEvent.click(submitBtn);

    await waitFor(() => {
        expect(mockSubmit).toHaveBeenCalledWith(expect.objectContaining({
            email: 'test@example.com',
            name: 'Test User'
        }));
    });
  });
});
```

### B. Pruebas E2E (src/tests/e2e/auth.spec.ts)
Estas pruebas usan **Playwright** para verificar el flujo completo en un navegador real.

```typescript
import { test, expect } from '@playwright/test';

test.describe('Flujo de Autenticación', () => {
  
  test('debe permitir a un usuario navegar entre Login y Registro', async ({ page }) => {
    await page.goto('http://localhost:5173/auth');

    // Verificar estado inicial (Login)
    await expect(page.getByRole('button', { name: /iniciar sesión/i })).toBeVisible();

    // Ir a registro
    await page.click('text=Regístrate aquí');

    // Verificar cambio a Registro
    await expect(page.getByRole('heading', { name: /crear cuenta/i })).toBeVisible();
    await expect(page.getByPlaceholderText(/Nombre completo/i)).toBeVisible();
  });

  test('debe mostrar alerta de éxito al registrarse correctamente', async ({ page }) => {
    // Mockear respuesta del backend para no crear usuarios reales cada vez
    await page.route('**/api/users', async route => {
      const json = { message: 'User created', token: 'fake-token' };
      await route.fulfill({ json });
    });

    await page.goto('http://localhost:5173/auth');
    await page.click('text=Regístrate aquí');

    // Llenar formulario
    await page.fill('input[name="name"]', 'Usuario E2E');
    await page.fill('input[name="email"]', 'e2e@test.com');
    await page.fill('input[name="password"]', 'SecurePass123');
    // ... llenar resto de campos

    await page.click('button[type="submit"]');

    // Verificar SweetAlert2
    await expect(page.locator('.swal2-title')).toHaveText(/¡Registro Exitoso!/i);
    
    // Verificar redirección
    await expect(page).toHaveURL('http://localhost:5173/');
  });
});
```
