## Context

El frontend de Sofkify usa React + TypeScript + Vite con capas `pages`, `components`, `hooks` y `services`. El equipo necesita que Copilot respete consistentemente tipado estricto, separacion UI/servicios y contrato FE/BE al usar prompts de workspace.

## Goals / Non-Goals

**Goals:**
- Consolidar un contexto arquitectonico frontend util para `@workspace /explain`.
- Definir reglas de repositorio para Copilot en `.github/copilot-instructions.md`.
- Alinear generacion de codigo con patrones del proyecto (hooks, servicios, tipos y manejo de estados async).

**Non-Goals:**
- Cambiar rutas de UI o flujo funcional de negocio existente.
- Reemplazar librerias base (React, Vite, Tailwind).
- Implementar integraciones nuevas no solicitadas.

## Decisions

1. **Versionar reglas de Copilot en `.github/copilot-instructions.md`.**
   - Rationale: evita depender de configuraciones locales del IDE y permite revision por PR.
   - Alternative considered: usar solo reglas personales; descartado por falta de consistencia de equipo.

2. **Enfatizar reglas de contrato FE/BE como parte central de instrucciones.**
   - Rationale: los mayores riesgos actuales estan en campos backend-managed y base URL.
   - Alternative considered: guia de estilo generica; descartado por no cubrir riesgos de integracion.

3. **Mantener alcance de contexto sin cambios runtime.**
   - Rationale: la actividad busca preparar implementacion, no alterar funcionalidades.
   - Alternative considered: incluir refactors funcionales; descartado para mantener bajo riesgo.

## Risks / Trade-offs

- [Riesgo] Copilot puede ignorar parcialmente instrucciones en prompts ambiguos. -> **Mitigation**: prompts del equipo deben referenciar explicitamente el archivo de instrucciones.
- [Riesgo] Reglas de contrato pueden quedar obsoletas si backend evoluciona. -> **Mitigation**: actualizar instrucciones al cambiar DTOs o endpoints.
- [Trade-off] Documentacion adicional a mantener. -> **Mitigation**: reglas compactas, enfocadas en decisiones de mayor impacto.

## Migration Plan

1. Agregar documento de resumen arquitectonico frontend y reglas de Copilot.
2. Validar uso del contexto en chat con `@workspace /explain`.
3. Versionar cambios y socializar lineamientos con el equipo de frontend.
4. Iterar reglas segun feedback en siguiente ciclo.

## Open Questions

- Se debe incorporar una seccion de ejemplos de payloads validados para auth/products?
- Conviene definir una checklist minima para cambios asistidos por Copilot antes de merge?
