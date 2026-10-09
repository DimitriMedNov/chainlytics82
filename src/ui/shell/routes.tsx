import { lazy, type ComponentType, type LazyExoticComponent } from "react";
// Todas las rutas se descargan al entrar, también el Panel (`/`): así el código
// de sus gráficas no viaja en el arranque de las demás pantallas.

type PageModule = { default: ComponentType };
type LazyPage = LazyExoticComponent<ComponentType>;

const LOADERS = {
  panel: () => import("@/ui/pages/panel"),
  markets: () => import("@/ui/pages/markets"),
  portfolio: () => import("@/ui/pages/portfolio"),
  compare: () => import("@/ui/pages/compare"),
  watchlist: () => import("@/ui/pages/watchlist"),
  converter: () => import("@/ui/pages/converter"),
  auth: () => import("@/ui/pages/auth"),
  notFound: () => import("@/ui/pages/not-found"),
} satisfies Record<string, () => Promise<PageModule>>;

export type LazyPageName = keyof typeof LOADERS;

function createLazyPages(): Record<LazyPageName, LazyPage> {
  return {
    panel: lazy(LOADERS.panel),
    markets: lazy(LOADERS.markets),
    portfolio: lazy(LOADERS.portfolio),
    compare: lazy(LOADERS.compare),
    watchlist: lazy(LOADERS.watchlist),
    converter: lazy(LOADERS.converter),
    auth: lazy(LOADERS.auth),
    notFound: lazy(LOADERS.notFound),
  };
}

let lazyPages = createLazyPages();

/** La pantalla perezosa con ese nombre, en su versión vigente. */
export function lazyPage(name: LazyPageName): LazyPage {
  return lazyPages[name];
}

/**
 * `lazy()` recuerda una descarga fallida para siempre. Para que «Reintentar»
 * sirva de algo, se crean componentes perezosos nuevos, que vuelven a pedir el código.
 */
export function resetLazyPages(): void {
  lazyPages = createLazyPages();
}

export interface AppRoute {
  path: string;
  page: LazyPageName;
}

/** Las 7 rutas de siempre, con sus direcciones, más la 404. */
export const APP_ROUTES: readonly AppRoute[] = [
  { path: "/", page: "panel" },
  { path: "/markets", page: "markets" },
  { path: "/portfolio", page: "portfolio" },
  { path: "/comparar", page: "compare" },
  { path: "/watchlist", page: "watchlist" },
  { path: "/converter", page: "converter" },
  { path: "/auth", page: "auth" },
  { path: "*", page: "notFound" },
];

/**
 * Empieza a descargar ya el código de la ruta en la que se abrió la app, sin
 * esperar a que React llegue a pintarla: la descarga corre a la vez que el
 * arranque. Si falla, no pasa nada aquí: `lazy()` la vuelve a pedir y el error
 * lo enseña el límite de errores de ruta, con su «Reintentar».
 */
export function preloadRoute(pathname: string): void {
  const route = APP_ROUTES.find((candidate) => candidate.path === pathname);
  if (!route) return;
  LOADERS[route.page]().catch(() => undefined);
}

if (typeof window !== "undefined") {
  preloadRoute(window.location.pathname);
}
