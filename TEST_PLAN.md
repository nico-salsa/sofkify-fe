# TEST PLAN - Sofkify Frontend (Teorico)

## 1. Objetivo
Definir casos teoricos para nuevas funcionalidades en `sofkify-fe`, aplicando ISTQB y tecnicas de diseno de pruebas.

## 2. Principio ISTQB priorizado
- Principal: 6 (depende del contexto).
- Complementarios: 7 (utilidad) y 5 (variacion de pruebas).

## 3. Tecnicas aplicadas
- Particion de equivalencia.
- Valores limite.
- Tabla de decision.

## 4. Caso base Auth (`src/pages/Auth/authIssue.md`)
| ID | Criterio | Tecnica | Datos | Esperado | Prioridad |
|---|---|---|---|---|---|
| FE-AU-01 | Email requerido | Equivalencia invalida | email vacio | error y no submit | Alta |
| FE-AU-02 | Password requerido | Equivalencia invalida | password vacio | error y no submit | Alta |
| FE-AU-03 | Formato email | Limite/Equivalencia | valido vs invalido | solo valido permite submit | Alta |
| FE-AU-04 | Login exitoso | Equivalencia valida | credenciales validas | redirige `/` | Alta |
| FE-AU-05 | Login fallido | Equivalencia invalida | credenciales invalidas | muestra error backend | Alta |
| FE-AU-06 | Cambio login/register | Tabla decision | estado + accion | cambia modo y limpia estado | Media |

## 5. Caso base Product Detail (`src/pages/Product/product-individual.md`)
| ID | Criterio | Tecnica | Datos | Esperado | Prioridad |
|---|---|---|---|---|---|
| FE-PD-01 | Carga por ID | Equivalencia valida | id existente | render correcto | Alta |
| FE-PD-02 | Error por ID | Equivalencia invalida | id inexistente | estado error visible | Alta |
| FE-PD-03 | Agregar con stock | Limites | stock=1 | agrega y confirma | Alta |
| FE-PD-04 | Agregar sin stock | Limites | stock=0 | bloquea accion | Alta |
| FE-PD-05 | Comprar ahora | Tabla decision | stock + click | agrega y redirige `/cart` | Alta |
| FE-PD-06 | Responsive mobile | Equivalencia contexto | viewport 375px | layout mobile correcto | Media |

## 6. Checklist rapido por nueva HU
- [ ] Todos los criterios de aceptacion estan mapeados.
- [ ] Hay casos validos, invalidos y de borde.
- [ ] Se cubren loading, error y success.
- [ ] Se valida navegacion y redireccion.
- [ ] Se validan mensajes de feedback al usuario.

## 7. Criterio de salida
- 100% criterios de aceptacion con casos teoricos definidos.
- Casos criticos priorizados en Alta.
- Trazabilidad HU -> criterio -> caso.
