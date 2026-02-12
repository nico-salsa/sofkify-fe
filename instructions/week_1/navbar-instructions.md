Historia de Usuario: Header de Navegación
Como usuario del ecommerce (Cliente o Administrador)
Quiero ver un encabezado de navegación responsivo
Para identificar la marca, acceder a mi carrito y gestionar mi sesión desde cualquier dispositivo

Contexto del Negocio
El sistema tiene dos tipos de usuarios: Clientes y Administradores
Los clientes necesitan acceso rápido al carrito para gestionar sus compras
Ambos tipos de usuarios requieren autenticación
El header debe adaptarse al estado de autenticación del usuario (logueado / no logueado)
Criterios de Aceptación
Funcionales

Se muestra "Sofkify" como nombre de la empresa (alineado a la izquierda)


Icono de carrito visible para clientes (muestra cantidad de items)


Icono de usuario para iniciar sesión / acceder al perfil


Los elementos son interactivos y redirigen correctamente


Icono de usuario para iniciar sesión / acceder al perfil


Icono de sesión con comportamiento dinámico según autenticación:


Usuario NO logueado:
Se muestra icono de login
Redirige a la pantalla de inicio de sesión

Usuario logueado:
Se muestra icono de logout (apagar)
Permite cerrar sesión (sign out)
No Funcionales

Diseño responsive en:

Mobile (320px - 768px): layout vertical o menú hamburguesa

Tablet (768px - 1024px): layout horizontal compacto

Desktop (1024px+): layout horizontal completo

Implementación Mobile First

Usa únicamente clases de Tailwind CSS (sin CSS custom)
Criterios Técnicos
Estructura
src/
├── components/
│   └── layout/
│       ├── Header.tsx
│       └── Header.types.ts
Implementación
Componente funcional con TypeScript
Props tipadas para configuración futura
Iconos de lucide-react o heroicons
Breakpoints de Tailwind: sm:, md:, lg:
Clases organizadas: layout → spacing → sizing → colors
Testing

Renderiza correctamente en diferentes viewports

Los clicks navegan correctamente

Accesibilidad: ARIA labels, navegación por teclado
Definición de "Done"

Código revisado y aprobado por reviewer autorizado

Funciona en Chrome, Firefox, Safari

Sin errores en consola

Pasa tests de accesibilidad básicos

Cumple todos los criterios de aceptación

Merge solo desde rama develop
Diseño de Referencia
[Agregar link a Figma o imagen si existe]

Notas Técnicas
Este componente será reutilizado en todas las páginas
En futuras iteraciones mostrará el estado del carrito (cantidad de items)
El header debe ser parte del Layout principal