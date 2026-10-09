import { Suspense, createElement } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { SHELL_TEXTS } from "@/application/shared/presentation/texts";
import { AnalystMount } from "@/ui/analyst";
import { GlobalSearchMount } from "@/ui/search";
import { Navbar } from "@/ui/shell/Navbar";
import { MAIN_CONTENT_ID } from "@/ui/shell/navigation";
import { RouteErrorBoundary } from "@/ui/shell/RouteErrorBoundary";
import { RouteSkeleton } from "@/ui/shell/RouteSkeleton";
import { APP_ROUTES, lazyPage, resetLazyPages, type LazyPageName } from "@/ui/shell/routes";

export interface LazyRouteProps {
  name: LazyPageName;
}

/** Pinta la pantalla perezosa vigente (cambia tras un «Reintentar»). */
function LazyRoute({ name }: LazyRouteProps) {
  return createElement(lazyPage(name));
}

/**
 * Armazón común: enlace para saltar al contenido, barra, `<main>` con las
 * rutas, y las dos piezas globales (analista y buscador).
 */
export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-dvh w-full flex-col">
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-50 focus:inline-flex focus:min-h-11 focus:items-center focus:rounded-md focus:bg-primary focus:px-4 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        {SHELL_TEXTS.skipToContent}
      </a>
      <Navbar />
      {/* pb-24 (96 px) en todos los anchos: hueco para el botón flotante del
          analista (56 px + 16/24 px de separación = 72/80 px desde abajo), para
          que con el scroll al final ningún control quede debajo. */}
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 pb-24 outline-none">
        <RouteErrorBoundary resetKey={pathname} onRetry={resetLazyPages}>
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              {APP_ROUTES.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<LazyRoute name={route.page} />}
                />
              ))}
            </Routes>
          </Suspense>
        </RouteErrorBoundary>
      </main>
      <AnalystMount />
      <GlobalSearchMount />
    </div>
  );
}
