# Workspace Explain Summary - Sofkify Frontend

## Scope
- Repository: `sofkify-fe`
- Stack: React 19, TypeScript, Vite 7, Tailwind CSS 4
- Goal: keep AI-assisted changes consistent with architecture and FE/BE boundaries

## Project Structure (High Level)
- `src/pages`: route-level views
- `src/components`: reusable UI units
- `src/hooks`: reusable stateful logic
- `src/services`: API access and data transformation
- `src/types`: DTOs and domain-facing TypeScript models

## Integration Boundaries
- API base URL is environment-driven:
  - `VITE_API_BASE_URL`
- Authentication requests are handled via:
  - `src/services/auth/authApi.ts`
- Some product flows currently use mock data in service layer and must preserve service abstraction.

## Frontend Guardrails
- Keep strict typing and avoid unbounded `any`.
- Keep API logic in `services`, not in components.
- Keep side effects explicit and controlled in hooks/components.
- Handle async flows with loading/error/success states.

## FE/BE Contract Rules
- Frontend MUST NOT generate backend-managed fields:
  - `id`
  - `status`
  - `createdAt`
  - `updatedAt`
- Payloads MUST include only user-provided fields.
- Backend URLs MUST NOT be hardcoded in components.

## Context-Only Change Constraints
- This context setup does not change runtime behavior.
- This context setup does not change routes or UI contracts by itself.
- This context setup does not introduce new business capabilities.
