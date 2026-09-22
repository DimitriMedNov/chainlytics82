import { Search } from "lucide-react";

export interface CoinSearchTriggerProps {
  onClick: () => void;
}

/**
 * Botón que abre el buscador. Vive aparte del diálogo a propósito: la barra
 * de navegación lo importa siempre, y no queremos arrastrar cmdk con ella.
 */
export function CoinSearchTrigger({ onClick }: CoinSearchTriggerProps) {
  const esMac =
    typeof navigator !== "undefined" && navigator.platform.toLowerCase().includes("mac");

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Buscar criptomoneda"
      className="flex h-11 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
    >
      <Search className="h-4 w-4" aria-hidden="true" />
      <span className="hidden lg:inline">Buscar moneda</span>
      <kbd className="hidden rounded border bg-muted px-1.5 font-mono text-xs lg:inline">
        {esMac ? "⌘" : "Ctrl "}K
      </kbd>
    </button>
  );
}

export default CoinSearchTrigger;
