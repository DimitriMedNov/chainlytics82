import { useState } from "react";
import { X } from "lucide-react";
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
import { Label } from "@/ui/base/label";
import { dialogMotion } from "@/ui/pages/portfolio/motion";
import { RevealSlot } from "@/ui/pages/portfolio/RevealSlot";

export interface SetCostDialogProps {
  /** La posición sin coste. El precio de hoy solo se enseña como referencia. */
  position: Pick<Position, "coinId" | "name" | "symbol" | "amount" | "price">;
  /** Recibe el precio por unidad ya validado. */
  onConfirm: (unitPrice: number) => void;
}

/**
 * Botón «Registrar el coste» + diálogo «Coste de {moneda}». Rellena el precio
 * que faltaba en los movimientos de esa moneda; no crea un movimiento nuevo.
 * Las reglas y los textos de error vienen de `useSetCostForm`.
 */
export function SetCostDialog({ position, onConfirm }: SetCostDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useSetCostForm({ amount: position.amount, onConfirm, onDone: () => setOpen(false) });
  const inputId = `coste-${position.coinId}`;
  const errorId = `${inputId}-error`;
  const hasError = form.errorMessage !== "";

  const handleOpenChange = (next: boolean) => {
    setOpen(next);
    if (!next) form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button type="button" variant="outline" className="min-h-11">
          Registrar el coste
        </Button>
      </DialogTrigger>

      <DialogContent
        {...dialogMotion}
        showCloseButton={false}
        className="rounded-xl bg-popover shadow-overlay sm:max-w-md"
      >
        <DialogHeader className="pr-10 text-left">
          <DialogTitle>Coste de {position.name}</DialogTitle>
          <DialogDescription className="text-pretty">
            ¿A qué precio por unidad compraste tus {formatAmount(position.amount)} {position.symbol}? Hoy vale{" "}
            {formatCurrency(position.price)}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit} noValidate className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor={inputId}>Precio pagado por unidad</Label>
            <Input
              id={inputId}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0,00"
              value={form.unitPrice}
              onChange={(event) => form.setUnitPrice(event.target.value)}
              aria-invalid={hasError}
              aria-describedby={hasError ? errorId : undefined}
              className="h-11"
              autoFocus
            />
            <RevealSlot show={form.invested !== null} className="min-h-5">
              {form.invested !== null ? (
                <p className="type-num text-sm text-muted-foreground">Invertido: {formatCurrency(form.invested)}</p>
              ) : null}
            </RevealSlot>
          </div>

          <RevealSlot show={hasError} className="min-h-5">
            <p id={errorId} role="alert" className="text-sm font-medium text-destructive">
              {form.errorMessage}
            </p>
          </RevealSlot>

          <DialogFooter>
            <Button type="submit" className="min-h-11 w-full">
              Guardar coste
            </Button>
          </DialogFooter>
        </form>

        <DialogClose
          aria-label="Cerrar"
          className="absolute right-2 top-2 inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground"
        >
          <X className="size-4" aria-hidden="true" />
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
