# PROMPTS POR ROL - Cadena de Agentes IRIS

Estos prompts han sido generados por IRIS a partir de una solicitud de usuario. Cada rol tiene un prompt específico con información clara, sin ambigüedades y listo para ejecución.

---

## 1️⃣ PROMPT PARA ARQUITECTO

### Misión
Revisar y validar la historia de usuario completa con criterios medibles.

### Contexto
Sofkify Frontend (React+TS) necesita mejorar confirmación de carrito y creación de orden.

### Tarea

1. **Valida contrato API** (usando backend como fuente de verdad):
   - ¿Endpoint `POST /carts/{id}/confirm` existe y retorna `{ success, cartId, confirmedAt, orderId }`?
   - ¿Endpoint `POST /orders` existe y retorna Order con campos correctos?
   - ¿RabbitMQ publica evento `order.created` con estructura definida?
   - ¿Stock validation implementada en backend (error 422 STOCK_ERROR)?

2. **Valida criterios de aceptación**:
   - CA-01 a CA-10 cubren flujo completo (carrito visible → confirmación → orden)?
   - ¿Hay edge cases faltantes (stock-0, carrito vacío, timeout, duplicados)?
   - ¿Errores documentados (400, 422, 500, timeout)?

3. **Revisa plan TDD**:
   - ¿Tests unitarios cubren servicios API, hooks, componentes?
   - ¿Tests E2E con Playwright cubren flujo happy path + error paths?
   - ¿Coverage >= 70% es realista con tests definidos?

4. **Valida requerimientos no-funcionales**:
   - Performancia: Lazy loading componentes de orden?
   - Accesibilidad: WCAG 2.1 AA (botones, labels, navegación teclado)?
   - Responsividad: Mobile-first validado < 640px?
   - Tipado: Ningún `any`, solo `unknown` si necesario?

5. **Aprueba o rechaza** con feedback específico:
   - Si apruebas: "Arquitectura validada. Listo para desarrollo." + fecha
   - Si rechazas: Lista problemas específicos + recomendaciones

### Output
Documento aprobación o reporte de hallazgos con acción requerida.

---

## 2️⃣ PROMPT PARA DESARROLLADOR (CODER)

### Misión
Implementar componentes, servicios y tests.

### Pre-requisitos
- [ ] Arquitecto aprobó HU
- [ ] Backend endpoints funcionales (confirmar con backend team)
- [ ] AuthContext + CartContext ya implementados
- [ ] TypeScript 5.9.3, React 19.2, Vite 7.2.4

### Tarea

**Fase 1: Tests Primero (TDD - ROJO)**
```bash
1. Copiar suite de tests de HU-CART-ORDER-CONFIRMATION.md
2. Crear archivos .test.ts vacíos con solo describes
3. npm test -- --watch
   → Todos RED (fallan como esperado)
```

**Fase 2: Tipos TypeScript (15 min)**
```bash
1. Crear: src/types/cart.types.ts (actualizar con ConfirmCartResponse, CartConfirmationError)
2. Crear: src/types/order.types.ts (Order, OrderItem, CreateOrderRequest)
3. Ejecutar: npm run lint -- --fix
```

**Fase 3: Servicios API (30 min)**
```bash
1. Crear: src/services/cart/cartApi.ts
   - confirmCart(cartId): POST /carts/{id}/confirm
   - Validar token en authStorage
   - Retornar ConfirmCartResponse o throw CartConfirmationError

2. Crear: src/services/order/orderApi.ts
   - createOrder(payload): POST /orders
   - getOrderById(id): GET /orders/{id}
   - Validar no-backend-managed-fields
```

**Fase 4: Hook Personalizado (20 min)**
```bash
1. Crear: src/hooks/useCartConfirmation.ts
   - Estados: isLoading, error, data
   - Función: confirmCart(cartId)
   - Debounce para evitar double-submit
   - Secuencia: confirm → create → navigate
```

**Fase 5: Componentes (60 min)**
```bash
1. Refactorizar: src/pages/Cart/CartConfirmationPage.tsx
   - Mostrar items con stock warning
   - Botón confirmar con validaciones
   - Estados async (loading/error/success)
   - Desabilitar si carrito vacío

2. Crear: src/pages/Order/OrderSuccessPage.tsx
   - Load order by ID
   - Mostrar detalles formateados
   - Timestamp dd/mm/yyyy HH:mm
   - Botones: "Volver" + "Ver Mis Órdenes"
```

