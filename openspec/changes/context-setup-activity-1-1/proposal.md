## Why

El repositorio frontend no tenia una base formal para que Copilot respete el estilo TypeScript, separacion por capas UI/servicios y reglas de integracion con backend. Esto genera respuestas heterogeneas y riesgo de romper el contrato FE/BE.

## What Changes

- Definir y versionar un resumen arquitectonico orientado al frontend para usar con `@workspace /explain`.
- Formalizar instrucciones en `.github/copilot-instructions.md` con reglas de tipado, estructura y consumo de API.
- Asegurar que las reglas de negocio de frontera FE/BE queden explicitas para prompts futuros.

## Capabilities

### New Capabilities
- `copilot-context-setup`: Establece artefactos de contexto y lineamientos de Copilot para trabajo consistente en el frontend.

### Modified Capabilities
- Ninguna.

## Impact

- Documentacion versionada en repositorio frontend (`.github`, docs de contexto y artefactos OpenSpec).
- Menor variacion en codigo generado por IA para hooks, services y componentes.
- Sin cambios de comportamiento runtime ni rutas publicas de la aplicacion.
