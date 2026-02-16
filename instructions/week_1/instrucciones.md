# Arquitectura Hexagonal (Ports & Adapters)

Este documento define la arquitectura, diseño y buenas prácticas del proyecto basado en Spring Boot, PostgreSQL y RabbitMQ utilizando Arquitectura Hexagonal.

El objetivo es que este archivo sirva como contexto técnico para cualquier desarrollador o sistema automático (IA) que deba entender cómo está organizado el proyecto, cómo se comunican las capas y qué reglas deben respetarse.

---

## Objetivo del Diseño

Diseñar una API REST asíncrona desacoplada de frameworks donde:

* El dominio no depende de Spring ni de infraestructura.
* La lógica de negocio es independiente.
* La infraestructura es intercambiable.
* REST, JPA y RabbitMQ actúan como adaptadores.
* El sistema es testeable y mantenible.

---

## Principios Arquitectónicos

* Inversión de dependencias.
* Separación de responsabilidades.
* Dominio limpio.
* Framework como detalle.
* Alta cohesión y bajo acoplamiento.

Regla principal:

El core del negocio nunca conoce Spring, JPA, HTTP, RabbitMQ ni detalles técnicos.

---

## Estructura General del Proyecto

```
│
├── application
│   ├── service
│   └── port
│       ├── in
│       └── out
│
├── domain
│   ├── model
│   └── exception
│
├── infrastructure
│   ├── adapter
│   │   ├── in
│   │   │   ├── rest
│   │   │   └── messaging
│   │   └── out
│   │       ├── persistence
│   │       └── messaging
│   └── config
│
└── Application.java
```

---

## Capa Domain (Core)

Contiene las reglas de negocio puras.

Responsabilidades:

* Entidades del dominio.
* Validaciones de negocio.
* Comportamiento propio del modelo.
* Excepciones de dominio.

Restricciones:

* No usar Spring.
* No usar JPA.
* No usar anotaciones HTTP.
* No depender de infraestructura.

El dominio solo entiende conceptos del negocio, por ejemplo: Account, Transfer, Balance.

---

## Capa Ports

Los puertos definen contratos entre el core y el exterior.

### Port In (Casos de uso)

Definen lo que el sistema puede hacer.

Responsabilidades:

* Exponer operaciones del negocio.
* Ser consumidos por adapters de entrada.

Ejemplos conceptuales:

* createUser
* transferMoney
* registerPayment

---

### Port Out (Dependencias externas)

Definen lo que el core necesita del exterior.

Responsabilidades:

* Persistencia.
* Mensajería.
* Integraciones externas.

Ejemplos:

* Repository
* EventPublisher
* ExternalServiceClient

---

## Capa Application

Implementa los casos de uso.

Responsabilidades:

* Orquestar entidades del dominio.
* Ejecutar reglas de negocio.
* Coordinar puertos.

Restricciones:

* No lógica HTTP.
* No SQL.
* No RabbitMQ directo.

Esta capa depende solo de Domain y Ports.

---

## Adapters In

Transforman el mundo exterior hacia el dominio.

### REST Adapter

Responsabilidades:

* Recibir solicitudes HTTP.
* Convertir DTO a modelos de dominio.
* Llamar a Port In.

No debe contener lógica de negocio.

---

### Messaging Adapter (RabbitMQ In)

Responsabilidades:

* Consumir mensajes.
* Traducir eventos a casos de uso.
* Ejecutar Port In.

---

## Adapters Out

Conectan el dominio con infraestructura.

### Persistence Adapter

Responsabilidades:

* Implementar Port Out.
* Usar JPA.
* Mapear Entity a Domain y viceversa.

---

### Messaging Adapter (RabbitMQ Out)

Responsabilidades:

* Implementar publicadores de eventos.
* Enviar mensajes a exchanges.

---

## Flujo del Sistema

```
Request HTTP o Evento
        ↓
Adapter In
        ↓
Port In
        ↓
Application Service
        ↓
Domain
        ↓
Port Out
        ↓
Adapter Out
```

---

## Testing

Estrategia:

* Tests unitarios en Domain y Application.
* Uso de mocks sobre Ports.
* No levantar Spring para probar reglas de negocio.

Pirámide:

* Unitarios: Dominio y servicios de aplicación.
* Integración: JPA y RabbitMQ.
* End-to-End: REST.

---

## Buenas Prácticas

* Usar DTOs.
* Separar mappers.
* Transacciones en la capa Application.
* Validaciones con Bean Validation.
* Publicar eventos de dominio.
* Manejo centralizado de errores.

---

## Convenciones de Dependencia

Reglas:

* Domain no depende de nada.
* Application depende de Domain.
* Infrastructure depende de todo.

Dirección válida:

```
Infrastructure → Application → Domain
```

Dirección prohibida:

```
Domain → Infrastructure
```

---

## RabbitMQ en Arquitectura Hexagonal

RabbitMQ actúa como:

* Adapter In: consumidores.
* Adapter Out: publicadores.

Nunca se usa RabbitMQ directamente dentro del dominio ni la aplicación.

---

