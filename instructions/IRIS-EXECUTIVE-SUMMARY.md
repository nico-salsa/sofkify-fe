# RESUMEN EJECUTIVO - HU Cart → Order (IRIS)

## 📌 Lo Esencial (1 Página)

### ¿Qué se necesita?
Implementar flujo completo de confirmación de carrito y creación de orden en frontend Sofkify.

**Flujo:** Usuario visualiza carrito activo → Confirma carrito (POST /carts/{id}/confirm) → Backend crea orden (POST /orders) → Muestra detalles de orden

### ¿Cuándo?
- **Start:** HOY
- **Dev:** HOY
- **QA:** HOY (en paralelo)
- **Review/Merge:** HOY (en paralelo)
- **Total:** INMEDIATO

### ¿Quién hace qué?
| Rol | Tarea | Duration | Output |
|-----|-------|----------|--------|
| **Arquitecto** | Valida HU + contrato API | 2h | Aprobación o feedback |
| **Developer** | Code TDD (tests→impl) | 2 días | PR con tests GREEN + coverage 70% |
| **QA** | E2E + manual testing | 1 día | test-results.md + screenshots |
| **Security** | Review seguridad + contrato FE/BE | 1h | SEGURIDAD.md + sign-off |
| **DevOps** | Valida docker-compose (no cambios) | 30min | INFRA.md + confirmación |

### ¿Dónde está la información?

**Documento Principal:** 📄 `instructions/HU-CART-ORDER-CONFIRMATION.md`  
Todo lo que necesitas: criterios, tests, código, edge cases, QA.

**Por Rol:** 📄 `instructions/IRIS-PROMPTS-BY-ROLE.md`  
Prompts específicos: arquitecto, dev, QA, security, DevOps.

**Índice:** 📄 `instructions/IRIS-INDEX-AND-MAPPING.md`  
Mapa completo de documentos, archivos a crear, timeline.

---

## 🎯 Criterios de Aceptación (Resumen)

| # | Criterio | Validar |
|---|----------|---------|
| CA-01 | Carrito visible con items/total | `items[]`, `total`, `totalQuantity` mostrados |
| CA-02 | Backend confirm cart retorna orderId | `POST /carts/{id}/confirm` → 200 OK + `orderId` |
| CA-03 | Backend create order persiste | `POST /orders` → 201 + Order con timestamps |
| CA-04 | Stock insuficiente error | 422 `STOCK_ERROR` con detalles (available, requested) |
| CA-05 | Carrito vacío deshabilita botón | Botón disabled + tooltip |
| CA-06 | Sin auth redirige login | No token → `/auth/login` |
| CA-07 | Orden success muestra detalles | Números, formateo timestamps (dd/mm/yyyy HH:mm) |
| CA-08 | RabbitMQ evento `order.created` | Backend publica evento con estructura |
| CA-09 | Idempotencia en reintentos | 2x confirm → mismo orderId (no duplicados) |
| CA-10 | Estados async UI feedback | loading → success/error con mensajes claros |

---

## 🧪 Plan TDD Resumido

**Paso 1: ROJO (Tests fallan)**
- Escribir servicios API tests
- Escribir hooks tests
- Escribir componentes tests
- Escribir E2E tests (Playwright)
- Ejecutar: TODO FALLA ❌

**Paso 2: VERDE (Implementar)**
- Crear tipos TypeScript
- Crear servicios API (cartApi, orderApi)
- Crear hook (useCartConfirmation)
- Crear componentes (CartConfirmationPage, OrderSuccessPage)
- Ejecutar tests: TODO PASA ✅

**Paso 3: REFACTOR**
- Optimizar performance
- Mejorar UX
- Documentar

**Entregables Tests:**
- 35+ Unit tests (servicios, hooks, componentes)
- 6 E2E tests (Playwright)
- 2 Integration tests (RabbitMQ mock)
- Coverage: >= 70%

---

## 🚨 Edge Cases Críticos

