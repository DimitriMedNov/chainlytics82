import { lazy, type ComponentType, type LazyExoticComponent } from "react";
// La ruta `/` va con carga directa; las demás se descargan al entrar.
import PanelPage from "@/ui/pages/panel";

type PageModule = { default: ComponentType };
type LazyPage = LazyExoticComponent<ComponentType>;

const LOADERS = {
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
  /** `null`: carga directa (`PanelPage`). */
  page: LazyPageName | null;
}

/** Las 7 rutas de siempre, con sus direcciones, más la 404. */
export const APP_ROUTES: readonly AppRoute[] = [
  { path: "/", page: null },
  { path: "/markets", page: "markets" },
  { path: "/portfolio", page: "portfolio" },
  { path: "/comparar", page: "compare" },
  { path: "/watchlist", page: "watchlist" },
  { path: "/converter", page: "converter" },
  { path: "/auth", page: "auth" },
  { path: "*", page: "notFound" },
];

export { PanelPage };
