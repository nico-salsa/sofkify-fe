# HU-BE-MVP-01 - Gestión de Productos (CRUD) con Integración RabbitMQ

## 1. Descripción Funcional

Como usuario administrativo,  
quiero crear, consultar, actualizar y eliminar productos,  
para administrar el catálogo del e-commerce que será consumido por los clientes desde el frontend.

Esta historia cubre únicamente la gestión backend del recurso Producto.

---

## 2. Objetivo Técnico

Implementar el CRUD completo de la entidad `Product` en el backend, exponiendo endpoints REST y publicando eventos RabbitMQ cada vez que el estado del producto cambie.

La implementación debe respetar una arquitectura por capas y permitir su futura integración asíncrona con otros componentes del sistema.

---

## 3. Definición de la Entidad Principal

Entidad: `Product`

Campos mínimos:

- id : UUID  
- name : String  
- description : String  
- price : BigDecimal  
- stock : Integer  
- active : Boolean  
- createdAt : LocalDateTime  
- updatedAt : LocalDateTime  

Notas para IA:

- Implementar borrado lógico mediante `active=false`.
- Los timestamps deben gestionarse automáticamente.
- `createdAt` no debe modificarse durante actualizaciones.

---

## 4. Endpoints REST a Implementar

| Método | Endpoint            | Responsabilidad             |
|--------|---------------------|-----------------------------|
| POST   | /api/products       | Crear un nuevo producto     |
| GET    | /api/products       | Listar productos activos    |
| GET    | /api/products/{id}  | Obtener producto por id     |
| PUT    | /api/products/{id}  | Actualizar producto         |
| DELETE | /api/products/{id}  | Eliminación lógica producto |

Restricciones para IA:

- DELETE no debe eliminar físicamente registros.
- Los GET públicos solo retornan productos con `active=true`.
- POST, PUT y DELETE requieren rol `ADMIN`.

---

## 5. Capas de Arquitectura

La implementación debe respetar las siguientes capas:

- Controller: contrato HTTP y mapeo de request/response.  
- Service: lógica de negocio y publicación de eventos RabbitMQ.  
- Repository: persistencia.  
- DTO: contratos de entrada y salida.  
- Mapper: conversión entre DTO y entidad.  
- Entity: modelo JPA del dominio.

Notas para IA:

- No incluir lógica de negocio en el controller.
- La publicación RabbitMQ no debe residir en el controller.

---

## 6. Reglas de Negocio

- El nombre del producto es obligatorio.
- El precio debe ser mayor o igual a cero.
- El stock debe ser mayor o igual a cero.
- El borrado es lógico mediante `active=false`.
- En actualización se debe preservar `createdAt`.
- Siempre se debe actualizar `updatedAt`.

---

## 7. Integración RabbitMQ

Cada operación que modifique el estado del producto debe publicar un evento.

| Operación | Nombre del Evento |
|----------|-------------------|
| CREATE   | product.created   |
| UPDATE   | product.updated   |
| DELETE   | product.deleted   |

Contenido mínimo del evento:

- productId  
- action  
- timestamp  
- datos básicos del producto  

Notas para IA:

- El publisher debe estar desacoplado del controller.
- La generación de eventos debe ser reutilizable por otros contextos del sistema.

---

## 8. Restricciones de Seguridad

- POST, PUT y DELETE requieren rol `ADMIN`.
- Los GET son públicos.
- No implementar autenticación en esta historia, se asume infraestructura previa.

---

## 9. Manejo de Errores

- Retornar 404 si el producto no existe.
- Retornar 400 ante errores de validación.
- Retornar 409 ante conflictos de negocio.
- Usar un formato JSON estándar para errores.

Notas para IA:

- No exponer excepciones internas directamente al cliente.

---

## 10. Resultado Esperado de la IA

A partir de esta historia la IA debe poder generar:

- Plan de implementación técnico.
- Estructura de paquetes y clases.
- Código backend.
- Pruebas unitarias.
- Configuración RabbitMQ relacionada.

La IA no debe introducir entidades ni funcionalidades fuera del alcance de esta historia.

---

## 11. Fuera de Alcance

- Frontend.
- Carrito.
- Orden.
- Pagos.
- Implementación de autenticación.

---

## 12. Criterios de Aceptación

- CRUD completamente funcional.
- Persistencia correcta.
- Eventos RabbitMQ publicados.
- Validaciones aplicadas.
- Arquitectura por capas respetada.
