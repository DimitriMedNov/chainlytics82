# Arquitectura del front de Chainlytics

El front está ordenado por capas (Clean Architecture) con puertos y adaptadores
(arquitectura hexagonal: la app define **interfaces** de lo que necesita de fuera —los
puertos— y hay piezas intercambiables que las cumplen —los adaptadores—). Dentro de cada
capa, el código va **por funcionalidad**.

> Estado: las capas de abajo son la base del front nuevo (`src/ui/`). La interfaz anterior
> (`src/components`, `src/pages`, `src/contexts`, `src/lib`, `src/types`, los hooks planos
> de `src/hooks/*.ts`, `src/App.tsx`) sigue en su sitio, congelada, hasta que se retire.
> Nada del front nuevo la importa.

## 1. Capas y regla de dependencias

Las dependencias apuntan hacia dentro. Nada de dentro conoce lo de fuera.

```text
src/domain/<f>/          Tipos y reglas puras: validaciones, cálculos, estados permitidos.
                         No importa React, ni librerías, ni ninguna otra capa.
src/application/<f>/     Casos de uso (una función por acción del usuario) y puertos
                         (interfaces de lo que se necesita de fuera).
                         Importa solo de domain. Única librería permitida: zod.
src/infrastructure/<f>/  Adaptadores: cliente HTTP, Supabase, almacenamiento del navegador.
                         Implementan los puertos y traducen con mappers (DTO -> dominio).
                         Importa de application y domain. No conoce React.
src/app/                 Composition root: el ÚNICO sitio donde se crean los adaptadores
                         concretos, se lee import.meta.env y se entregan a los casos de uso.
src/hooks/<f>/           Hooks use*: piden los casos de uso con useDeps() y guardan el estado
                         de servidor con react-query. No importan infrastructure.
src/ui/                  Interfaz. Recibe datos y callbacks; usa los hooks. Sin fetch ni URLs.
```

Quién puede importar de quién (una fila importa de las columnas marcadas):

| Capa | domain | application | infrastructure | `@/integrations` | app | hooks/`<f>` | ui | lo viejo |
|---|---|---|---|---|---|---|---|---|
| `domain` | sí | no | no | no | no | no | no | no |
| `application` | sí | sí | no | no | no | no | no | no |
| `infrastructure` | sí | sí | sí | sí | no | no | no | no |
| `app` | sí | sí | sí | sí | sí | sí | sí | no |
| `hooks/<f>` | sí | sí | no | no | sí (`useDeps`) | sí | no | no |
| `ui` | sí | sí | no | no | sí | sí | sí | no |

Reglas duras:

- `fetch`, URLs, `import.meta.env`, `localStorage` y Supabase solo aparecen en
  `src/infrastructure` y `src/app`. (`src/integrations/supabase/client.ts` es el cliente
  generado: se queda donde está y solo lo importan `infrastructure` y `app`.)
- Lo que devuelve la API (DTO) no llega a la interfaz: pasa por un mapper.
- Las reglas de negocio no viven en el JSX ni en un hook: van a `domain` o a un caso de uso.
- Un caso de uso recibe sus puertos por parámetro; nunca importa un adaptador.

"Lo viejo" es: `src/types`, `src/contexts`, `src/components`, `src/pages`, `src/App.tsx`,
`src/main.tsx`, de `src/lib` los archivos `analystStream`, `backendStatus`, `coingecko`,
`compareMath`, `format` y `portfolioMath`, y de `src/hooks` los hooks planos de la interfaz
anterior (`useMarketData`, `useWatchlist`, `usePortfolio`, `use-toast`, etc.). En `src/lib`
y `src/hooks` conviven con utilidades del front nuevo que sí se pueden usar
(`@/lib/utils`, `@/lib/get-strict-context`, `@/hooks/use-controlled-state`...).

## 2. Carpetas por funcionalidad

