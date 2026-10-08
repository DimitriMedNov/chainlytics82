import { lazy, Suspense } from "react";
import { Search } from "lucide-react";
import {
  SEARCH_TRIGGER_ARIA_LABEL,
  SEARCH_TRIGGER_LABEL,
} from "@/application/search/messages";
import { useSearch, useSearchShortcutHint } from "@/hooks/search";
import { cn } from "@/lib/utils";

/**
 * MARCADOR del buscador global. Lo sustituye el agente del buscador (solo este
 * archivo y `GlobalSearchPalette.tsx`); las firmas de `SearchTrigger` y
 * `GlobalSearchMount` son definitivas: el armazón ya las importa.
 *
 * Para abrir el buscador desde cualquier pantalla: `useSearch().open()` de
 * `@/hooks/search`.
 */

// La paleta arrastra cmdk y el modal de detalle: no viaja con la barra.
const GlobalSearchPalette = lazy(() => import("@/ui/search/GlobalSearchPalette"));

export interface SearchTriggerProps {
  className?: string;
}

/** Botón «Buscar moneda» de la barra: lupa siempre; texto y atajo desde `xl`. */
export function SearchTrigger({ className }: SearchTriggerProps) {
  const { open } = useSearch();
  const { label: shortcut } = useSearchShortcutHint();

  return (
    <button
      type="button"
      onClick={open}
      aria-label={SEARCH_TRIGGER_ARIA_LABEL}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        "xl:w-64 xl:justify-start xl:border xl:bg-card xl:px-3 xl:hover:bg-accent",
        className,
      )}
    >
      <Search className="size-5 shrink-0 xl:size-4" aria-hidden="true" />
      <span className="hidden flex-1 text-left xl:inline">{SEARCH_TRIGGER_LABEL}</span>
      <kbd className="type-num hidden rounded-xs border bg-muted px-1.5 py-0.5 font-sans text-2xs font-medium text-muted-foreground xl:inline">
        {shortcut}
      </kbd>
    </button>
  );
}

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
