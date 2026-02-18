# Copilot Instructions - Sofkify Frontend

## Project Context
- Stack: React + TypeScript + Vite + Tailwind.
- This frontend integrates with Sofkify microservices backend.
- Main structure is feature/UI oriented (`pages`, `components`, `hooks`, `services`, `types`).

## Coding Style and Structure
- Use TypeScript strictly. Avoid `any` unless there is no better option.
- Keep business/API logic in `services`, not in UI components.
- Keep reusable UI logic in `hooks`.
- Prefer small, focused components and explicit props typing.
- Keep naming consistent and intention-revealing.

## API and Data Contract Rules
- API base URL must come from `import.meta.env.VITE_API_BASE_URL`.
- Do not hardcode backend URLs in components.
- Frontend must NOT generate or mutate backend-managed fields:
  - `id`
  - `status`
  - `createdAt`
  - `updatedAt`
- Send only user-provided fields in create/update payloads.
- Keep DTO-to-domain mapping explicit in service layer when needed.
- Context-only tasks must not change runtime routes or feature behavior unless explicitly requested.

## Business Behavior Constraints
- Respect backend domain invariants in UI validations:
  - Product price > 0
  - Stock >= 0
  - Positive quantities in cart
- Do not implement payment/shipping flows unless requested.

## Quality Expectations
- Preserve existing linting rules from `eslint.config.js`.
- Keep side effects controlled (`useEffect` with clear dependencies).
- Handle async states explicitly (loading, success, error).
- Add/update tests when changing behavior in hooks/services/components.

## Integration Notes
- Current code uses mock product data in some product flows.
- If integrating a real products API, keep the same service abstraction and avoid breaking UI contracts.
- Authentication requests go through `services/auth/authApi.ts`.
