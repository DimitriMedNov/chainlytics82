import { SearchX } from "lucide-react";
import { useSearch } from "@/hooks/search";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/ui/animate-ui/components/radix/dialog";

/**
 * MARCADOR de la paleta del buscador. Su agente sustituye este archivo: aquí va
 * el contenedor que llama a `useGlobalSearch()` (solo aquí: pide el top 100) y
 * pinta la paleta y el `CoinDetailDialog` de la moneda elegida.
 * Export por defecto obligatorio: `src/ui/search/index.tsx` lo carga con `lazy()`.
 */
export default function GlobalSearchPalette() {
  const { isOpen, setOpen } = useSearch();

  return (
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent showCloseButton={false} className="bg-popover shadow-overlay">
        <DialogHeader className="items-center text-center sm:text-center">
          <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
            <SearchX className="size-5" aria-hidden="true" />
          </span>
          <DialogTitle>Buscador en construcción</DialogTitle>
          <DialogDescription>
            El buscador de monedas todavía no está escrito. Pulsa Escape para cerrar.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