**Fase 6: Tests Verde (60 min)**
```bash
1. npm test -- --watch
   → Escribir mocks (MSW, jest.spyOn)
   → Confirmar todos GREEN
2. npm run test -- --coverage
   → Coverage >= 70%
```

### Normas Críticas
- ✅ Usar `import.meta.env.VITE_API_BASE_URL` (no hardcode)
- ✅ Servicios NO envían id, createdAt, updatedAt
- ✅ Componentes usan solo @tailwindcss (no inline styles)
- ✅ Todos tipos explícitos (no `any`)
- ✅ Manejar 3 estados: loading/success/error
- ✅ Headers: `Content-Type: application/json`, `Authorization: Bearer`

### Tests Entregables
- [ ] `src/services/cart/cartApi.test.ts` (5 tests)
- [ ] `src/services/order/orderApi.test.ts` (5 tests)
- [ ] `src/hooks/useCartConfirmation.test.ts` (6 tests)
- [ ] `src/pages/Cart/CartConfirmationPage.test.tsx` (7 tests)
- [ ] `src/pages/Order/OrderSuccessPage.test.tsx` (6 tests)
- [ ] `src/__tests__/integration/cartConfirmation.test.ts` (4 tests)
- [ ] `src/__tests__/integration/orderEvents.test.ts` (2 tests)
- [ ] Coverage report en terminal

### Output
- Code commit con todos tests GREEN
- Coverage >= 70% o documentar excepciones
- PR con descripción y checklist completado

---

## 3️⃣ PROMPT PARA QA (TESTER)

### Misión
Validar funcionalidad con tests E2E y checklist manual.

### Pre-requisitos
- [ ] Desarrollo completado
- [ ] Backend services corriendo en http://localhost:8080
- [ ] RabbitMQ accesible
- [ ] Usuario test: test@sofkify.com / Test123456

### Tarea

**Fase 1: Setup E2E (15 min)**
```bash
1. npm install -D @playwright/test
2. npx playwright install
3. Copiar e2e/cart-confirmation.spec.ts desde HU
4. Configurar .env.testing:
   BASE_URL=http://localhost:3000
   API_URL=http://localhost:8080
```

**Fase 2: Tests E2E (Playwright)**
```bash
1. npx playwright test e2e/cart-confirmation.spec.ts
   → Verifica 6 escenarios (happy path + errors)
2. npx playwright show-report
   → Visualizar videos de ejecución
3. Documentar: Todos PASS o FAIL + screenshot
```

**Fase 3: QA Checklist Manual (2 horas)**
```bash
Ejecutar 18 test cases en navegador manual:
- QA-01: Carrito visible
- QA-02: Stock insuficiente bloquea
- QA-03: Stock=0 no permite agregar
- ... (ver tabla en HU)

Por cada test case:
[ ] Precondiciones OK
[ ] Pasos ejecutables
[ ] Resultado esperado ✓
[ ] Screenshot si error
```

**Fase 4: Edge Cases Críticos (1 hora)**
```bash
Ejecutar 5 escenarios edge case:
- EC-01: Stock cambia entre agregar y confirmar
- EC-02: Carrito no encontrado (404)
- EC-03: Usuario logueado de otra sesión
- EC-04: Confirmación OK pero ORDER falla 500
- EC-05: Items inválidos (productId='', qty=-1)

Para cada: [ ] Reproducible [ ] Error message clara [ ] Recovery path OK
```

**Fase 5: Accesibilidad (30 min)**
```bash
1. Instalar: npm install -D @axe-core/playwright
2. Escanear con axe reporter
   → Verificar: Sin violations críticas
3. Prueba teclado:
   → Tab through buttons/links
   → Enter/Space triggera acciones
   → Escape cierra modals
4. Lectores pantalla (NVDA/JAWS simulado)
   → Labels en botones visibles
   → Aria-labels presentes si needed
```

