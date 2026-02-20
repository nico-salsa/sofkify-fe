# Copilot Agents Usage

Estos agentes estan definidos en `.github/agents/*.agent.md` para que aparezcan en el selector de agentes/modos de Copilot Chat en VS Code.

## Agentes creados

- `iris-requirements`
- `product-owner`
- `architect`
- `tech-lead`
- `coder`
- `qa`
- `reviewer`
- `security`
- `devops`

## Flujo sugerido (end-to-end)

1. `iris-requirements`: convertir requerimiento en TOON.
2. `product-owner`: prioridad + criterios de aceptacion.
3. `architect`: diseno tecnico y tradeoffs.
4. `coder`: implementacion.
5. `qa`: pruebas y cobertura de riesgo.
6. `reviewer`: code review final.
7. `security`: validacion de seguridad (si aplica).
8. `devops`: ajustes de despliegue/CI (si aplica).
9. `tech-lead`: consolidar decision final y plan de entrega.

## Nota

Si tu version de Copilot aun usa modos legacy, los `.chatmode.md` pueden seguir funcionando.
En versiones recientes de VS Code + Copilot, el formato recomendado es `.agent.md`.

