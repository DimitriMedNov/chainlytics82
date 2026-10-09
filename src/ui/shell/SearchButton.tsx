import { Search } from "lucide-react";
import { SEARCH_TRIGGER_LABEL } from "@/application/search/messages";
import { useSearch, useSearchShortcutHint } from "@/hooks/search";
import { cn } from "@/lib/utils";

export interface SearchButtonProps {
  className?: string;
}

/**
 * Empieza a bajar la paleta en cuanto el usuario apunta al botón, para que al
 * pulsarlo ya esté. Es el mismo módulo que monta `GlobalSearchMount`: el
 * navegador lo descarga una sola vez. Si falla, se vuelve a pedir al abrir.
 */
function preloadSearchPalette(): void {
  import("@/ui/search/GlobalSearchPalette").catch(() => undefined);
}

/**
 * Botón del buscador en la barra: lupa siempre; texto y atajo desde `xl`.
 * El nombre accesible es el propio texto del botón («Buscar moneda»): en
 * pantallas estrechas el texto sigue ahí, oculto solo a la vista, así el
 * nombre siempre contiene lo que se ve. El atajo lo anuncia `aria-keyshortcuts`.
 */
export function SearchButton({ className }: SearchButtonProps) {
  const { open } = useSearch();
  const { label: shortcut } = useSearchShortcutHint();

  return (
    <button
      type="button"
      onClick={open}
      onPointerEnter={preloadSearchPalette}
      onFocus={preloadSearchPalette}
      aria-keyshortcuts="Meta+K Control+K"
      className={cn(
        "inline-flex size-11 shrink-0 items-center justify-center gap-2 rounded-md text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground",
        "xl:w-64 xl:justify-start xl:border xl:bg-card xl:px-3 xl:hover:bg-accent",
        className,
      )}
    >
      <Search className="size-5 shrink-0 xl:size-4" aria-hidden="true" />
      <span className="sr-only flex-1 text-left xl:not-sr-only">{SEARCH_TRIGGER_LABEL}</span>
      <kbd
        aria-hidden="true"
        className="type-num hidden rounded-xs border bg-muted px-1.5 py-0.5 font-sans text-2xs font-medium text-muted-foreground xl:inline"
      >
        {shortcut}
      </kbd>
    </button>
  );
}
