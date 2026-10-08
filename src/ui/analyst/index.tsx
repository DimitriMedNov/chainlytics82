import { useState } from "react";
import { X } from "lucide-react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/animate-ui/components/radix/sheet";
import { Bot } from "@/ui/animate-ui/icons/bot";

/**
 * MARCADOR del analista con IA: el botón flotante y su panel. Lo sustituye su
 * agente (solo este archivo; los suyos van al lado). La firma `AnalystMount()`
 * sin props es definitiva: el armazón lo monta en todas las rutas.
 *
 * El armazón ya reserva hueco bajo el contenido en móvil para que el botón
 * flotante (esquina inferior derecha) no tape la última fila.
 */
export function AnalystMount() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          type="button"
          aria-label="Abrir el analista con IA"
          className="fixed bottom-4 right-4 z-30 inline-flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-raised transition-colors hover:bg-primary/90 sm:bottom-6 sm:right-6"
        >
          <Bot className="size-6" aria-hidden="true" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" showCloseButton={false} className="w-96 max-w-[90vw] gap-0 bg-popover">
        <SheetHeader className="flex-row items-start justify-between gap-2 border-b">
          <div className="flex min-w-0 flex-col gap-1">
            <SheetTitle>Analista con IA</SheetTitle>
            <SheetDescription>El panel del analista todavía no está escrito.</SheetDescription>
          </div>
          <SheetClose asChild>
            <button
              type="button"
              aria-label="Cerrar el analista"
              className="inline-flex size-11 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </SheetClose>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
