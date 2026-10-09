import { lazy, Suspense } from "react";
import { useSearch } from "@/hooks/search";

/**
 * Montaje del buscador global. La firma de `GlobalSearchMount` es definitiva:
 * el armazón ya la importa. El botón de la barra vive en el armazón
 * (`src/ui/shell/SearchButton.tsx`).
 *
 * Para abrir el buscador desde cualquier pantalla: `useSearch().open()` de
 * `@/hooks/search`.
 */

// La paleta arrastra cmdk y el modal de detalle: no viaja con la barra.
const GlobalSearchPalette = lazy(() => import("@/ui/search/GlobalSearchPalette"));

/**
 * Monta la paleta la primera vez que alguien abre el buscador, no antes, y ya
 * se queda montada. El armazón lo pone junto a las rutas.
 */
export function GlobalSearchMount() {
  const { wasOpened } = useSearch();
  if (!wasOpened) return null;

  return (
    <Suspense fallback={null}>
      <GlobalSearchPalette />
    </Suspense>
  );
}