## Uso como Contexto para IA

Este documento define cómo debe entenderse el proyecto:

* La lógica vive en Domain y Application.
* Los adapters solo traducen.
* Los puertos son contratos.
* La infraestructura es intercambiable.

Cualquier generación de código debe respetar estas reglas.

---

## Checklist de Arquitectura

* El dominio no depende de Spring.
* Los controllers llaman a Port In.
* Los repositories son adapters.
* RabbitMQ está fuera del core.
* La lógica no vive en controllers.

---

---

## Esquemas de Datos & Integración con API

### Responsabilidades Backend vs Frontend

**IMPORTANTE**: El frontend NUNCA genera IDs, fechas ni estados. Estos son SIEMPRE generados y gestionados por el backend.

**Responsabilidades del Frontend:**
- Mostrar datos recibidos de la API
- Enviar datos de usuario al backend
- Validar solo los campos ingresados por el usuario
- Gestionar estado de UI (loading, errores, formularios)

**Responsabilidades del Backend:**
- Generar IDs únicos
- Establecer fechas de creación/actualización
- Gestionar estados y transiciones
- Aplicar reglas de negocio

---

### Esquema Product
```typescript
// Tipo completo de Product (recibido desde la API)
interface Product {
  // Campos generados por backend (SOLO LECTURA en frontend)
  id: string;                    // Generado por backend
  createdAt: Date;               // Generado por backend
  updatedAt: Date;               // Generado por backend
  status: 'Active' | 'Exhausted' | 'Eliminated';  // Gestionado por backend
  
  // Campos proporcionados por usuario (editables en frontend)
  name: string;
  price: number;
  description: string;
  stock: number;
}

// Tipo para crear un producto (enviado AL backend)
interface CreateProductInput {
  name: string;
  price: number;
  description: string;
  stock: number;
  // Nota: NO incluye id, status ni fechas - el backend los genera
}

// Tipo para actualizar un producto (enviado AL backend)
interface UpdateProductInput {
  name?: string;
  price?: number;
  description?: string;
  stock?: number;
  // Nota: id va en el parámetro de URL, status y fechas son gestionados por backend
}
```

**Lógica de Status** (Gestionado por Backend):
- `Active`: Estado por defecto, producto disponible
- `Exhausted`: Cuando el stock llega a 0 (auto-establecido por backend)
- `Eliminated`: Borrado lógico (establecido por backend)
```typescript
// ❌ NUNCA hacer esto en frontend
const newProduct = {
  id: generateId(),           // MAL - el backend genera
  status: 'Active',           // MAL - el backend establece
  createdAt: new Date(),      // MAL - el backend genera
  name: formData.name,
  price: formData.price,
};

// ✅ Correcto - solo enviar datos de usuario
const createProduct = async (input: CreateProductInput) => {
  const response = await fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify({
      name: input.name,
      price: input.price,
      description: input.description,
      stock: input.stock,
    }),
  });
  
  return response.json(); // Backend retorna Product completo con id, status y fechas
};
```

---

### Esquema Client
```typescript
// Tipo completo de Client (recibido desde la API)
interface Client {
  // Campos generados por backend (SOLO LECTURA en frontend)
  id: string;                    // Generado por backend
  createdAt: Date;               // Generado por backend
  updatedAt: Date;               // Generado por backend
  status: 'Active' | 'Eliminated';  // Gestionado por backend
  
  // Campos proporcionados por usuario (editables en frontend)
  document: string;              // DNI, pasaporte, etc.
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
}

// Tipo para crear un cliente (enviado AL backend)
interface CreateClientInput {
  document: string;
  email: string;
  name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  // Nota: NO incluye id, status ni fechas
}

// Tipo para actualizar un cliente (enviado AL backend)
interface UpdateClientInput {
  document?: string;
  email?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  country?: string;
  // Nota: id va en el parámetro de URL, status y fechas son gestionados por backend
}
```

**Lógica de Status** (Gestionado por Backend):
- `Active`: Estado por defecto, cliente activo
- `Eliminated`: Borrado lógico (establecido por backend)
```typescript
// ✅ Implementación correcta
const ClientForm = () => {
  const createClientMutation = useMutation({
    mutationFn: async (input: CreateClientInput) => {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(input),
      });
      
      if (!response.ok) throw new Error('Failed to create client');
      return response.json() as Promise<Client>;
    },
  });
  
  const handleSubmit = (formData: CreateClientInput) => {
    // Solo enviar datos proporcionados por el usuario
    createClientMutation.mutate(formData);
  };
  
  return (/* JSX del formulario */);
};
```

---

### Puntos Clave

✅ **HACER:**
- Definir tipos separados para entidades completas (full) y entradas (create/update)
- Dejar que el backend genere todos los IDs, fechas y valores de status
- Enviar solo datos proporcionados por el usuario a la API
- Usar tipos TypeScript apropiados para requests/responses de API

❌ **NO HACER:**
- Generar IDs en frontend
- Establecer valores de status en frontend
- Crear o manipular timestamps (fechas)
- Enviar campos gestionados por backend en requests de create/update