**Fase 6: Performance (opcional)**
```bash
1. Chrome DevTools → Performance tab
2. Timeline: Confirmación → Orden success
   → Target: < 3 segundos (network + processing)
3. Lighthouse:
   → Performance >= 80
   → Accessibility >= 90
```

### Criterios PASS/FAIL
- PASS: 18/18 test cases + 5/5 edge cases + sin critical violations a11y
- FAIL: Documentar bugs, prioridad (HI/MEDIA/LO), severity

### Output
- Reporte QA: test-results.md
- Screenshots de errores
- Video Playwright con failures
- Accesibilidad report (axe-core)

---

## 4️⃣ PROMPT PARA SECURITY REVIEW

### Misión
Validar seguridad y contrato FE/BE.

### Pre-requisitos
- [ ] Code completado y tests GREEN
- [ ] PR abierto en GitHub
- [ ] Acceso a código fuente

### Tarea

**Checkpoint 1: URLs y Configuración (10 min)**
```bash
Validar en:
- src/services/cart/cartApi.ts
- src/services/order/orderApi.ts

Criterios:
✓ URL base = import.meta.env.VITE_API_BASE_URL
✓ No hardcoded: http://localhost, https://api.xxx
✓ .env.local incluye: VITE_API_BASE_URL=http://localhost:8080
✓ .env.production incluye: VITE_API_BASE_URL=https://api.sofkify.com
```

**Checkpoint 2: Autorización (10 min)**
```bash
Validar en servicios:
✓ Gets token from: authStorage.getToken()
✓ Header presente: Authorization: Bearer {token}
✓ Content-Type: application/json
✓ Sin token en payload
✓ Sin token en URL params
```

**Checkpoint 3: Backend-Managed Fields (15 min)**
```bash
Validar payloads enviados:

cartApi.confirmCart():
  ✓ Envía: {} (nada, confirmá by URL)
  ✓ NO envía: id, createdAt, updatedAt

orderApi.createOrder():
  ✓ Envía: { userId, items: [{productId, quantity}] }
  ✓ NO envía: id, createdAt, updatedAt, status

Verificar con regex o manual code review:
  grep -r "id:" src/services/ → Si match, FAIL
  grep -r "createdAt:" src/services/ → Si match, FAIL
```

**Checkpoint 4: Error Handling (15 min)**
```bash
Verificar en componentes:
✓ No console.log sensibles (tokens, PII)
✓ Error messages genéricas al usuario
  ✓ "STOCK_ERROR" → "Stock insuficiente"
  ✓ "500 Internal Server Error" → "Error en servidor. Intenta más tarde."
✓ Sensitive details solo en logs backend
✓ No leak de stack traces a frontend
```

**Checkpoint 5: Input Validation (15 min)**
```bash
Verificar en:
- CartConfirmationPage.tsx
- OrderSuccessPage.tsx

Criterios:
✓ cartId validated (not empty, regex UUID if needed)
✓ orderId validated (not empty, regex UUID if needed)
✓ quantity validated (> 0, <= stock)
✓ Fields tipadas (TypeScript strict mode)
```

**Checkpoint 6: XSS Protection (10 min)**
```bash
Validar en componentes:
✓ Sin dangerouslySetInnerHTML
✓ Sin template literals en JSX:
  ❌ <p>{`Total: ${userInput}`}</p> ← susceptible si userInput = "<script>"
  ✅ <p>Total: {userTotal}</p> ← React escapa automático
✓ URLs sanitizadas si linkeadas
```

**Checkpoint 7: CORS & CSRF (10 min)**
```bash
Validar:
✓ Backend envía: Access-Control-Allow-Origin: http://localhost:3000
✓ Frontend Content-Type: application/json (cumple CORS)
✓ POST requests no requieren CSRF token (asumiendo SameSite cookies)
✓ Verificar backend tiene CORS habilitado para origins esperados
```

**Checkpoint 8: Dependency Scan (5 min)**
```bash
Ejecutar:
npm audit
npm outdated

Acciones:
✓ Sin high/critical vulnerabilities
✓ Si hay: evaluar riesgo, patchear o document exception
```

### Checklist de Aprobación
- [ ] URLs y env variables OK
- [ ] Autorización implementada correctamente
- [ ] No backend-managed fields en payloads
- [ ] Error handling seguro
- [ ] Input validation
- [ ] XSS protection
- [ ] CORS/CSRF validado
- [ ] Dependencies scan clean

