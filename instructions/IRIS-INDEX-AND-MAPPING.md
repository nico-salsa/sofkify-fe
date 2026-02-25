# ÍNDICE DE DOCUMENTOS IRIS - Flujo Completo Cart → Order

## 📑 Documentos Generados

### 1. **HU-CART-ORDER-CONFIRMATION.md** (Principal)
   **Ubicación:** `instructions/HU-CART-ORDER-CONFIRMATION.md`
   **Tamaño:** ~80 KB
   **Contenido:**
   - Notación TOON (Tarea, Objetivo, Output, Normas)
   - Supuestos explícitos
   - Criterios de aceptación (CA-01 a CA-10)
   - Plan TDD completo con código de tests
   - Diseño de código (tipos, servicios, hooks, componentes)
   - Plan QA e edge cases
   - Checklist de seguridad
   - Tareas de infraestructura

   **Acción:** Compartir con todo el equipo como fuente de verdad

---

### 2. **IRIS-PROMPTS-BY-ROLE.md** (Operativo)
   **Ubicación:** `instructions/IRIS-PROMPTS-BY-ROLE.md`
   **Tamaño:** ~30 KB
   **Contenido:**
   - 5 prompts específicos por rol (Arquitecto, Dev, QA, Security, DevOps)
   - Listas de verificación
   - Criterios PASS/FAIL
   - Outputs esperados

   **Acción:** Usar para dar trabajo a agentes/equipo

---

## 🔀 FLUJO DE INTEGRACIÓN

```
┌────────────────────────────────────┐
│   USER REQUEST (IRIS Mode)        │
│   "Genera HU + tests + QA..."     │
└────────────┬───────────────────────┘
             │
             ▼
┌────────────────────────────────────┐
│   HU-CART-ORDER-CONFIRMATION.md   │
│   - Contexto completo              │
│   - Todos los criterios            │
│   - Todo código de tests           │
│   - Edge cases identificados       │
└────────────┬───────────────────────┘
             │
      ┌──────┴──────────────────┬─────────────────┬──────────────────┐
      │                         │                 │                  │
      ▼                         ▼                 ▼                  ▼
   ARQUITECTO              DESARROLLADOR          QA              SECURITY
   (Day 2)                (Days 3-4)            (Day 5)           (Day 5)
   
   Valida:                Implementa:            Ejecuta:         Revisa:
   - Criterios            - Tests rojo          - E2E (Playwright) - URLs/env
   - Contrato API         - Tipos TS            - Manual testing   - Auth
   - TDD Coverage         - Servicios           - Edge cases       - Input validation
   - Non-functionals      - Hooks               - Accesibilidad    - Error handling
                          - Componentes         - Performance      - XSS/CSRF
                          - Tests verde                             - Dependencies
      
      ▼                         ▼                 ▼                  ▼
   Aprobación            Code commit          QA Report        Security Sign-off
   architecture.md       tests-GREEN.log       test-results.md  SEGURIDAD.md
```

---

## 📁 ARCHIVOS A CREAR DURANTE IMPLEMENTACIÓN

### Fase 1: Tipos TypeScript
```
src/types/
├── cart.types.ts          (actualizar con ConfirmCart*)
└── order.types.ts         (crear)
```

### Fase 2: Servicios API
```
src/services/
├── cart/
│   └── cartApi.ts         (crear: confirmCart)
└── order/
    └── orderApi.ts        (crear: createOrder, getOrderById)
```

### Fase 3: Hooks
```
src/hooks/
└── useCartConfirmation.ts (crear)
```

### Fase 4: Componentes/Páginas
```
src/pages/
├── Cart/
│   ├── CartConfirmationPage.tsx        (new component)
│   └── CartConfirmationPage.test.tsx   (new tests)
└── Order/
    ├── OrderSuccessPage.tsx             (new component)
    └── OrderSuccessPage.test.tsx        (new tests)
```

### Fase 5: Tests
```
src/
├── services/
│   ├── cart/
│   │   └── cartApi.test.ts
│   └── order/
│       └── orderApi.test.ts
├── hooks/
│   └── useCartConfirmation.test.ts
└── __tests__/
    └── integration/
        ├── cartConfirmation.test.ts
        └── orderEvents.test.ts

e2e/
└── cart-confirmation.spec.ts
```

