# Contexto del Proyecto: Ecommerce Asíncrono

Este documento define el contexto funcional y conceptual del proyecto Ecommerce construido con Spring Boot, PostgreSQL, RabbitMQ y Arquitectura Hexagonal.

Su objetivo es servir como fuente de verdad para desarrolladores o sistemas automáticos (IA) que necesiten comprender qué hace el sistema, qué actores existen, cómo interactúan y cuáles son las reglas generales del negocio.

---

## Propósito del Sistema

El sistema permite la gestión y operación de un ecommerce donde existen dos tipos principales de usuarios:

* Clientes: navegan productos, gestionan carrito y generan órdenes.
* Administradores: gestionan catálogo, stock y usuarios administrativos.

El sistema está diseñado para trabajar de forma desacoplada y con procesamiento asíncrono mediante mensajería.

---

## Actores del Sistema

### Cliente

Usuario que interactúa con la tienda para realizar compras.

Responsabilidades:

* Consultar productos disponibles.
* Ver detalle de un producto.
* Agregar productos al carrito.
* Modificar cantidades del carrito.
* Confirmar carrito.
* Generar una orden.

---

### Administrador

Usuario con permisos elevados para gestionar el ecommerce.

Responsabilidades:

* Crear productos.
* Actualizar información de productos.
* Eliminar productos.
* Administrar stock.
* Crear otros administradores.
* Bloquear o desactivar productos.

---

## Conceptos Principales del Dominio

* Product: representa un artículo vendible.
* Stock: cantidad disponible de un producto.
* Cart: contenedor temporal de productos seleccionados por un cliente.
* CartItem: producto y cantidad dentro del carrito.
* Order: resultado confirmado de un carrito.
* OrderItem: producto y cantidad dentro de una orden.
* User: cliente o administrador.

---

## Funcionalidades del Cliente

### Consulta de Productos

* Obtener lista paginada de productos.
* Filtrar por categoría, precio o nombre.
* Ver detalle individual.

---

### Gestión del Carrito

* Crear carrito implícito por usuario.
* Agregar producto.
* Actualizar cantidad.
* Eliminar producto del carrito.
* Consultar estado actual del carrito.

El carrito es un estado temporal hasta ser confirmado.

---

### Confirmación del Carrito

Cuando el cliente confirma el carrito:

* Se valida stock.
* Se bloquea inventario.
* Se crea una orden.
* Se publica un evento de orden creada.
* El proceso puede ser asíncrono.

La respuesta HTTP puede ser aceptada sin esperar todo el flujo.

---

## Funcionalidades del Administrador

### Gestión de Productos

* Crear producto.
* Actualizar datos (nombre, precio, descripción).
* Eliminar producto.
* Activar o desactivar producto.

---

### Gestión de Stock

* Incrementar stock.
* Reducir stock.
* Consultar inventario.

---

### Gestión de Administradores

* Crear usuarios administradores.
* Asignar roles.
* Bloquear administradores.

---

## Modelo Asíncrono del Sistema

El sistema utiliza mensajería para desacoplar procesos:

* La creación de órdenes genera eventos.
* La actualización de stock se ejecuta por mensajes.
* Las notificaciones se procesan fuera del request HTTP.

No todo el flujo ocurre dentro del ciclo solicitud-respuesta.

---

## Consistencia del Sistema

El sistema trabaja con consistencia eventual en procesos distribuidos:

* El carrito se confirma.
* Se genera la orden.
* El stock se ajusta de forma asíncrona.

Esto permite escalabilidad y tolerancia a fallos.

---

## Reglas Generales del Negocio

* No se puede confirmar carrito sin stock.
* No se pueden vender productos inactivos.
* El stock no puede ser negativo.
* Solo administradores gestionan catálogo.
* El cliente no modifica órdenes ya creadas.

---

## Integración con Arquitectura Hexagonal

Este contexto se implementa respetando:

* Domain: reglas del ecommerce.
* Application: casos de uso.
* Ports: contratos.
* Adapters: REST, JPA, RabbitMQ.

La lógica no vive en controladores.

---

## Uso como Contexto para IA

Cualquier generación de código debe asumir:

* Existen roles cliente y administrador.
* El carrito es previo a la orden.
* La orden es resultado del carrito.
* El stock se controla.
* Los procesos son asíncronos.

Este documento define qué hace el sistema, no cómo está implementado técnicamente.

---

## Alcance Inicial

El MVP incluye:

* Catálogo de productos.
* Carrito.
* Órdenes.
* Gestión básica de administradores.

Escalabilidad futura:

* Pagos.
* Envíos.
* Notificaciones.
* Facturación.

---

Este archivo define el contexto funcional del ecommerce y debe mantenerse alineado con la evolución del proyecto.