```text
src/
├─ domain/
│  ├─ shared/      result.ts · money.ts · userAmount.ts · range.ts
│  ├─ market/      coin.ts (Coin, GlobalMarket, PricePoint, CoinSearchResult, findCoin) · fiat.ts ·
│  │               search.ts (límites de la búsqueda)
│  ├─ session/     session.ts (SessionUser, AuthSession, AccountServiceStatus) · access.ts
│  ├─ watchlist/   entries.ts (WatchlistEntry, joinWithMarket, validación, migración)
│  ├─ portfolio/   types.ts · transactions.ts · accumulate.ts · positions.ts · summary.ts
│  └─ theme/       theme.ts
├─ application/
│  ├─ shared/      errors.ts (ApiError, RepositoryError) · ports.ts · presentation/format.ts
│  ├─ market/      ports.ts (MarketDataPort) · useCases.ts · presentation/pricePointLabels.ts
│  ├─ session/     ports.ts (AuthPort, AccountServicePort) · credentials.ts · useCases.ts
│  ├─ watchlist/   ports.ts (WatchlistRepository) · useCases.ts
│  ├─ portfolio/   ports.ts (PortfolioRepository) · useCases.ts
│  ├─ sync/        migrateLocalData.ts (caso de uso + AccountImportPort)
│  └─ theme/       ports.ts · themeController.ts
├─ infrastructure/
│  ├─ shared/      localStorageStore.ts · browserStorage.ts · supabaseDb.ts
│  ├─ market/      CoinGeckoMarketData.ts · httpJson.ts · dto.ts · mappers.ts
│  ├─ session/     SupabaseAuth.ts · AccountServiceHealth.ts
│  ├─ watchlist/   LocalWatchlistRepository.ts · SupabaseWatchlistRepository.ts
│  ├─ portfolio/   LocalPortfolioRepository.ts · SupabasePortfolioRepository.ts
│  ├─ sync/        SupabaseAccountImport.ts
│  └─ theme/       LocalStorageThemePreference.ts · MatchMediaSystemTheme.ts
├─ app/
│  ├─ AppProviders.tsx   proveedor raíz: react-query + dependencias + sesión
│  ├─ container.ts       junta todos los módulos (tipo Deps)
│  ├─ base.ts            lo compartido (tipo BaseDeps)
│  ├─ deps.ts            contexto + useDeps()
│  ├─ env.ts             lectura de import.meta.env
│  ├─ queryClient.ts     opciones de react-query
│  └─ modules/           un archivo por funcionalidad
│     ├─ market.ts · session.ts · watchlist.ts · portfolio.ts · sync.ts · theme.ts
│     └─ markets.ts · portfolio-screen.ts · compare.ts · converter.ts · analyst.ts ·
│        search.ts · watchlist-screen.ts · panel.ts · coin-detail.ts · auth-screen.ts
│        (módulos de pantalla; sus carpetas están en «Carpetas por pantalla», abajo)
└─ hooks/
   ├─ market/      useMarketData.ts · marketQueries.ts
   ├─ session/     SessionProvider.tsx · SessionContext.ts · useSession.ts · useCredentialsAuth.ts
   ├─ watchlist/   useWatchlist.ts · useWatchlistMutations.ts
   ├─ portfolio/   usePortfolio.ts · usePortfolioMutations.ts
   ├─ sync/        useLocalDataSync.ts
   └─ theme/       useTheme.ts · useThemeClass.ts
```

### Carpetas por pantalla

Cada pantalla tiene además sus propias carpetas, con el mismo nombre que su módulo de
`src/app/modules/`. Solo existen en las capas donde la pantalla las necesita (por eso no
todas tienen `infrastructure`). Las pruebas van en `__pruebas__/` dentro de cada una.

```text
auth-screen/   — Acceso (/auth) · módulo src/app/modules/auth-screen.ts
  domain:         form.ts · mode.ts
  application:    fieldErrors.ts · presentation/texts.ts · submitOutcome.ts
  hooks:          useAuthScreen.ts
markets/   — Mercados (/markets) · módulo src/app/modules/markets.ts
  domain:         charts.ts · filters.ts · listing.ts · sorting.ts
  application:    presentation/texts.ts
  hooks:          useCoinDetailSelection.ts · useMarketFilters.ts
portfolio-screen/   — Portfolio (/portfolio) · módulo src/app/modules/portfolio-screen.ts
  domain:         gain.ts · screenState.ts · series.ts · setCost.ts · transactionForm.ts ·
                  transactionRows.ts
  application:    messages.ts · ports.ts · useCases.ts
  hooks:          usePortfolioScreen.ts · useSetCostForm.ts · useTransactionForm.ts
compare/   — Comparar (/comparar) · módulo src/app/modules/compare.ts
  domain:         charts.ts · selection.ts · series.ts · status.ts
  application:    presentation/labels.ts · presentation/texts.ts · useCases.ts
  hooks:          useCompareScreen.ts · useCompareSelection.ts · useComparison.ts
converter/   — Convertidor (/converter) · módulo src/app/modules/converter.ts
  domain:         blocks.ts · conversion.ts · convertible.ts · quick.ts
  application:    ports.ts · presentation/conversionText.ts · useCases.ts
  infrastructure: NavigatorClipboard.ts
  hooks:          useConverter.ts · useConverterForm.ts · useConvertibles.ts
analyst/   — Analista IA · módulo src/app/modules/analyst.ts
  domain:         chat.ts · intro.ts · message.ts
  application:    errors.ts · ports.ts · useCases.ts
  infrastructure: AnalystStreamClient.ts · sseText.ts
  hooks:          useAnalystChat.ts · useAnalystIntro.ts · useAnalystPanel.ts
search/   — Buscador global · módulo src/app/modules/search.ts
  domain:         rules.ts · shortcut.ts
  application:    messages.ts · ports.ts · useCases.ts
  infrastructure: NavigatorPlatform.ts
  hooks:          SearchContext.ts · SearchProvider.tsx · index.ts · useDebounced.ts ·
                  useGlobalSearch.ts · useSearch.ts · useSearchPalette.ts ·
                  useSearchShortcutHint.ts · useSelectedCoin.ts
watchlist-screen/   — Watchlist (/watchlist) · módulo src/app/modules/watchlist-screen.ts
  domain:         chart.ts · counter.ts · sort.ts · status.ts · view.ts
  application:    actions.ts · buildView.ts · texts.ts
  hooks:          screenState.ts · useWatchlistDetail.ts · useWatchlistScreen.ts ·
                  useWatchlistSort.ts
panel/   — Panel (/) · módulo src/app/modules/panel.ts
  domain:         bitcoinChart.ts · blockStatus.ts · marketFigures.ts · topCoins.ts
  application:    advancedChart.ts · ports.ts · presentation/marketStats.ts ·
                  presentation/texts.ts · presentation/topCoinRows.ts
  infrastructure: TradingViewAdvancedChart.ts
  hooks:          useBitcoinHistory.ts · useMarketStats.ts · useTopCoins.ts ·
                  useTradingViewWidget.ts
coin-detail/   — Modal de detalle de moneda · módulo src/app/modules/coin-detail.ts
  domain:         figures.ts · priceSeries.ts
  application:    ports.ts · presentation/coinDetailView.ts · presentation/texts.ts ·
                  useCases.ts
  hooks:          useCoinDetail.ts · useCoinDetailChart.ts
```

