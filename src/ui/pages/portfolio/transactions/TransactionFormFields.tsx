import { useId } from "react";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { Coin } from "@/domain/market/coin";
import type { TransactionForm } from "@/hooks/portfolio-screen/useTransactionForm";
import { Input } from "@/ui/base/input";
import { Label } from "@/ui/base/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/base/select";
import { RevealSlot } from "@/ui/pages/portfolio/RevealSlot";
import { TransactionKindToggle } from "./TransactionKindToggle";

export interface TransactionFormFieldsProps {
  /** Lo que devuelve `useTransactionForm`: valores, cambios, total y error. */
  form: TransactionForm;
  coins: Coin[];
}

/**
 * Campos del formulario «Registrar movimiento». Solo pinta: las reglas están en el hook.
 * El total y el error tienen su hueco reservado (`RevealSlot`): aparecen con un
 * fundido y no empujan el botón. El error ocupa dos líneas en móvil y una desde `sm`.
 */
export function TransactionFormFields({ form, coins }: TransactionFormFieldsProps) {
  const id = useId();
  const coinId = `${id}-coin`;
  const amountId = `${id}-amount`;
  const priceId = `${id}-price`;
  const dateId = `${id}-date`;

  return (
    <>
      <TransactionKindToggle value={form.kind} onChange={form.setKind} />

      <div className="flex flex-col gap-2">
        <Label htmlFor={coinId}>Criptomoneda</Label>
        <Select value={form.coinId} onValueChange={form.setCoinId}>
          <SelectTrigger id={coinId} className="w-full data-[size=default]:h-11">
            <SelectValue placeholder="Elige una moneda" />
          </SelectTrigger>
          <SelectContent className="max-h-72">
            {coins.map((coin) => (
              <SelectItem key={coin.id} value={coin.id} className="min-h-11">
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor={amountId}>Cantidad</Label>
          <Input
            id={amountId}
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
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor={priceId}>Precio por unidad</Label>
          <Input
            id={priceId}
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

      <div className="flex flex-col gap-2">
        <Label htmlFor={dateId}>Fecha</Label>
        <Input
          id={dateId}
          type="date"
          value={form.date}
          max={form.maxDate}
          onChange={(event) => form.setDate(event.target.value)}
          className="h-11"
        />
      </div>

      <RevealSlot show={form.total !== null} className="min-h-9">
        {form.total !== null ? (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            Total de la operación:{" "}
            <span className="type-num font-medium text-foreground">{formatCurrency(form.total)}</span>
          </p>
        ) : null}
      </RevealSlot>

      <RevealSlot show={form.errorMessage !== ""} className="min-h-10 sm:min-h-5">
        <p role="alert" className="text-sm font-medium text-destructive">
          {form.errorMessage}
        </p>
      </RevealSlot>
    </>
  );
}
