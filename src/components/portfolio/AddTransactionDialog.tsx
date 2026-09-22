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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { hoyEnFormatoInput, useTransactionForm, type TransactionKind } from "@/hooks/useTransactionForm";
import { formatCurrency } from "@/lib/format";
import type { Coin } from "@/types/coin";
import type { NewTransaction } from "@/types/portfolio";

export interface AddTransactionDialogProps {
  coins: Coin[];
  onAdd: (tx: NewTransaction) => void;
  disabled?: boolean;
}

/** Registra una compra o una venta con su precio y su fecha. */
const AddTransactionDialog = ({ coins, onAdd, disabled = false }: AddTransactionDialogProps) => {
  const [open, setOpen] = useState(false);
  const form = useTransactionForm(coins, onAdd, () => setOpen(false));

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) form.reset();
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

        <form onSubmit={form.handleSubmit} className="space-y-4">
          <Tabs value={form.kind} onValueChange={(value) => form.setKind(value as TransactionKind)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="compra">Compra</TabsTrigger>
              <TabsTrigger value="venta">Venta</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-2">
            <Label htmlFor="tx-coin">Criptomoneda</Label>
            <Select value={form.coinId} onValueChange={form.setCoinId}>
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
                value={form.amount}
                onChange={(event) => form.setAmount(event.target.value)}
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
                value={form.unitPrice}
                onChange={(event) => form.setUnitPrice(event.target.value)}
                className="h-11"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tx-date">Fecha</Label>
            <Input
              id="tx-date"
              type="date"
              value={form.date}
              max={hoyEnFormatoInput()}
              onChange={(event) => form.setDate(event.target.value)}
              className="h-11"
            />
          </div>

          {form.total !== null && (
            <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
              Total de la operación: <span className="font-medium">{formatCurrency(form.total)}</span>
            </p>
          )}

          {form.errorMessage && (
            <p role="alert" className="text-sm font-medium text-destructive">
              {form.errorMessage}
            </p>
          )}

          <DialogFooter>
            <Button type="submit" className="min-h-11 w-full">
              {form.kind === "compra" ? "Registrar compra" : "Registrar venta"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTransactionDialog;
