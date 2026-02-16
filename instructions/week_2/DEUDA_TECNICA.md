# Deuda Técnica - Estado Actual del Frontend

## ⚠️ Nota Importante

Este documento contiene solo la **deuda técnica inmediata** (funcionalidades que quedaron incompletas en la entrega).

Para ver el **roadmap de mejoras, refactorización e implementaciones nuevas**, consulta [CAMBIOS_REQUERIDOS.md](CAMBIOS_REQUERIDOS.md). Ese documento (auditoría técnica con hallazgos SOLID) contiene:

- ✅ Consolidación de tipos e interfaces
- ✅ Abstracción de servicios
- ✅ Creación de contextos globales (AuthContext, CartContext)
- ✅ Hooks personalizados reutilizables
- ✅ Componentes presentacionales refactorizados
- ✅ Mejoras de arquitectura general

**Estas son mejoras arquitectónicas sugeridas. El equipo debe evaluar y decidir el orden de prioridad según su contexto.**

---

## Estado Actual del Frontend - Entrega

### Componentes Implementados

#### Módulo de Autenticación
- ✅ Vista de Login completamente funcional
- ✅ Vista de Register completamente funcional
- ✅ Datos de usuario capturados y almacenados en localStorage

**Estado actual de almacenamiento:**

Ambas operaciones (login/register) capturan la data del usuario y la **guardan en localStorage** de forma temporal. Esta capacidad está lista para usar y permite:
- Mantener sesión activa del usuario
- Acceder a los datos en cualquier componente
- Base para implementar las funcionalidades de [CAMBIOS_REQUERIDOS.md](CAMBIOS_REQUERIDOS.md) (AuthContext, useAuth hook, protección de rutas, etc.)
- Base para las sugerencias del roadmap de DEUDA_TÉCNICA.md

**⚠️ Nota importante:** El almacenamiento en localStorage es **solución temporal** mientras se implementa un método de validación robusto que dependa del backend (tokens JWT, refresh tokens, etc.). El siguiente equipo debe evaluar e implementar estas mejoras de seguridad.

**Aclaración importante sobre Register:**

Aunque el formulario de registro solicita múltiples campos al usuario, actualmente el backend solo acepta y procesa 3 campos:
```typescript
{
  email: data.email,
  password: data.password,
  name: data.name
}
```

**Función temporal: `mapToBackendRegisterFormat`**
- **Ubicación:** `src/services/auth/authApi.ts` (línea 39)
- **Descripción:** Convierte el `CreateUserDTO` (con todos los campos del formulario) al formato que actualmente acepta el backend (solo email, password, name)
- **Acción pendiente:** Eliminar esta función cuando el backend esté preparado para recibir todos los campos originales
- **Impacto:** Actualmente el frontend captura más información del usuario (teléfono, dirección, etc.) pero esta se descarta antes de enviar al backend

#### Módulo de Productos
- ✅ Vista de productos implementada
- ⚠️ **Sin pruebas formales:** No se realizó la prueba de integración con la API de productos del backend

**Problema con imágenes de productos:**
- El modelo inicial en base de datos contemplaba el campo `imagen` para productos
- El frontend está preparado para mostrar imágenes
- El backend NO definió un método de almacenamiento para imágenes

**Decisión pendiente para el próximo equipo:**

Elegir una de las siguientes opciones:
1. Guardar URLs de imágenes y almacenarlas en Firebase Storage o AWS S3
2. Conectar el sistema a estos servicios de almacenamiento directamente
3. No utilizar imágenes (requiere ajuste en el frontend para no mostrarlas)

---

## Roadmap Sugerido - Próximos Pasos

A continuación se proponen las siguientes prioridades basadas en el análisis técnico. **El equipo evalúa y decide cuál implementar primero según disponibilidad, dependencias y contexto del proyecto.**

| Prioridad | Tarea | Descripción | Complejidad |
|-----------|-------|-------------|-------------|
| 1 | Proteger ruta del carrito | Implementar guards de autenticación para la ruta `/carrito` | Media |
| 2 | Consumo del carrito desde backend | Conectar el frontend con el microservicio de carrito | Alta |
| 3 | Definir flujo del carrito de compra | **Opción A (recomendada):** Enviar órdenes de "agregar al carrito" directamente al microservicio de carrito desde el componente de producto individual.<br><br>**Opción B:** Gestionar el carrito desde el frontend usando estados locales.<br><br>*Decisión a cargo del equipo* | Alta |
| 4 | Conectar y validar microservicio de productos | Realizar pruebas formales de integración con la API de productos | Media |
| 5 | Mejoras de UI y componentes reutilizables | • Definir y crear botones reutilizables<br>• Definir y crear inputs reutilizables<br>• Mejorar diseño de cards de productos | Baja |
| 6 | Crear interfaz de administración de productos | Implementar vista para agregar productos (sin manejo de roles, solo para testing).<br><br>**Importante:** Revisar archivos `README.md` de los microservicios para conocer el formato esperado de datos | Media |

---

## 🚀 Capacidades Disponibles para el Siguiente Equipo

Con los datos de autenticación actualmente almacenados en localStorage, **ya es posible ejecutar las funcionalidades sugeridas en:**

- ✅ [CAMBIOS_REQUERIDOS.md](CAMBIOS_REQUERIDOS.md) - Refactors y nuevas funcionalidades arquitectónicas
- ✅ Roadmap de DEUDA_TÉCNICA.md - Prioridades sugeridas de desarrollo

No es necesario esperar a implementar API tokens o métodos avanzados de validación para empezar a trabajar en contextos, guards, hooks y protección de rutas. La data ya está disponible en localStorage.

---

## Notas Adicionales

- Consultar la documentación de cada microservicio (`README.md`) antes de implementar las integraciones
- El sistema actualmente no maneja roles de usuario, por lo que la interfaz de administración es de acceso libre (temporal)
- **Próxima mejora recomendada:** Implementar tokens JWT y refresh tokens para reemplazar el almacenamiento en localStorage puro