---

## 🔗 CONEXIONES CON CODEBASE EXISTENTE

### AuthContext (Dependencia)
**Ubicación esperada:** `src/context/AuthContext.tsx` o similar  
**Uso en HU:** `useAuth()` hook para obtener usuario actual y token  
**Status:** ✅ Mencionado en CAMBIOS_REQUERIDOS.md (semana 1)

### CartContext (Dependencia)
**Ubicación esperada:** `src/context/CartContext.tsx` o similar  
**Uso en HU:** `useCart()` hook para obtener items, total, ID  
**Status:** ✅ Mencionado en CAMBIOS_REQUERIDOS.md (semana 1)

### Hook useCart
**Ubicación esperada:** `src/hooks/useCart.ts`  
**Uso en HU:** `const { items, total, totalQuantity } = useCart()`  
**Status:** ✅ Parcialmente implementado (completar con cartApi integración)

### Auth Storage
**Ubicación:** `src/services/auth/authStorage.ts`  
**Uso en HU:** `authStorage.getToken()` para autorización  
**Status:** ✅ Existente (modificar si necesario para refresh tokens)

### Router
**Ubicación:** `src/App.tsx`  
**Cambios requeridos:**
- Ruta `/cart` → `<CartConfirmationPage />` (crear si no existe)
- Ruta `/order-success/:orderId` → `<OrderSuccessPage />` (crear)
- Guards de autenticación en ambas rutas

### Utilities
**Usar:** `src/utils/formatters.ts` para timestamps  
**Agregar si no existe:** Función `formatISOToLocalDate(iso: string): string`

---

## 🎯 CHECKLIST DE INTEGRACIÓN

### Pre-requisitos (ANTES de empezar desarrollo)
- [ ] Backend endpoints activos (`POST /carts/{id}/confirm`, `POST /orders`)
- [ ] Backend retorna contratos correctos (validar con Postman)
- [ ] RabbitMQ funciona (broker conectado a backend)
- [ ] AuthContext + CartContext implementados
- [ ] AuthStorage con `getToken()` funcional

### Durante Desarrollo
- [ ] Tipos TS creados sin `any`
- [ ] Servicios API usan variables de entorno
- [ ] Hooks no usan hardcoded datos
- [ ] Componentes foco en UI (sin lógica de negocio)
- [ ] Tests rojo → verde → refactor (TDD)

### Post-Implementación (QA/Security)
- [ ] E2E tests pasan (Playwright)
- [ ] Manual testing checklist (18 test cases)
- [ ] Edge cases validados (5 escenarios)
- [ ] Security review passed
- [ ] No hardcoded secrets
- [ ] Coverage >= 70%

### Deploy
- [ ] .env.production configurado con URLs correctas
- [ ] Docker-compose validado (sin cambios requeridos)
- [ ] Healthchecks OK
- [ ] Staging deploy test
- [ ] Production readiness review

---

## 📊 MÉTRICAS ESPERADAS

### Cobertura de Pruebas
```
Target: >= 70%
- Statements: 75%
- Branches: 70%
- Functions: 80%
- Lines: 76%
```

### Tests por Fase
| Fase | Unitarios | E2E | Integración | Total |
|------|-----------|-----|-------------|-------|
| TDD (Rojo) | 35+ | 6 | 2 | 43+ |
| Implementation (Verde) | 35+ | 6 | 2 | 43+ |
| QA/Manual | - | ✓ | - | 18 test cases |

### Timeline
| Actividad | Duración | Responsable |
|-----------|----------|-------------|
| Arquitecto valida HU | 2h | Arquitecto |
| Dev implementa fase 1-2 | 1 día | Coder |
| Dev implementa fase 3-6 | 1 día | Coder |
| Tests E2E + manual QA | 1 día | QA |
| Security review | 1h | Security |
| DevOps validation | 30min | DevOps |
| Code review + merge | 1h | Tech Lead |
| **Total** | **5 días** | **Equipo** |

---

## 🚀 COMANDOS DE EJECUCIÓN

### Desarrollo Local
```bash
# 1. Start backend + services
docker-compose up -d

# 2. Frontend - Install deps
npm install

# 3. Start dev server
npm run dev

# 4. Watch tests
npm test -- --watch

# 5. E2E tests
npx playwright test e2e/cart-confirmation.spec.ts
```

