# Sofkify Frontend (sofkify-fe)

Frontend React + Vite para Sofkify.

- Repo BE: `https://github.com/nico-salsa/Sofkify_BE.git`
- Path local BE esperado: `C:\Sofka_U_Semana_2\Sofkify_BE`

## Requisitos

- Node.js 20+
- npm 10+
- Backend levantado (recomendado por Docker Compose desde `Sofkify_BE`)

## Configuracion local

1. Crear `.env` desde plantilla:

```powershell
cd C:\Sofka_U_Semana_2\sofkify-fe
Copy-Item .env.example .env
```

2. Instalar dependencias:

```powershell
npm ci
```

3. Ejecutar en desarrollo:

```powershell
npm run dev
```

App disponible en `http://localhost:5173`.

## Variables de entorno

- `VITE_USERS_API_URL` (default `http://localhost:8080/api`)
- `VITE_PRODUCTS_API_URL` (default `http://localhost:8081/api`)
- `VITE_CARTS_API_URL` (default `http://localhost:8083/api`)
- `VITE_ORDERS_API_URL` (default `http://localhost:8082/api`)
- `VITE_HTTP_TIMEOUT_MS` (default `10000`)

## Modo integrado con Docker (recomendado)

Desde backend:

```powershell
cd C:\Sofka_U_Semana_2\Sofkify_BE
docker compose -f docker-compose.yml -f docker-compose.integration.yml up -d --build
```

Esto levanta frontend y backend en la misma red Docker.

## Verificacion de requests HTTP reales

1. Abrir la app en `http://localhost:5173`.
2. Abrir DevTools del navegador (Console).
3. Ejecutar flujo: login, listar productos, agregar al carrito, confirmar carrito, crear orden.
4. Verificar logs frontend:
   - `[HTTP][REQ] METHOD URL`
   - `[HTTP][RES] METHOD URL -> STATUS (Nms)`
   - `[HTTP][ERR] ...` (si falla)
5. Verificar logs backend desde `Sofkify_BE`:

```powershell
docker compose -f docker-compose.yml -f docker-compose.integration.yml logs -f user-service product-service cart-service order-service
```

## Scripts utiles

- `npm run dev`: desarrollo
- `npm run build`: build de produccion
- `npm run lint`: lint
- `npx vitest run`: tests unitarios

## Troubleshooting rapido

- Si no ves requests, valida que las `VITE_*_API_URL` apunten a `localhost` con puertos `8080-8083`.
- Si hay timeout, aumenta `VITE_HTTP_TIMEOUT_MS`.
- Si aparece error CORS, valida que los servicios backend hayan levantado correctamente.