| EC | Escenario | Mitigación |
|----|-----------|-----------|
| EC-01 | Stock cambia entre agregar y confirmar | Backend valida stock en confirm (no en add) |
| EC-02 | Carrito 404 (no encontrado) | Error con recovery: "Intenta comprar nuevamente" |
| EC-03 | Token expirado otra sesión | Redirige login: "Sesión expirada" |
| EC-04 | Confirm OK pero POST /orders falla | Store orderId en session, polling para crear |
| EC-05 | Items inválidos (qty=-1) | Frontend valida, backend tambien |

---

## ✅ Security Checklist (CRÍTICO)

### Antes de Merge - NO ENVIAR SI FALLA ALGUNO

- [ ] **URLs:** `import.meta.env.VITE_API_BASE_URL` (no hardcode)
- [ ] **Autorización:** Header `Authorization: Bearer {token}` en requests
- [ ] **Backend-managed fields:** Payloads NO contienen `id`, `createdAt`, `updatedAt`
- [ ] **Error messages:** Genéricos al usuario, detalles solo en logs backend
- [ ] **Input validation:** cartId, orderId, quantity validados
- [ ] **XSS:** Sin `dangerouslySetInnerHTML`, React escapa automático
- [ ] **CORS:** Backend headers correctos
- [ ] **Dependencies:** `npm audit` sin critical/high vulns

---

## 📋 QA Checklist Manual (18 Test Cases)

Ejecutar en navegador (no automatizado):

```
✓ Carrito visible
✓ Stock insuficiente bloquea confirmación
✓ Stock=0 no permite agregar
✓ Confirmación exitosa redirige a orden
✓ Orden muestra detalles correctos
✓ Timestamps formateados dd/mm/yyyy
✓ No backend-managed fields en payloads
✓ Manejo de timeout (30s+)
✓ Debounce: 3 clicks = 1 request
✓ Carrito vacío deshabilita botón
✓ Sin autenticación redirige login
✓ Error 422 STOCK_ERROR mostrado
✓ "Volver a Tienda" funciona
✓ "Ver Mis Órdenes" link (esperado 404 por feature futura)
✓ Loading spinner visible
✓ Mobile responsive (< 640px)
✓ Accesibilidad WCAG 2.1
✓ Idempotencia: 2+ confirms mismo orderId
```

**PASS:** 18/18 test cases  
**FAIL:** Documentar bugs, prioridad, screenshot

---

## 🔄 Dependencias (Pre-requisitos)

**Backend Team Debe:**
- ✅ Endpoint `POST /carts/{id}/confirm` activo
- ✅ Endpoint `POST /orders` activo
- ✅ Error handling 422 STOCK_ERROR
- ✅ RabbitMQ evento `order.created` publicado
- ✅ Stock validation implementada

**Frontend Team Debe:**
- ✅ AuthContext con `useAuth()` hook
- ✅ CartContext con `useCart()` hook
- ✅ authStorage con `getToken()` funcional
- ✅ Router con rutas `/cart`, `/order-success/:orderId`

**Confirmación:** Contactar backend team Day 1 → validar endpoints con Postman

---

## 📁 Archivos a Crear

```
src/types/
  ├── cart.types.ts (actualizar)
  └── order.types.ts (✨ nuevo)

src/services/
  ├── cart/
  │   ├── cartApi.ts (✨ nuevo)
  │   └── cartApi.test.ts (✨ nuevo)
  └── order/
      ├── orderApi.ts (✨ nuevo)
      └── orderApi.test.ts (✨ nuevo)

src/hooks/
  ├── useCartConfirmation.ts (✨ nuevo)
  └── useCartConfirmation.test.ts (✨ nuevo)

src/pages/
  ├── Cart/
  │   ├── CartConfirmationPage.tsx (✨ nuevo)
  │   └── CartConfirmationPage.test.tsx (✨ nuevo)
  └── Order/
      ├── OrderSuccessPage.tsx (✨ nuevo)
      └── OrderSuccessPage.test.tsx (✨ nuevo)

e2e/
  └── cart-confirmation.spec.ts (✨ nuevo)
```

---

## 🚀 Comandos Día a Día

### Arquitecto (Day 1 - 2h)
```bash
# Revisar
cat instructions/HU-CART-ORDER-CONFIRMATION.md

# Validar
# 1. Backend endpoints existen (Postman test)
# 2. Criterios CA-01 a CA-10 son medibles
# 3. Supuestos tienen respuesta

# Resultado: architecture-approval.md
```