### QA Execution
```bash
# Manual testing dashboard
npm run dev

# Open e2e report
npx playwright show-report

# Accessibility scan
npm run accessibility-audit

# Performance lighthouse
npm run lighthouse:test
```

### Security Check
```bash
# Dependency audit
npm audit

# Code security scan (si disponible)
npm run security

# Manual code review
# → Use IRIS-PROMPTS-BY-ROLE.md "PROMPT PARA SECURITY REVIEW"
```

---

## 📞 CONTACTOS Y ESCALONAMIENTO

### Bloqueadores
- Backend endpoints no funcionales → Backend Team (Day 1)
- AuthContext no listo → Arch Team
- RabbitMQ issues → DevOps Team
- TypeScript errors → Tech Lead

### Preguntas durante desarrollo
- "¿Cómo manejo timeout 30s?" → Ver CA-10 en HU
- "¿Qué hace RabbitMQ?" → Ver T2.2 en HU
- "¿Edge case de stock?" → Ver EC-01 a EC-05 en HU
- "¿Cómo valido entrada?" → Ver Checkpoint 5 en Security prompt

### Escalamiento
- Arquitecto rechaza HU → Volver a IRIS con feedback
- Dev no puede implementar → Schedule pairing session
- QA encuentra crítico → Fix ahora, documento post-mortem
- Security tiene hallazgo → Hold merge, fix en sprint

---

## 🔄 VERSIONES Y CAMBIOS

### v1.0 (Actual - 2026-02-20)
- Generado por: IRIS
- Incluye: HU completa + prompts por rol
- Estado: Listo para desarrollo
- Change log: N/A (primera versión)

### Próximas versiones esperadas
- v1.1: Post-implementation (cambios basados en construcción real)
- v2.0: Post-QA (refinamientos después de validación)
- v3.0: Final (feedback del equipo + optimizaciones)

---

## 📖 CÓMO LEER ESTE ÍNDICE

**Si eres:**
- **Arquitecto:** Lee HU-CART-ORDER-CONFIRMATION.md → Valida con IRIS-PROMPTS (sección Arquitecto)
- **Desarrollador:** Lee IRIS-PROMPTS (sección Desarrollador) → Implementa según HU fases
- **QA/Tester:** Lee IRIS-PROMPTS (sección QA) → Ejecuta checklist + E2E
- **Security:** Lee IRIS-PROMPTS (sección Security) → Valida según checkpoints
- **DevOps:** Lee IRIS-PROMPTS (sección DevOps) → Valida infraestructura

**Si necesitas:**
- **Criterios de aceptación:** HU-CART-ORDER-CONFIRMATION.md → Sección "Criterios de Aceptación"
- **Código de tests:** HU-CART-ORDER-CONFIRMATION.md → Sección "Plan TDD"
- **Edge cases:** HU-CART-ORDER-CONFIRMATION.md → Sección "Edge Cases Críticos"
- **Prompts ejecutables:** IRIS-PROMPTS-BY-ROLE.md → Selecciona tu rol

---

## ✅ LISTA DE VERIFICACIÓN FINAL

Antes de marcar como "LISTO PARA DESARROLLO":

- [ ] HU-CART-ORDER-CONFIRMATION.md existe y es accesible
- [ ] IRIS-PROMPTS-BY-ROLE.md existe y tiene 5 prompts claros
- [ ] Criterios de aceptación CA-01 a CA-10 son medibles
- [ ] Supuestos validados con backend team
- [ ] Tests rojo escritos (no verdes aún)
- [ ] Timeline 5 días es realista para equipo
- [ ] Dependencias (AuthContext, CartContext) son viables
- [ ] Docker-compose sin cambios requeridos
- [ ] QA checklist 18 test cases completo
- [ ] Security prompts cubren OWASP top 10
- [ ] Todos los stakeholders confirmaron lectura

**Status Actual:** ✅ LISTO PARA DESARROLLO

---

**Documento:** Índice e Integración IRIS  
**Versión:** 1.0  
**Generado:** 2026-02-20  
**Siguiente acción:** Compartir con equipo → Arquitecto aprueba → Dev inicia TDD