Las pantallas construyen sobre lo compartido (`market`, `session`, `watchlist`,
`portfolio`), nunca al revés.

La guía de uso de los hooks compartidos (qué devuelve cada uno y a qué hook anterior
sustituye) está en `.claude/viernes/GUIA-HOOKS.md`, con un índice al final hacia la guía de
cada pantalla (`.claude/viernes/guias/*.md`).

## 3. Cómo se monta

`src/app/AppProviders.tsx` es el proveedor raíz de datos. Va por fuera del router y de los
proveedores visuales:

```tsx
import { AppProviders } from "@/app/AppProviders";

<AppProviders>
  {/* proveedor visual de tema (llama a useThemeClass()), tooltips, avisos, router, rutas */}
</AppProviders>
```

Dentro crea, una sola vez: el cliente de react-query (`retry: 1`,
`refetchOnWindowFocus: false`, `networkMode: "always"` en consultas y mutaciones), el
contenedor de dependencias (`createContainer(readEnv())`) y el proveedor de sesión.
Para pruebas acepta `deps` y `queryClient` por props.

Dos hooks hay que llamarlos una vez en el armazón, porque no se montan solos:

- `useLocalDataSync(onMigrated)` (`@/hooks/sync/useLocalDataSync`): sube a la cuenta los
  datos locales al iniciar sesión. El aviso lo enseña quien llama, con el texto de
  `migratedMessage(n)` de `@/application/sync/migrateLocalData`.
- `useThemeClass()` (`@/hooks/theme/useThemeClass`): pone `light`/`dark` en `<html>`.

## 4. Cómo añadir una funcionalidad nueva

Ejemplo: `alerts` (avisos de precio).

1. **Dominio.** Crea `src/domain/alerts/alert.ts` con los tipos y las reglas puras.
   Imports relativos con extensión: `import type { Coin } from "../market/coin.ts";`.
   Nada de React ni librerías.
2. **Puerto.** Crea `src/application/alerts/ports.ts` con la interfaz de lo que necesitas de
   fuera (`AlertsRepository`).
3. **Casos de uso.** Crea `src/application/alerts/useCases.ts`: una función por acción, que
   recibe el puerto como primer parámetro. Las acciones que pueden fallar por un motivo
   previsto devuelven `Result` (`@/domain/shared/result`); las lecturas para react-query
   lanzan `ApiError` o `RepositoryError`.
4. **Adaptador.** Crea `src/infrastructure/alerts/SupabaseAlertsRepository.ts` que
   implementa el puerto. Define ahí el DTO (la fila tal como llega) y su mapper `toAlert`.
   Recibe el cliente por parámetro (`SupabaseDb`), no lo importa.
5. **Composition root.** Crea `src/app/modules/alerts.ts` con
   `export function createAlertsModule(base: BaseDeps) { ... }`: crea el adaptador y devuelve
   los casos de uso ya conectados. Añade una línea en `src/app/container.ts`:
   `alerts: createAlertsModule(base),`.
6. **Hook.** Crea `src/hooks/alerts/useAlerts.ts`: `const { alerts } = useDeps();` y
   react-query (`useQuery` / `useMutation`). Sin `fetch`, sin Supabase.
7. **Interfaz.** En `src/ui/`, un componente contenedor llama al hook y pasa datos y
   callbacks por props a los componentes que pintan.
8. **Pruebas.** Lo puro y delicado, en `src/domain/alerts/__pruebas__/alerts.prueba.ts`,
   con el mismo `check()` casero que las demás.
9. **Comprueba** con los cuatro comandos de la sección 5.