### Developer (Day 2-3 - 2 días)
```bash
# Fase 1: Tests rojo
npm test -- --watch
# Copiar tests de HU → todos fallan ❌

# Fase 2-5: Implementar + verde
# (Crear tipos, servicios, hooks, componentes)
npm test
# Todos pasan ✅

# Fase 6: Coverage
npm run test -- --coverage
# Verificar >= 70%
```

### QA (Day 4 - 1 día)
```bash
# E2E tests
npx playwright test e2e/cart-confirmation.spec.ts

# Manual testing
npm run dev
# Ejecutar 18 test cases en navegador

# Resultado: test-results.md + screenshots
```

### Security (Day 5 - 1h)
```bash
# Auditar seguridad
npm audit

# Code review
# Ejecutar checklist: URLs, auth, input validation, etc.

# Resultado: SEGURIDAD.md + approval
```

### DevOps (Day 5 - 30min)
```bash
# Validar infraestructura
docker-compose up -d
docker-compose ps
# Verificar healthchecks

# Resultado: INFRA.md + confirmation
```

---

## 💬 FAQ Rápido

**Q: ¿Qué pasa si backend endpoint no existe?**  
A: Contacted backend team, task move to next sprint, o implementar backend primero.

**Q: ¿Cómo manejar stock que cambia?**  
A: Backend valida en confirm (no en add). Si insuficiente, error 422. Frontend muestra warning.

**Q: ¿Frontend consume RabbitMQ directamente?**  
A: NO. Solo backend publica eventos. Frontend lee responses REST. (Futura: WebSockets para notificaciones real-time)

**Q: ¿Tokens JWT implementados?**  
A: NO aún. Usar authStorage actual (localStorage). Tokens = next sprint.

**Q: ¿Duración estimada correcta?**  
A: 5 días asumiendo backend endpoints ya existen. Si no, agregar 2-3 días.

**Q: ¿Puedo paralelizar trabajo?**  
A: Arquitecto aprueba (Day 1) → Dev, QA, Security trabajan en paralelo (Days 2-5).

---

## 📞 Contactos

- **Arquitecto:** Valida HU, aprueba contrato
- **Backend Team:** Confirma endpoints + contrato API
- **Dev Lead:** Asigna tareas, revisa PRs
- **QA Lead:** Coordina manual testing
- **Security Lead:** Sign-off antes de merge

---

## ✨ Próximas Fases (Futura)

1. **Ver Mis Órdenes** page (listar orders del usuario)
2. **Push Notifications** vía WebSockets (backend publishes events)
3. **Order Tracking** (estado: pending → shipped → delivered)
4. **Payment Integration** (Stripe/PayPal)
5. **Email Notifications** (confirmación, tracking)

---

## 🎯 Success Criteria

**HU COMPLETADA CUANDO:**
- ✅ Arquitecto aprobó en Day 2
- ✅ Tests verde + coverage 70% en Day 3
- ✅ E2E tests pasan + QA checklist 18/18 en Day 4
- ✅ Security review sin findings críticos en Day 5
- ✅ DevOps confirmó infraestructura en Day 5
- ✅ PR merged a main branch
- ✅ Deployed a staging
- ✅ Smoke test en prod (si aplica)

**Timeline:** ✅ 5 días laborales

---

## 📖 Documentos Detallados

| Documento | Propósito | Leer Si... |
|-----------|-----------|-----------|
| `HU-CART-ORDER-CONFIRMATION.md` | Fuente de verdad técnica | Necesitas entender TODO |
| `IRIS-PROMPTS-BY-ROLE.md` | Prompts por rol | Eres arquitecto/dev/QA/security/devops |
| `IRIS-INDEX-AND-MAPPING.md` | Mapa de archivos y timeline | Necesitas entender cómo encajan |
| Este documento | Resumen ejecutivo | Tienes 10 minutos |

---

**Versión:** 1.0  
**Generado:** 2026-02-20  
**Próxima acción:** Compartir → Arquitecto aprueba → Dev inicia Monday
