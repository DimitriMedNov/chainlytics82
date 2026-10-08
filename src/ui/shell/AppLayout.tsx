import { Suspense, createElement } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { AnalystMount } from "@/ui/analyst";
import { GlobalSearchMount } from "@/ui/search";
import { Navbar } from "@/ui/shell/Navbar";
import { MAIN_CONTENT_ID } from "@/ui/shell/navigation";
import { RouteErrorBoundary } from "@/ui/shell/RouteErrorBoundary";
import { RouteSkeleton } from "@/ui/shell/RouteSkeleton";
import { APP_ROUTES, PanelPage, lazyPage, resetLazyPages, type LazyPageName } from "@/ui/shell/routes";

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
        Saltar al contenido
      </a>
      <Navbar />
      {/* pb-24 en móvil: hueco para el botón flotante del analista. */}
      <main id={MAIN_CONTENT_ID} tabIndex={-1} className="flex-1 pb-24 outline-none sm:pb-0">
        <RouteErrorBoundary resetKey={pathname} onRetry={resetLazyPages}>
          <Suspense fallback={<RouteSkeleton />}>
            <Routes>
              {APP_ROUTES.map((route) => (
                <Route
                  key={route.path}
                  path={route.path}
                  element={route.page === null ? <PanelPage /> : <LazyRoute name={route.page} />}
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
