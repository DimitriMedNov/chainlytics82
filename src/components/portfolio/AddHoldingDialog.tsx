import { useState } from "react";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/format";
import type { Coin } from "@/types/coin";

export interface AddHoldingDialogProps {
  coins: Coin[];
  onAdd: (coin: Coin, amount: number) => void;
  disabled?: boolean;
}

/** Diálogo para añadir una posición al portfolio. */
const AddHoldingDialog = ({ coins, onAdd, disabled = false }: AddHoldingDialogProps) => {
  const [open, setOpen] = useState(false);
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const selected = coins.find((coin) => coin.id === coinId);
  const parsedAmount = Number.parseFloat(amount.replace(",", "."));
  const preview =
    selected && Number.isFinite(parsedAmount) && parsedAmount > 0
      ? formatCurrency(selected.price * parsedAmount)
      : null;

  const reset = () => {
    setCoinId("");
    setAmount("");
    setErrorMessage("");
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!selected) {
      setErrorMessage("Elige una criptomoneda.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("La cantidad debe ser un número mayor que cero.");
      return;
    }
    onAdd(selected, parsedAmount);
    reset();
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <Button className="min-h-11 gap-2" disabled={disabled}>
          <Plus className="h-4 w-4" aria-hidden="true" />
          Añadir cripto
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Añadir una posición</DialogTitle>
          <DialogDescription>
            Se guarda solo en este navegador. La valoración usa el precio de mercado actual.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="holding-coin">Criptomoneda</Label>
            <Select value={coinId} onValueChange={setCoinId}>
              <SelectTrigger id="holding-coin" className="h-11">
                <SelectValue placeholder="Elige una moneda" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {coins.map((coin) => (
                  <SelectItem key={coin.id} value={coin.id}>
                    {coin.name} ({coin.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="holding-amount">Cantidad</Label>
            <Input
              id="holding-amount"
              type="number"
              inputMode="decimal"
              min="0"
              step="any"
              placeholder="0,5"
              value={amount}
              onChange={(event) => setAmount(event.target.value)}
              className="h-11"
            />
            {preview && (
              <p className="text-sm text-muted-foreground">Valor actual: {preview}</p>
            )}
          </div>

          {errorMessage && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" className="min-h-11 w-full">
              Añadir al portfolio
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHoldingDialog;
