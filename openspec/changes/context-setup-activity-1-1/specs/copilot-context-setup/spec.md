## ADDED Requirements

### Requirement: Frontend repository SHALL provide architecture context for workspace explanations
The frontend repository SHALL include a maintained architecture summary that describes project structure, integration points, and FE/BE contract constraints for `@workspace /explain`.

#### Scenario: Developer asks for frontend architecture in workspace chat
- **WHEN** a developer requests `@workspace /explain` in the frontend repository
- **THEN** the available context MUST describe stack, layer boundaries (`pages/components/hooks/services/types`), and current API integration assumptions

### Requirement: Frontend repository SHALL define Copilot coding guardrails
The frontend repository SHALL provide `.github/copilot-instructions.md` with explicit rules for TypeScript usage, separation of concerns, and API consumption.

#### Scenario: Copilot proposes frontend code updates
- **WHEN** Copilot generates code for frontend files
- **THEN** suggestions MUST favor typed models, service-layer API calls, and explicit async state handling

### Requirement: Frontend guidance MUST preserve FE/BE boundary rules
Repository guidance MUST enforce that frontend code does not generate backend-managed fields and does not hardcode backend URLs in components.

#### Scenario: Feature request includes create or update payloads
- **WHEN** developers or Copilot implement payload building in frontend code
- **THEN** payloads MUST include only user-provided fields and MUST exclude backend-managed fields (`id`, `status`, `createdAt`, `updatedAt`)
