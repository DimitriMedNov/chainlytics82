import { useRef, useState, type RefObject } from "react";
import { X } from "lucide-react";
import {
  CLOSE_LABEL,
  COST_PRICE_LABEL,
  COST_PRICE_PLACEHOLDER,
  costDialogDescription,
  costDialogTitle,
  costInvestedNote,
  SET_COST_SUBMIT_LABEL,
  SET_COST_TRIGGER_LABEL,
} from "@/application/portfolio-screen/messages";
import { formatAmount, formatCurrency } from "@/application/shared/presentation/format";
import type { Position } from "@/domain/portfolio/types";
import { useSetCostForm } from "@/hooks/portfolio-screen/useSetCostForm";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/animate-ui/components/radix/dialog";
import { Input } from "@/ui/base/input";
import { LabeledField } from "@/ui/pages/portfolio/LabeledField";
import { dialogMotion } from "@/ui/pages/portfolio/motion";
import { RevealSlot } from "@/ui/pages/portfolio/RevealSlot";

export interface SetCostDialogProps {
  /** La posición sin coste. El precio de hoy solo se enseña como referencia. */
  position: Pick<Position, "coinId" | "name" | "symbol" | "amount" | "price">;
  /** Recibe el precio por unidad ya validado. */
  onConfirm: (unitPrice: number) => void;
  /**
   * A dónde va el foco tras guardar el coste: el botón que abrió el diálogo
   * desaparece con el bloque «Sin coste», así que no se le puede devolver.
   */
  focusAfterConfirm?: RefObject<HTMLElement | null>;
}

/**
 * Botón «Registrar el coste» + diálogo «Coste de {moneda}». Rellena el precio
 * que faltaba en los movimientos de esa moneda; no crea un movimiento nuevo.
 * Las reglas y los textos de error vienen de `useSetCostForm`.
 * Foco: al cerrar sin guardar vuelve a «Registrar el coste» (lo hace el `Dialog`
 * de Animate UI); al guardar, pasa
 * al nombre de la posición (`focusAfterConfirm`), que es lo que sigue en pantalla.
 */
export function SetCostDialog({ position, onConfirm, focusAfterConfirm }: SetCostDialogProps) {
  const [open, setOpen] = useState(false);
  const confirmed = useRef(false);
  const form = useSetCostForm({
    amount: position.amount,
    onConfirm: (unitPrice) => {
      confirmed.current = true;
      onConfirm(unitPrice);
    },
    onDone: () => setOpen(false),
  });
  const inputId = `coste-${position.coinId}`;
  const errorId = `${inputId}-error`;
  const hasError = form.errorMessage !== "";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) form.reset();
  };

  const handleCloseAutoFocus = (event: Event) => {
    const target = confirmed.current ? focusAfterConfirm?.current : null;
    confirmed.current = false;
    // Sin destino propio no se cancela nada: el `Dialog` devuelve el foco solo.
    if (!target?.isConnected) return;
    event.preventDefault();
    target.focus();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="min-h-11">
          {SET_COST_TRIGGER_LABEL}
        </Button>
      </DialogTrigger>

      <DialogContent
        {...dialogMotion}
        onCloseAutoFocus={handleCloseAutoFocus}
        showCloseButton={false}
        className="rounded-xl bg-popover shadow-overlay sm:max-w-md"
      >
        <DialogHeader className="pr-10 text-left">
          <DialogTitle>{costDialogTitle(position.name)}</DialogTitle>
          <DialogDescription className="text-pretty">
            {costDialogDescription(formatAmount(position.amount), position.symbol, formatCurrency(position.price))}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-4">
          <LabeledField htmlFor={inputId} label={COST_PRICE_LABEL}>
            <Input
              id={inputId}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder={COST_PRICE_PLACEHOLDER}
              value={form.unitPrice}
              onChange={(event) => form.setUnitPrice(event.target.value)}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              className="h-11"
              autoFocus
            />
            <RevealSlot show={form.invested !== null} className="min-h-5">
              {form.invested !== null ? (
                <p className="type-num text-sm text-muted-foreground">{costInvestedNote(formatCurrency(form.invested))}</p>
              ) : null}
            </RevealSlot>
          </LabeledField>

          <RevealSlot show={hasError} className="min-h-5">
            <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
              {form.errorMessage}
            </p>
          </RevealSlot>

          <DialogFooter>
            <Button type="submit" className="min-h-11 w-full">
              {SET_COST_SUBMIT_LABEL}
            </Button>
          </DialogFooter>
        </form>

        <DialogClose
          aria-label={CLOSE_LABEL}
          className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
