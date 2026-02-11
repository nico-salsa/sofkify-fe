# 🧾 Auditoría de Calidad – Snapshot Post‑MVP

**Proyecto:** Aplicación Web Frontend
**Stack:** React + TypeScript + Tailwind CSS
**Commit base:** `audit: snapshot post-mvp`
**Rol:** Auditor de calidad y arquitectura

---

## 🎯 1. Objetivo de la auditoría

Establecer un **punto de retorno arquitectónico** posterior al MVP que permita:

* Evaluar la **deuda técnica existente**.
* Identificar **violaciones a principios SOLID y POO**.
* Detectar **code smells** que afecten mantenibilidad y escalabilidad.
* Proponer acciones correctivas claras y priorizadas.

Este documento servirá como referencia para comparar la evolución futura de la arquitectura.

---

## 🧩 2. Resumen ejecutivo

El proyecto cumple adecuadamente su objetivo funcional de MVP, sin embargo presenta **deuda técnica moderada**, principalmente en:

* Falta de alineación frontend–backend.
* Ausencia de estandarización de tipos y contratos.
* Acoplamiento entre lógica de UI y lógica de dominio.
* Infraestructura de desarrollo no reproducible.

Si no se corrigen estos hallazgos, el crecimiento del proyecto impactará negativamente en la **escalabilidad, testabilidad y velocidad de desarrollo**.

---

## 🔍 3. Hallazgos detallados de auditoría

### ⚙️ Hallazgo 1: Desalineación entre formulario de registro frontend y contrato backend

**Descripción**
El formulario de registro en el frontend no utiliza exactamente los campos requeridos por el backend, generando inconsistencias en la creación de usuarios.

**Principios vulnerados**

* **SRP (Single Responsibility Principle):** el formulario asume lógica implícita de validación y estructura que debería delegarse a un contrato definido.
* **DIP (Dependency Inversion Principle):** el frontend depende de supuestos del backend en lugar de depender de una abstracción compartida (DTO o interfaz).

**Code smells detectados**

* Contratos implícitos.
* Alto riesgo de errores en tiempo de ejecución.

**Impacto en escalabilidad**

* Dificulta cambios futuros en el backend.
* Incrementa bugs al agregar nuevos flujos de registro.

**Recomendación**

* Definir un **CreateUserDTO** tipado en TypeScript alineado al backend.
* Utilizar validación basada en esquema (Zod / Yup) como fuente única de verdad.

---

### 🐳 Hallazgo 2: Ausencia de dockerización del proyecto

**Descripción**
El proyecto no cuenta con Docker, lo que genera dependencia directa del entorno local de cada desarrollador.

**Principios vulnerados**

* **DIP:** la aplicación depende del entorno en lugar de abstraerlo.

**Code smells detectados**

* “Works on my machine”.
* Configuración no reproducible.

**Impacto en escalabilidad**

* Dificulta onboarding de nuevos desarrolladores.
* Riesgo elevado en despliegues y CI/CD.

**Recomendación**

* Crear `Dockerfile` y `docker-compose.yml`.
* Estandarizar Node, variables de entorno y build.

---

### 📦 Hallazgo 3: Tipo global `Producto` mal definido o inconsistente

**Descripción**
El tipo `Producto` se redefine o se tipa de forma inconsistente en distintos componentes.

**Principios vulnerados**

* **SRP:** múltiples fuentes de verdad para una misma entidad.
* **OCP (Open/Closed Principle):** cambios en el modelo afectan múltiples archivos.

**Code smells detectados**

* Tipos duplicados.
* Acoplamiento entre componentes.

**Impacto en escalabilidad**

* Alto costo de cambio ante nuevas propiedades.
* Mayor riesgo de errores silenciosos.

**Recomendación**

* Crear un **modelo de dominio** centralizado (`types/product.ts`).
* Usar interfaces o tipos inmutables.
* Separar modelo de dominio de modelo de presentación.

---

### 🛒 Hallazgo 4: Componente `ProductCart` incompleto

**Descripción**
El componente `ProductCart` no implementa completamente su responsabilidad funcional.

**Principios vulnerados**

* **SRP:** responsabilidades difusas o no finalizadas.

**Code smells detectados**

* Componente parcialmente implementado.
* Posible lógica de negocio en UI.

**Impacto en escalabilidad**

* Dificulta pruebas unitarias.
* Riesgo de refactors costosos.

**Recomendación**

* Finalizar el componente.
* Extraer lógica de negocio a hooks o servicios.
* Mantener el componente como presentacional.

---

### 👤 Hallazgo 5: Ausencia de servicio `CreateUser`

**Descripción**
La creación de usuarios se realiza directamente desde el componente, sin una capa de servicio.

**Principios vulnerados**

* **SRP:** el componente maneja UI y lógica de dominio.
* **DIP:** dependencia directa de implementación de API.

**Code smells detectados**

* Fetch/axios embebido en componentes.
* Baja reutilización.

**Impacto en escalabilidad**

* Dificulta testing.
* Repetición de lógica en otros flujos.

**Recomendación**

* Crear un servicio `createUserService`.
* Inyectar dependencias desde capas superiores.

---

### 🔙 Hallazgo 6: Falta de botón de retorno en formularios

**Descripción**
Los formularios carecen de una acción clara de retorno.

**Principios vulnerados**

* No afecta directamente SOLID, pero impacta UX y consistencia.

**Impacto en escalabilidad**

* Incrementa fricción del usuario.
* Dificulta reutilización de formularios.

**Recomendación**

* Agregar botón de retorno reutilizable.
* Centralizar navegación con hooks.

---

### 🧾 Hallazgo 7: Falta de reglas claras para la creación de commits

**Descripción**
El equipo no cuenta con una convención formal para la creación de commits. Actualmente existen commits en español y sin una regla consistente, aunque se evidencia un ejemplo correcto siguiendo el formato: `audit: snapshot post-mvp`.

**Principios vulnerados**

* **SRP (Single Responsibility Principle):** los commits no comunican de forma clara y única la intención del cambio.
* **Buenas prácticas de ingeniería de software:** ausencia de estandarización en el historial de versiones.

**Code smells detectados**

* Mensajes de commit ambiguos o descriptivos en exceso.
* Mezcla de idiomas en el historial.
* Dificultad para rastrear cambios específicos.

**Impacto en escalabilidad**

* Complica la revisión de cambios (code review).
* Dificulta el uso de herramientas de automatización (changelog, CI/CD, versionado semántico).
* Reduce la trazabilidad y mantenibilidad del proyecto.

**Recomendación**

* Definir y documentar una convención de commits (ej. Conventional Commits).
* Unificar el idioma de los commits.
* Usar prefijos claros (`feat`, `fix`, `refactor`, `audit`, etc.) y mensajes concisos.

---

## 🧠 4. Conclusión

El proyecto se encuentra en un **estado saludable de MVP**, pero requiere acciones correctivas inmediatas para evitar acumulación de deuda técnica.

La aplicación de principios SOLID, separación de capas y estandarización de contratos permitirá:

* Mejor escalabilidad.
* Mayor facilidad de testing.
* Evolución segura de la arquitectura.

> **Estado de referencia arquitectónica establecido ✅**
