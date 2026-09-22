import { useState, type FormEvent } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatAmount, formatCurrency } from "@/lib/format";

export interface SetCostDialogProps {
  coinId: string;
  coinName: string;
  symbol: string;
  amount: number;
  /** Precio de hoy, solo como referencia. */
  currentPrice: number;
  onConfirm: (coinId: string, unitPrice: number) => void;
}

/**
 * Rellena el precio que faltaba en los movimientos de una moneda. No crea un
 * movimiento nuevo: completa los que ya existen.
 */
const SetCostDialog = ({
  coinId,
  coinName,
  symbol,
  amount,
  currentPrice,
  onConfirm,
}: SetCostDialogProps) => {
  const [open, setOpen] = useState(false);
  const [unitPrice, setUnitPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const parsed = Number.parseFloat(unitPrice.replace(",", "."));
  const valido = Number.isFinite(parsed) && parsed > 0;

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!valido) {
      setErrorMessage("Escribe el precio que pagaste por unidad.");
      return;
    }
    onConfirm(coinId, parsed);
    setUnitPrice("");
    setErrorMessage("");
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) {
          setUnitPrice("");
          setErrorMessage("");
        }
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="min-h-11 rounded-md px-3 text-sm font-medium text-primary underline-offset-2 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          Registrar el coste
        </button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Coste de {coinName}</DialogTitle>
          <DialogDescription>
            ¿A qué precio por unidad compraste tus {formatAmount(amount)} {symbol}? Hoy vale{" "}
            {formatCurrency(currentPrice)}.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor={`coste-${coinId}`}>Precio pagado por unidad</Label>
            <Input
              id={`coste-${coinId}`}
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0,00"
              value={unitPrice}
              onChange={(event) => setUnitPrice(event.target.value)}
              className="h-11"
              autoFocus
            />
            {valido && (
              <p className="text-sm text-muted-foreground">
                Invertido: {formatCurrency(parsed * amount)}
              </p>
            )}
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" className="min-h-11 w-full">
              Guardar coste
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SetCostDialog;