Convención de imports: en `domain` y `application`, rutas relativas con extensión `.ts`
(así las pruebas se ejecutan con Node sin compilar, que no entiende el alias `@/`). En
`infrastructure`, `app`, `hooks` y `ui`, el alias `@/`.

## 5. Cómo se comprueba

| Qué | Comando |
|---|---|
| Regla de dependencias (script, Node puro) | `node scripts/check-architecture.mjs` |
| Regla de dependencias (lint) + resto de lint | `npm run lint` |
| Tipos | `npm run typecheck` |
| Pruebas (`*.prueba.ts`, sin runner) | `node scripts/run-pruebas.mjs` |

- `scripts/check-architecture.mjs` recorre `src/{domain,application,infrastructure,app,ui}`
  y `src/hooks/<f>/`, resuelve cada import (alias `@/` y rutas relativas) y falla con
  código 1 si una capa importa de donde no debe, si usa un paquete que no le toca, o si
  `fetch`, `localStorage`, `sessionStorage` o `import.meta.env` aparecen fuera de
  `infrastructure` y `app`. Lista cada violación como `archivo:línea  motivo`.
- El mismo script falla si hay una URL escrita a mano (`http://` o `https://`) en
  `src/domain` o `src/application`. No cuentan los comentarios ni las pruebas
  (`__pruebas__/`). En `hooks` y `ui` no se busca con este patrón porque los SVG llevan
  `xmlns="http://www.w3.org/2000/svg"`; ahí lo vigila la revisión. Ejemplo: las dos
  direcciones de TradingView (script y `support_host`) están en
  `src/infrastructure/panel/TradingViewAdvancedChart.ts`, que añade `support_host` a la
  configuración que le llega de `application/panel/advancedChart.ts`.
- `eslint.config.js` aplica lo mismo con `no-restricted-imports` por carpetas (bloque
  `limitesDeCapas`), para verlo en el editor mientras se escribe.
- Las pruebas se ejecutan con `node --experimental-strip-types` (Node 22.6 o superior).

## 6. Patrones de diseño y dónde están

### Base

