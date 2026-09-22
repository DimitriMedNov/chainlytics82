import { useEffect, useState, type FormEvent } from "react";
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { formatCurrency } from "@/lib/format";
import type { Coin } from "@/types/coin";
import type { NewTransaction } from "@/types/portfolio";

export interface AddTransactionDialogProps {
  coins: Coin[];
  onAdd: (tx: NewTransaction) => void;
  disabled?: boolean;
}

function hoyEnFormatoInput(): string {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60_000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 10);
}

/** Registra una compra o una venta con su precio y su fecha. */
const AddTransactionDialog = ({ coins, onAdd, disabled = false }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [kind, setKind] = useState<"compra" | "venta">("compra");
  const [coinId, setCoinId] = useState("");
  const [amount, setAmount] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [date, setDate] = useState(hoyEnFormatoInput);
  const [errorMessage, setErrorMessage] = useState("");

  const selected = coins.find((coin) => coin.id === coinId);

  // Al elegir moneda proponemos su precio de hoy, que es lo más probable.
  useEffect(() => {
    if (selected) setUnitPrice(String(selected.price));
  }, [selected]);

  const parsedAmount = Number.parseFloat(amount.replace(",", "."));
  const parsedPrice = Number.parseFloat(unitPrice.replace(",", "."));
  const total =
    Number.isFinite(parsedAmount) && Number.isFinite(parsedPrice) && parsedAmount > 0
      ? parsedAmount * parsedPrice
      : null;

  const reset = () => {
    setKind("compra");
    setCoinId("");
    setAmount("");
    setUnitPrice("");
    setDate(hoyEnFormatoInput());
    setErrorMessage("");
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    if (!selected) {
      setErrorMessage("Elige una criptomoneda.");
      return;
    }
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      setErrorMessage("La cantidad debe ser un número mayor que cero.");
      return;
    }
    if (unitPrice.trim() !== "" && (!Number.isFinite(parsedPrice) || parsedPrice < 0)) {
      setErrorMessage("El precio no puede ser negativo.");
      return;
    }

    onAdd({
      coinId: selected.id,
      symbol: selected.symbol,
      kind,
      amount: parsedAmount,
      // Vacío significa "no lo recuerdo", y así se queda: sin inventar.
      unitPrice: unitPrice.trim() === "" ? null : parsedPrice,
      happenedAt: new Date(`${date}T12:00:00`).toISOString(),
    });
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
          Registrar movimiento
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Registrar movimiento</DialogTitle>
          <DialogDescription>
            El precio es el que pagaste o cobraste por unidad. Si no lo recuerdas, déjalo
            vacío: la posición quedará sin coste en vez de con un coste inventado.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Tabs value={kind} onValueChange={(value) => setKind(value as "compra" | "venta")}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compra">Compra</TabsTrigger>
              <TabsTrigger value="venta">Venta</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="tx-coin">Criptomoneda</Label>
            <Select value={coinId} onValueChange={setCoinId}>
              <SelectTrigger id="tx-coin" className="h-11">
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="tx-amount">Cantidad</Label>
              <Input
                id="tx-amount"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0,5"
                value={amount}
                onChange={(event) => setAmount(event.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tx-price">Precio por unidad</Label>
              <Input
                id="tx-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="Déjalo vacío si no lo sabes"
                value={unitPrice}
                onChange={(event) => setUnitPrice(event.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-date">Fecha</Label>
            <Input
              id="tx-date"
              type="date"
              value={date}
              max={hoyEnFormatoInput()}
              onChange={(event) => setDate(event.target.value)}
              className="h-11"
            />
          </div>

          {total !== null && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              Total de la operación: <span className="font-medium">{formatCurrency(total)}</span>
            </p>
          )}

          {errorMessage && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {errorMessage}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" className="min-h-11 w-full">
              {kind === "compra" ? "Registrar compra" : "Registrar venta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