### Output
- Security review document: SEGURIDAD.md
- Si issues encontrados: PR comments + GitHub labels `security`
- Si PASS: Aprobación y "Ready to merge"

---

## 5️⃣ PROMPT PARA DEVOPS (INFRASTRUCTURE)

### Misión
Validar docker-compose, variables y healthchecks.

### Contexto
Frontend React se integra con backend Spring Boot + PostgreSQL + RabbitMQ.

### Tarea

**Checkpoint 1: Docker Compose Validación (10 min)**
```bash
Revisar docker-compose.yml:

✓ Backend service health:
  test: ['CMD', 'curl', '-f', 'http://localhost:8080/actuator/health']
  
✓ PostgreSQL health:
  test: ['CMD-SHELL', 'pg_isready -U postgres']
  
✓ RabbitMQ health:
  test: ['CMD', 'rabbitmq-diagnostics', '-q', 'ping']

✓ Services startup order: db → rabbitmq → backend
```

**Checkpoint 2: Frontend .env.local (5 min)**
```bash
Verificar presentes:
- VITE_API_BASE_URL=http://localhost:8080 (dev)
- VITE_API_TIMEOUT=30000 (opcional)

Verificar NO presentes (secretos no deben estar aquí):
- API_KEY
- SECRET
- JWT_SECRET

Nota: dotenv-webpack o similar maneja variables en build.
```

**Checkpoint 3: Frontend .env.production (5 min)**
```bash
Verificar presentes:
- VITE_API_BASE_URL=https://api.sofkify.com (o staging URL)

Nota: Debe completarse cuando deploy strategy esté definida.
```

**Checkpoint 4: Startup Script (10 min)**
```bash
Crear o actualizar: scripts/startup.sh

Contenido esperado:
1. docker-compose down (cleanup)
2. docker-compose build
3. docker-compose up -d
4. sleep 15 (wait for services)
5. healthc check loop: curl backend, db, rabbitmq
6. npm install && npm test (frontend tests)
7. npm run dev (start dev server)
```

**Checkpoint 5: No Cambios Requeridos (Validation)**
```bash
Confirmar:
✓ Backend endpoints existen (no cambios)
✓ RabbitMQ ya configurado (no cambios)
✓ PostgreSQL ya configurado (no cambios)
✓ Frontend no requiere nuevas dependencias externas

Conclusión: ✅ docker-compose no necesita cambios
            ✅ Variables .env no requieren actualizaciones
            ✅ Healthchecks ya presentes
```

### Output
- Documento: INFRAESTRUCTURA.md
- Verificación: startup-check.log
- Status: ✅ LISTO PARA DESARROLLO o ❌ REQUERIMIENTOS IDENTIFICADOS

---

## 🔗 CÓMO USAR ESTOS PROMPTS

### Secuencia Recomendada
1. **Arquitecto** → Valida HU (1-2 horas)
2. **Desarrollador** → Implementa código (2 días)
3. **QA** → Tests E2E + checklist (1 día)
4. **Security** → Review (1 hora)
5. **DevOps** → Infra validation (30 min)

### Por Slack/Chat
```
@iris-architect: Por favor revisa HU-CART-ORDER-CONFIRMATION.md 
Usa el prompt "PROMPT PARA ARQUITECTO"

@iris-developer: Por favor implementa PHASE 1-6 en el prompt 
Entrega: PR con tests GREEN

@iris-qa: Por favor ejecuta E2E + checklist manual
Entrega: test-results.md + screenshots

@iris-security: Por favor revisa seguridad
Usa: PROMPT PARA SECURITY REVIEW

@iris-devops: Por favor valida infraestructura
Usa: PROMPT PARA DEVOPS
```

### Métricas de Éxito
- ✅ Arquitecto aprobó en Day 2
- ✅ Developers entregó tests GREEN en Day 4
- ✅ QA completó 18/18 test cases en Day 5
- ✅ Security sin findings críticos
- ✅ DevOps confirmó no cambios requeridos

---

**Documento generado por:** IRIS v1.0  
**Fecha:** 2026-02-20  
**Para:** Cadena de agentes especializados Sofkify