| Patrón | Dónde |
|---|---|
| Ports & Adapters | **Compartidos:** `MarketDataPort` (`src/application/market/ports.ts`) ↔ `src/infrastructure/market/CoinGeckoMarketData.ts`. `AuthPort` y `AccountServicePort` (`src/application/session/ports.ts`) ↔ `src/infrastructure/session/SupabaseAuth.ts` y `AccountServiceHealth.ts`. **De pantalla:** `PlatformPort` (`src/application/search/ports.ts`) ↔ `src/infrastructure/search/NavigatorPlatform.ts`. `ClipboardPort` (`src/application/converter/ports.ts`) ↔ `src/infrastructure/converter/NavigatorClipboard.ts`. `AdvancedChartWidgetPort` (`src/application/panel/ports.ts`) ↔ `src/infrastructure/panel/TradingViewAdvancedChart.ts`. `AnalystStreamPort` (`src/application/analyst/ports.ts`) ↔ `src/infrastructure/analyst/AnalystStreamClient.ts`. **Cumplidos por un hook, no por infraestructura:** `PortfolioActionsPort` (`src/application/portfolio-screen/ports.ts`), que entrega `src/hooks/portfolio-screen/usePortfolioScreen.ts`, y `WatchlistTogglePort` (`src/application/coin-detail/ports.ts`), que cumple `useWatchlist()`. |
| Repository | `WatchlistRepository` en `src/application/watchlist/ports.ts`, implementado en `src/infrastructure/watchlist/LocalWatchlistRepository.ts` y `SupabaseWatchlistRepository.ts`. `PortfolioRepository` en `src/application/portfolio/ports.ts`, implementado en `src/infrastructure/portfolio/LocalPortfolioRepository.ts` y `SupabasePortfolioRepository.ts`. |
| Use Case | **Compartidos:** `src/application/market/useCases.ts`, `session/useCases.ts` (`signIn`, `signUp`, `signOut`), `watchlist/useCases.ts`, `portfolio/useCases.ts`, `sync/migrateLocalData.ts`. **De pantalla:** `askAnalyst` (`src/application/analyst/useCases.ts`); `copyResult` (`converter/useCases.ts`); `parseTransactionForm`, `parseCostForm`, `registerTransaction`, `removeTransaction`, `setPositionCost` (`portfolio-screen/useCases.ts`); `compareCoins` (`compare/useCases.ts`); `toggleCoinWatchlist`, `convertFromDetail` (`coin-detail/useCases.ts`); `createSearchUseCases` (`search/useCases.ts`); `buildWatchlistView` (`watchlist-screen/buildView.ts`) y `removedNotice`, `convertIntent` (`watchlist-screen/actions.ts`); `authSubmitOutcome` (`auth-screen/submitOutcome.ts`); `createPanelUseCases` (`panel/advancedChart.ts`). |
| Dependency Injection + Composition Root | `src/app/container.ts` y `src/app/base.ts` montan; `src/app/modules/*.ts` crea cada adaptador y lo entrega a sus casos de uso (16 módulos: 6 compartidos y 10 de pantalla); `src/app/deps.ts` (`useDeps`) lo reparte a los hooks; `src/app/AppProviders.tsx` lo pone en React. El entorno entra solo por `createContainer(env)`. |
| DTO + Mapper | `src/infrastructure/market/dto.ts` + `mappers.ts` (`toCoin`, `toGlobalMarket`, `toPricePoints`, `toFiatRates`, `toSearchResults`). `WatchlistRowDto` + `toWatchlistEntry` en `SupabaseWatchlistRepository.ts`. `TransactionRowDto` + `toTransaction` en `SupabasePortfolioRepository.ts`. `toAuthSession` en `SupabaseAuth.ts`. Analista: `AnalystRequestDto` (cuerpo de la petición) en `src/infrastructure/analyst/AnalystStreamClient.ts`, y la lectura de la respuesta por trozos (`deltaDe`, `createSseTextParser`) en `src/infrastructure/analyst/sseText.ts`. |
| Result | Tipo en `src/domain/shared/result.ts`. **Compartidos:** `parseCredentials` (`src/application/session/credentials.ts`), `signIn`/`signUp`/`signOut` (`session/useCases.ts`), `AuthPort.signInWithPassword`/`signUp`, `AccountImportPort` (`sync/migrateLocalData.ts`), `positiveAmount`/`optionalNonNegativeAmount` (`src/domain/shared/userAmount.ts`). **De pantalla:** `askAnalyst` → `Result<AskAnalystOutcome, AnalystError>` (`src/application/analyst/useCases.ts`); `copyResult` → `Result<void, NoticeText>` (`converter/useCases.ts`); `parseTransactionForm` → `Result<NewTransaction, string>` y `parseCostForm` → `Result<number, string>` (`portfolio-screen/useCases.ts`); `authSubmitOutcome` lo recibe (`auth-screen/submitOutcome.ts`). |
| Custom Hook | **Compartidos:** `src/hooks/market/useMarketData.ts`, `session/useSession.ts`, `session/useCredentialsAuth.ts`, `watchlist/useWatchlist.ts`, `portfolio/usePortfolio.ts`, `sync/useLocalDataSync.ts`, `theme/useTheme.ts`. **Uno por pantalla como entrada:** `src/hooks/auth-screen/useAuthScreen.ts`, `markets/useMarketFilters.ts`, `portfolio-screen/usePortfolioScreen.ts`, `compare/useCompareScreen.ts`, `converter/useConverter.ts`, `analyst/useAnalystPanel.ts` y `useAnalystChat.ts`, `search/useGlobalSearch.ts`, `watchlist-screen/useWatchlistScreen.ts`, `panel/useMarketStats.ts`, `useTopCoins.ts`, `useBitcoinHistory.ts` y `useTradingViewWidget.ts`, `coin-detail/useCoinDetail.ts`. |
| Container / Presentational | **Pendiente de interfaz.** En `src/ui/`: un contenedor por pantalla o bloque llama al hook de la pantalla y entrega datos y callbacks a componentes que solo pintan (los que sirven para los 4 estados). |

### Según el caso

