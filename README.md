# Chainlytics

Panel de criptomonedas con precios en vivo, portfolio, watchlist, convertidor y un
analista con IA.

**Demo:** https://chainlytics82-3v7y.vercel.app/

## Qué hace

**Panel** — capitalización total del mercado, volumen de 24 h, dominancia de Bitcoin y el
top 5 de monedas. Incluye el gráfico de TradingView y el histórico de Bitcoin a 6 meses.

**Mercados** — las 100 criptomonedas con mayor capitalización. Búsqueda, filtro por
monedas que suben o bajan, y orden por capitalización, volumen, cambio, precio o ranking.

**Portfolio** — registra tus compras y ventas con el precio que pagaste y ve tu ganancia
real: coste medio ponderado, ganancia sobre el papel y ganancia ya realizada al vender.
Si no recuerdas a qué precio compraste algo, la posición queda marcada **sin coste** y se
excluye del cálculo: no se inventa un número. Se guarda en tu cuenta.

**Comparar** — hasta cinco monedas en el mismo gráfico, todas partiendo de 0 %, para ver
cuál lo ha hecho mejor en el periodo que elijas. La selección va en la URL, así que la
comparación se puede compartir tal cual.

**Watchlist** — las monedas que sigues, con favoritos y orden por nombre, precio o cambio.
Se guarda en tu cuenta.

**Convertidor** — entre las 30 criptomonedas principales y cinco monedas fiat (USD, EUR,
MXN, GBP, JPY).

**Analista IA** — una Edge Function `ai-crypto-analyst` que lee los datos de mercado del
momento y responde en lenguaje llano. Se ejecuta en el servidor, así que la clave del
modelo nunca llega al navegador. Requiere iniciar sesión.

## De dónde salen los datos

Todos los precios vienen de la [API pública de CoinGecko](https://www.coingecko.com/en/api)
en el momento de la petición: no hay datos de ejemplo ni precios escritos a mano.

Toda la app comparte **una sola** consulta de mercados (`src/hooks/useMarketData.ts`), que
React Query reutiliza entre pantallas. CoinGecko limita las peticiones anónimas, así que
esto evita chocar con el límite al navegar.

La watchlist y el portfolio guardan **qué** monedas sigues y **cuánta** cantidad tienes,
nunca precios: el precio siempre es el de la API en ese momento.

Con la sesión iniciada viven en Supabase, bajo Row Level Security, y te siguen entre
dispositivos. Sin sesión se guardan en este navegador, y la primera vez que inicies sesión
se suben a tu cuenta solos. La app te dice en cada pantalla dónde se está guardando.

## Modelo de datos

Cuatro tablas en PostgreSQL, todas bajo Row Level Security, y cada usuario solo ve sus
propias filas:

| Tabla | Para qué |
|---|---|
| `profiles` | nombre visible del usuario |
| `user_roles` | rol (`user` / `admin`), que autoriza el analista IA |
| `watchlist_items` | qué monedas sigue cada usuario |
| `portfolio_transactions` | compras y ventas: cantidad, precio pagado y fecha |

Los datos de mercado no se copian a la base de datos: se leen de la API al mostrarlos.

## Stack

React 18 · TypeScript (`strict`) · Vite · Tailwind CSS · shadcn/ui · React Query · Recharts ·
Zod · Supabase (PostgreSQL, Auth, Edge Functions)

## Cómo correrlo

```bash
npm install
cp .env.example .env   # rellena los tres valores de tu proyecto Supabase
npm run dev
```

La app queda en `http://localhost:8080`.

Comprobaciones antes de subir cambios:

```bash
npx tsc --noEmit       # tipos
npm run lint           # reglas
npm run test           # los dos cálculos de abajo
npm run test:portfolio # coste y ganancia (24 comprobaciones)
npm run test:comparar  # cruce y normalización de series (17 comprobaciones)
npm run build          # que compile
```

Las pruebas usan el TypeScript nativo de Node, sin runner instalado.

El analista IA necesita, como secretos de la Edge Function en Supabase:

| Variable | Por defecto |
|---|---|
| `AI_API_KEY` | obligatoria (acepta `LOVABLE_API_KEY` por compatibilidad) |
| `AI_BASE_URL` | `https://ai.gateway.lovable.dev/v1` |
| `AI_MODEL` | `google/gemini-3-flash-preview` |

Sirve cualquier gateway compatible con la API de chat de OpenAI: para cambiar de proveedor
basta con apuntar `AI_BASE_URL` y `AI_MODEL` a otro sitio.

La demo usa [OpenRouter](https://openrouter.ai) con `nemotron-3-ultra`, configurado solo
por secretos:

```bash
supabase secrets set AI_API_KEY="sk-or-..." \
  AI_BASE_URL="https://openrouter.ai/api/v1" \
  AI_MODEL="<id del modelo en OpenRouter>"
```

El modelo tiene que emitir streaming de verdad: de los gratuitos de OpenRouter que se
probaron, varios devolvían la respuesta sin trozos o con otro formato, y el chat se queda
vacío.

## Si no hay servicio de cuentas

La app arranca igual y avisa de lo que no puede hacer, en vez de romperse:
precios, mercados, comparación y convertidor no necesitan cuenta, y la
watchlist y el portfolio se guardan en el navegador. Lo único que se apaga es
iniciar sesión, la sincronización y el analista IA. Distingue entre "faltan
las variables del `.env`" y "está configurado pero no responde", porque se
arreglan de formas distintas.

## Aviso

Es un panel educativo. No es asesoría de inversión y no ejecuta ninguna operación.
