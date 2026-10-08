import { useState, type FormEvent } from "react";
import { submitLabel } from "@/application/portfolio-screen/messages";
import { useDeps } from "@/app/deps";
import type { Coin } from "@/domain/market/coin";
import {
  emptyTransactionForm,
  operationTotal,
  suggestedUnitPrice,
  todayAsInputDate,
  type TransactionFormValues,
  type TransactionKind,
} from "@/domain/portfolio-screen/transactionForm";
import type { NewTransaction } from "@/domain/portfolio/types";

export interface UseTransactionFormOptions {
  /** Monedas del select (`usePortfolioScreen().coins`). */
  coins: Coin[];
  /** Recibe el movimiento ya validado (`usePortfolioScreen().registerTransaction`). */
  onRegister: (tx: NewTransaction) => void;
  /** Se llama tras un envío válido, para cerrar el diálogo. */
  onDone: () => void;
}

const today = () => todayAsInputDate(new Date());

/**
 * Estado del formulario "Registrar movimiento". Las reglas están en
 * `@/domain/portfolio-screen/transactionForm`; aquí solo vive lo escrito.
 */
export function useTransactionForm({ coins, onRegister, onDone }: UseTransactionFormOptions) {
  const { portfolioScreen } = useDeps();
  const [values, setValues] = useState<TransactionFormValues>(() => emptyTransactionForm(today()));
  const [errorMessage, setErrorMessage] = useState("");

  const set = (patch: Partial<TransactionFormValues>) =>
    setValues((current) => ({ ...current, ...patch }));

  // Al elegir moneda proponemos su precio de hoy, que es lo más probable. Se hace
  // al elegir y no en un efecto: los precios se refrescan cada minuto y un efecto
  // pisaría lo que la persona ya hubiera escrito.
  const setCoinId = (coinId: string) => {
    const price = suggestedUnitPrice(coins, coinId);
    set(price === null ? { coinId } : { coinId, unitPrice: price });
  };

  const reset = () => {
    setValues(emptyTransactionForm(today()));
    setErrorMessage("");
  };

  /** Valida y, si vale, registra, limpia y avisa con `onDone`. Devuelve si valió. */
  const submit = (): boolean => {
    const result = portfolioScreen.parseTransactionForm(values, coins);
    if (!result.ok) {
      setErrorMessage(result.error);
      return false;
    }
    onRegister(result.value);
    reset();
    onDone();
    return true;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return {
    kind: values.kind,
    setKind: (kind: TransactionKind) => set({ kind }),
    coinId: values.coinId,
    setCoinId,
    amount: values.amount,
    setAmount: (amount: string) => set({ amount }),
    unitPrice: values.unitPrice,
    setUnitPrice: (unitPrice: string) => set({ unitPrice }),
    date: values.date,
    setDate: (date: string) => set({ date }),
    /** Tope del campo de fecha: hoy en hora local. */
    maxDate: today(),
    /** "" si no hay error; si lo hay, va en línea con `role="alert"`. */
    errorMessage,
    /** Total de la operación en vivo, o `null` si aún no se puede calcular. */
    total: operationTotal(values.amount, values.unitPrice),
    /** "Registrar compra" o "Registrar venta". */
    submitLabel: submitLabel(values.kind),
    reset,
    submit,
    handleSubmit,
  };
}

export type TransactionForm = ReturnType<typeof useTransactionForm>;