| Patrón | Por qué aquí | Dónde |
|---|---|---|
| Strategy | Una regla con variantes que se eligen por clave, sin `if` ni `switch`. | **Dónde se guarda:** las dos implementaciones de `WatchlistRepository` (`src/infrastructure/watchlist/`) y de `PortfolioRepository` (`src/infrastructure/portfolio/`), usadas sin distinción en `src/hooks/watchlist/useWatchlistMutations.ts` y `src/hooks/portfolio/usePortfolioMutations.ts`. **Orden de Mercados:** `MARKET_COMPARATORS` en `src/domain/markets/sorting.ts` (lo aplica `sortCoins`). **Filtro de Mercados:** `MARKET_FILTER_PREDICATES` en `src/domain/markets/filters.ts` (lo aplica `filterCoins`). **Orden de la Watchlist:** `SORT_COMPARATORS` en `src/domain/watchlist-screen/sort.ts` (lo aplica `sortCoins`, llamado desde `src/application/watchlist-screen/buildView.ts`). |
| Factory | Un solo sitio decide qué repositorio toca según haya sesión. | `repositoryFor(userId)` en `src/app/modules/watchlist.ts` y `src/app/modules/portfolio.ts`. |
| State (máquina de estados) | Decisiones de "qué se enseña ahora" que antes eran ternarios repetidos o banderas sueltas. | **Acceso:** `resolveAccess` en `src/domain/session/access.ts`; se calcula en `src/hooks/session/SessionProvider.tsx` y se lee como `useSession().access`. **Chat del analista** (`idle` → `waiting` → `streaming` → `error`): `chatReducer` en `src/domain/analyst/chat.ts`, usado en `src/hooks/analyst/useAnalystChat.ts`. **Intro del analista:** `resolveAnalystIntro` en `src/domain/analyst/intro.ts`, usado en `src/hooks/analyst/useAnalystIntro.ts`. **Pantalla de acceso:** `resolveAuthScreenMode` en `src/domain/auth-screen/mode.ts`, usado en `src/hooks/auth-screen/useAuthScreen.ts`. **Estados de bloque** (cargando, error, vacío, listo) como funciones puras: `src/domain/search/rules.ts` (`resolveSearchStatus`), `src/domain/watchlist-screen/status.ts`, `src/domain/compare/status.ts`, `src/domain/converter/blocks.ts`, `src/domain/panel/blockStatus.ts`, `src/domain/portfolio-screen/screenState.ts`. |
| Observer | Varias pantallas leen y escriben lo mismo y tienen que verlo igual. | Puerto `ObservableStore` en `src/application/shared/ports.ts`; implementación `src/infrastructure/shared/localStorageStore.ts`; suscripción con `useSyncExternalStore` en `src/hooks/watchlist/useWatchlist.ts` y `src/hooks/portfolio/usePortfolio.ts`. También `src/application/theme/themeController.ts` (leído en `src/hooks/theme/useTheme.ts`) y `AuthPort.onSessionChange`. |
| Facade | Esconder algo de fuera tras una interfaz propia y pequeña. | `MarketDataPort` (`src/application/market/ports.ts`) sobre los seis endpoints de CoinGecko, en `src/infrastructure/market/CoinGeckoMarketData.ts`. `AdvancedChartWidgetPort` (`src/application/panel/ports.ts`) sobre el script de TradingView, en `src/infrastructure/panel/TradingViewAdvancedChart.ts`. |
| Value Object | Datos con reglas propias que se comprobaban a mano. | **Dinero en USD que puede ser desconocido:** `src/domain/shared/money.ts`, usado en `src/domain/portfolio/positions.ts` y en `src/domain/portfolio-screen/gain.ts`, `series.ts` y `transactionRows.ts`. **Cantidad escrita por el usuario:** `src/domain/shared/userAmount.ts`, usado en `src/domain/converter/conversion.ts`, `src/domain/portfolio-screen/transactionForm.ts` y `src/domain/portfolio-screen/setCost.ts`. **Rango de la gráfica (`RangeDays`):** `src/domain/shared/range.ts`, usado en `src/domain/coin-detail/priceSeries.ts`, `src/domain/panel/bitcoinChart.ts`, `src/hooks/coin-detail/useCoinDetailChart.ts`, `src/hooks/compare/useCompareScreen.ts` y `src/hooks/panel/useBitcoinHistory.ts`. **Credenciales válidas:** `Credentials` en `src/application/session/credentials.ts`, usado en `session/useCases.ts`. |
| Adapter de componente | Envolver un componente de fuera tras props propias. | **Pendiente de interfaz.** La parte de datos ya está: el widget de TradingView se monta por `AdvancedChartWidgetPort` desde `src/hooks/panel/useTradingViewWidget.ts`. Falta el envoltorio visual en `src/ui/` (el del widget y los de las gráficas de Bklit en `src/ui/charts/`). |
| Compound Components | Componentes con partes que se combinan. | **Pendiente de interfaz.** Sitio previsto: secciones y filas de la Watchlist y la fila de posición del Portfolio, en `src/ui/`. |

No se usa Decorator: el tope de tiempo y la traducción de errores de la API de precios ya
están en un solo sitio (`src/infrastructure/market/httpJson.ts`).

## 7. Decisiones

- **Formateadores** (`formatCurrency`, `formatCompact`, `formatPercent`...): están en
  `src/application/shared/presentation/format.ts`. No son dominio: fijan idioma (`es-ES`),
  símbolo y textos ("billones", "No disponible"). La interfaz los importa de ahí.
- **Etiquetas de fecha del histórico**: `PricePoint` de dominio es `{ timestamp, price }`.
  Las etiquetas del eje y del tooltip las pone `labelPricePoints`
  (`src/application/market/presentation/pricePointLabels.ts`); `usePriceHistory` ya las
  devuelve puestas.
- **zod en `application`**: permitido solo para validar lo que escribe el usuario
  (`src/application/session/credentials.ts`). `domain` no usa ninguna librería.
- **Lecturas que lanzan, acciones que devuelven `Result`**: react-query necesita la
  excepción para su estado de error, así que los puertos de lectura lanzan `ApiError` /
  `RepositoryError` con el mensaje ya en español. Las acciones del usuario con fallo
  previsto (entrar, registrarse, validar una cantidad) devuelven `Result`.
- **Tipos de Supabase**: no salen de `src/infrastructure`. La interfaz ve `SessionUser` y
  `AuthSession` (`src/domain/session/session.ts`).
