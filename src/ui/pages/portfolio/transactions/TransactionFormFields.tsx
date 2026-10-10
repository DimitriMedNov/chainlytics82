import { useId } from "react";
import {
  AMOUNT_FIELD_LABEL,
  AMOUNT_FIELD_PLACEHOLDER,
  COIN_FIELD_LABEL,
  COIN_FIELD_PLACEHOLDER,
  coinOptionLabel,
  DATE_FIELD_LABEL,
  OPERATION_TOTAL_TERM,
  UNIT_PRICE_FIELD_LABEL,
  UNIT_PRICE_FIELD_PLACEHOLDER,
} from "@/application/portfolio-screen/messages";
import { formatCurrency } from "@/application/shared/presentation/format";
import type { Coin } from "@/domain/market/coin";
import type { TransactionForm } from "@/hooks/portfolio-screen/useTransactionForm";
import { Input } from "@/ui/base/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/base/select";
import { LabeledField } from "@/ui/pages/portfolio/LabeledField";
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
 * Cada campo va en un `LabeledField`: su etiqueta responde al foco.
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

      <LabeledField htmlFor={coinId} label={COIN_FIELD_LABEL}>
        <Select value={form.coinId} onValueChange={form.setCoinId}>
          <SelectTrigger id={coinId} className="w-full data-[size=default]:h-11">
            <SelectValue placeholder={COIN_FIELD_PLACEHOLDER} />
          </SelectTrigger>
          {/* Con «reducir movimiento» la lista aparece sin el escalado de entrada y salida del `Select` base. */}
          <SelectContent className="max-h-72 motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none">
            {coins.map((coin) => (
              <SelectItem key={coin.id} value={coin.id} className="min-h-11">
                {coinOptionLabel(coin.name, coin.symbol)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </LabeledField>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <LabeledField htmlFor={amountId} label={AMOUNT_FIELD_LABEL}>
          <Input
            id={amountId}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder={AMOUNT_FIELD_PLACEHOLDER}
            value={form.amount}
            onChange={(event) => form.setAmount(event.target.value)}
            className="h-11"
          />
        </LabeledField>
        <LabeledField htmlFor={priceId} label={UNIT_PRICE_FIELD_LABEL}>
          <Input
            id={priceId}
            type="number"
            inputMode="decimal"
            min="0"
            step="any"
            placeholder={UNIT_PRICE_FIELD_PLACEHOLDER}
            value={form.unitPrice}
            onChange={(event) => form.setUnitPrice(event.target.value)}
            className="h-11"
          />
        </LabeledField>
      </div>

      <LabeledField htmlFor={dateId} label={DATE_FIELD_LABEL}>
        <Input
          id={dateId}
          type="date"
          value={form.date}
          max={form.maxDate}
          onChange={(event) => form.setDate(event.target.value)}
          className="h-11"
        />
      </LabeledField>

      <RevealSlot show={form.total !== null} className="min-h-9">
        {form.total !== null ? (
          <p className="rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">
            {OPERATION_TOTAL_TERM}{" "}
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
