# Resumen Arquitectónico

Este repositorio implementa el frontend de Sofkify usando React, TypeScript, Vite y Tailwind. La aplicación consume los microservicios del backend de Sofkify y está organizada de forma modular por funcionalidades y UI:

- **pages**: vistas principales de la aplicación.
- **components**: componentes reutilizables de UI.
- **hooks**: lógica reutilizable de React.
- **services**: integración y lógica de negocio relacionada con APIs.
- **types**: definiciones estrictas de tipos y DTOs.

El frontend se comunica con el backend a través de servicios, respetando los contratos de datos y reglas de negocio definidas en el backend. La configuración de la URL base de la API es dinámica y proviene de variables de entorno.

---

# Guía de Estilo y Reglas de Negocio

## Estilo y Estructura
- Usa TypeScript de forma estricta, evita `any` salvo que sea imprescindible.
- Toda la lógica de negocio y API debe estar en `services`, no en componentes.
- La lógica de UI reutilizable debe ir en `hooks`.
- Componentes pequeños, enfocados y con tipado explícito de props.
- Nombres consistentes y descriptivos.

## Reglas de Integración y Contratos
- La URL base de la API debe venir de `import.meta.env.VITE_API_BASE_URL`.
- No hardcodear URLs en componentes.
- No generar ni modificar campos gestionados por el backend (`id`, `status`, `createdAt`, `updatedAt`).
- Solo enviar campos proporcionados por el usuario en payloads de creación/actualización.
- El mapeo DTO <-> dominio debe ser explícito en el service layer.

## Reglas de Negocio en UI
- Validar en UI: precio de producto > 0, stock >= 0, cantidades positivas en carrito.
- No implementar flujos de pago/envío salvo que se solicite.

## Calidad y Buenas Prácticas
- Mantén las reglas de linting existentes.
- Controla efectos secundarios con `useEffect` y dependencias claras.
- Maneja estados asíncronos explícitamente (loading, success, error).
- Añade o actualiza tests al cambiar comportamiento en hooks/services/componentes.

---