- **Claves que no cambian**: react-query (`["markets", 100]`, `["global-market"]`,
  `["price-history", coinId, days]`, `["fiat-rates"]`, `["coin-search", query]`,
  `["coins-by-id", idsOrdenados]`, `["watchlist", userId]`,
  `["portfolio-transactions", userId]`) y `localStorage` (`chainlytics-theme`,
  `chainlytics.watchlist`, `crypto-watchlist`, `chainlytics.portfolio.movimientos`,
  `chainlytics.portfolio`).

## 8. Comportamiento conservado a propósito

El paso a capas no cambia qué hace la app. Lo que en la interfaz anterior era un fallo o
una rareza conocida se ha dejado tal cual y está marcado en el código con `// Conservado:`.
Para verlos todos:

```bash
grep -rn "Conservado:" src/domain src/application src/infrastructure src/hooks
```

Único cambio de comportamiento, aprobado: sin sesión, watchlist y portfolio viven en un
almacén observable compartido, así que todas las pantallas ven los mismos datos (antes
cada una tenía su copia y se pisaban al escribir). Como consecuencia, al cerrar sesión ya
no reaparecen en el navegador los datos que se habían subido a la cuenta.

Rutas relativas a `src/`.

### Compartido

| Qué se conserva | Dónde |
|---|---|
| La watchlist compara, borra y marca favoritos por símbolo, no por id; dos monedas con el mismo símbolo cuentan como una. El alta con sesión es un `insert`: repetir una moneda falla. | `domain/watchlist/entries.ts` (`hasSymbol`), `infrastructure/watchlist/SupabaseWatchlistRepository.ts` |
| Una entrada guardada sin `id` pasa la validación. | `domain/watchlist/entries.ts` (`isWatchlistEntry`) |
| Watchlist y portfolio solo cruzan con el top 100 cargado: lo que no esté ahí no se pinta ni suma. | `domain/watchlist/entries.ts` (`joinWithMarket`), `domain/portfolio/positions.ts` |
| Las mutaciones no tienen `onError` ni actualización optimista. Sí exponen `isSaving` y `saveErrorMessage`. | `hooks/watchlist/useWatchlistMutations.ts`, `hooks/portfolio/usePortfolioMutations.ts` |
| La sincronización cuenta como movidas todas las entradas aunque alguna ya estuviera en la cuenta. | `application/sync/migrateLocalData.ts` |
| La app, por sí sola, comprueba el servicio de cuentas una vez por carga; se repite a mano con `useSession().recheckService()`. El listener de sesión no mira si el proveedor se desmontó. | `hooks/session/SessionProvider.tsx` |
| Solo se traducen "Invalid login credentials" y el email repetido; el resto de errores del proveedor salen en inglés. | `application/session/useCases.ts` |
| Con tema "system", la clase de `<html>` se calcula al elegirlo y no sigue al sistema operativo hasta recargar. | `hooks/theme/useThemeClass.ts` |

### Acceso (`auth-screen`)

| Qué se conserva | Dónde |
|---|---|
| Los errores no previstos del proveedor de cuentas se enseñan en inglés, tal como llegan. | `application/auth-screen/submitOutcome.ts` |
| El texto de la tarjeta solo menciona el analista, aunque la cuenta también sincroniza watchlist y portfolio. | `application/auth-screen/presentation/texts.ts` |
| Correo y contraseña son los mismos en las dos pestañas. | `hooks/auth-screen/useAuthScreen.ts` |

### Mercados (`markets`)

| Qué se conserva | Dónde |
|---|---|
| "Suben" excluye el cambio exactamente 0, mientras la fila pinta el 0 como subida. | `domain/markets/filters.ts` (`MARKET_FILTER_PREDICATES`, `isRising`) |
| "Limpiar filtros" no restablece el orden. | `domain/markets/listing.ts` (`clearCriteria`) |
| El contador no tiene singular ("1 criptomonedas"). | `application/markets/presentation/texts.ts` |

### Portfolio (`portfolio-screen`)

| Qué se conserva | Dónde |
|---|---|
| Con el campo de fecha vacío, la conversión de la fecha lanza `RangeError`: el formulario no valida la fecha. | `domain/portfolio-screen/transactionForm.ts` (`happenedAtFromInputDate`) |
| El total en vivo no valida el precio: un precio negativo da un total negativo hasta enviar. | `domain/portfolio-screen/transactionForm.ts` (`operationTotal`) |
| Una venta mayor que lo que se tiene no se rechaza; el cálculo de posiciones la recorta. | `domain/portfolio-screen/transactionForm.ts` (`buildNewTransaction`) |
| Registrar un movimiento no lanza aviso. Los avisos de borrar y de registrar coste salen sin esperar a que se guarde. | `application/portfolio-screen/useCases.ts` |

### Comparar (`compare`)

| Qué se conserva | Dónde |
|---|---|
| Quitar la última moneda hace reaparecer bitcoin + ethereum (sin parámetro en la URL se aplican los valores por defecto). | `domain/compare/selection.ts` |
| El tope de 5 se aplica sobre los ids de la URL: un id fuera del top 100 ocupa hueco aunque no se pinte. El aviso de "máximo" cuenta, en cambio, las monedas que se ven. | `domain/compare/selection.ts` (`isSelectionFull`) |
| El color va por posición: quitar una moneda cambia el color de las siguientes. | `domain/compare/selection.ts` (`colorIndexAt`) |
| La clasificación se pinta en cuanto hay resultados, aunque la gráfica siga cargando o en error. | `domain/compare/status.ts` |
| Cambiar la selección sustituye todos los parámetros de la URL, sin crear historial. | `hooks/compare/useCompareSelection.ts` |
| Reintentar relanza todas las consultas, no solo la que falló. | `hooks/compare/useComparison.ts` |

### Convertidor (`converter`)

| Qué se conserva | Dónde |
|---|---|
| Se puede elegir la misma moneda en origen y destino. | `domain/converter/conversion.ts` (`convert`) |
| Al intercambiar, la cantidad nueva es el número crudo con todos sus decimales, no el redondeado que se ve. | `domain/converter/conversion.ts` (`swapForm`) |
| Dos criptos con el mismo símbolo dentro de las 30 darían dos opciones con el mismo código. | `domain/converter/convertible.ts` |
| Si una moneda de un atajo sale de las 30 mayores, su fila desaparece sin aviso. | `domain/converter/quick.ts` |
| Basta con que falle una de las dos lecturas (criptos o fiat) para bloquear toda la pantalla; los bloques laterales también esperan a las dos. | `domain/converter/blocks.ts`, `hooks/converter/useConvertibles.ts`, `hooks/converter/useConverter.ts` |

### Analista IA (`analyst`)

| Qué se conserva | Dónde |
|---|---|
| Con sesión no se mira el servicio: si está caído se enseña la bienvenida y el formulario igualmente. | `domain/analyst/intro.ts` |
| No se aplican los límites del servidor (50 mensajes, 4000 caracteres) ni se recorta la conversación; al pasarse llega un 400 con el mensaje genérico. | `domain/analyst/message.ts`, `application/analyst/errors.ts` |
| Tras un error, la pregunta del usuario se queda en la lista; solo se quita la respuesta a medias. | `domain/analyst/chat.ts` |
| El texto del 402 habla de «tu workspace». | `application/analyst/errors.ts` |
| Un 401 del analista cierra la sesión entera. | `application/analyst/errors.ts` (`mustSignOut`) |

### Buscador global (`search`)

| Qué se conserva | Dónde |
|---|---|
| La moneda elegida se busca en el top por id **o por símbolo**: un resultado cuyo id coincida con el símbolo de otra moneda abriría esa otra. | `domain/search/rules.ts` (`findLoadedCoin`) |
| El detalle no se abre hasta que la moneda está cargada. | `hooks/search/useSelectedCoin.ts` |
| El atajo de teclado solo abre; con la paleta abierta no la cierra. | `hooks/search/SearchProvider.tsx` |

### Watchlist (`watchlist-screen`)

| Qué se conserva | Dónde |
|---|---|
| El contador "Sigues N monedas" incluye las que están fuera del top 100 y no se pintan. | `domain/watchlist-screen/counter.ts` |
| El orden se aplica a "Favoritas" y a "Todas" a la vez. | `application/watchlist-screen/buildView.ts` |
| Quitar no pide confirmación ni ofrece deshacer, y el aviso sale al pulsar. | `application/watchlist-screen/actions.ts` (`removedNotice`) |
| "Convertir" lleva al convertidor sin preseleccionar la moneda, aunque el aviso la nombre. | `application/watchlist-screen/actions.ts` (`convertIntent`) |
| La moneda del modal es una copia tomada al abrir: su precio no se refresca mientras está abierto. | `hooks/watchlist-screen/useWatchlistDetail.ts` |

### Panel (`panel`)

| Qué se conserva | Dónde |
|---|---|
| El bloque se titula «Precio de Bitcoin» pero el widget deja cambiar de símbolo. | `application/panel/advancedChart.ts` |
| La dominancia sale con punto decimal («54.3 %») mientras el resto de cifras usa coma. | `application/panel/presentation/marketStats.ts` |

### Modal de detalle (`coin-detail`)

| Qué se conserva | Dónde |
|---|---|
| Un cambio de exactamente 0 cuenta como subida. | `domain/coin-detail/figures.ts` |
| El aviso de añadir o quitar de la watchlist sale en el acto, sin saber si se guardó. | `application/coin-detail/useCases.ts` (`toggleCoinWatchlist`) |
| "Convertir" no preselecciona la moneda, y desde el modal no sale ningún aviso. | `application/coin-detail/useCases.ts` (`convertFromDetail`) |
| `coin` es la copia de quien abre el modal: su precio no se refresca mientras está abierto. El histórico solo se pide con el modal abierto. | `hooks/coin-detail/useCoinDetail.ts`, `hooks/coin-detail/useCoinDetailChart.ts` |
