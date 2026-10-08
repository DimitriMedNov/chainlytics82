import { useState, type FormEvent } from "react";
import { useDeps } from "@/app/deps";
import { costInvested } from "@/domain/portfolio-screen/setCost";

export interface UseSetCostFormOptions {
  /** Cantidad de la posición, para calcular "Invertido" en vivo. */
  amount: number;
  /** Recibe el precio por unidad ya validado (mayor que cero). */
  onConfirm: (unitPrice: number) => void;
  /** Se llama tras un envío válido, para cerrar el diálogo. */
  onDone: () => void;
}

/**
 * Estado del diálogo "Coste de {moneda}". Las reglas están en
 * `@/domain/portfolio-screen/setCost`.
 */
export function useSetCostForm({ amount, onConfirm, onDone }: UseSetCostFormOptions) {
  const { portfolioScreen } = useDeps();
  const [unitPrice, setUnitPrice] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /** Limpia lo escrito y el error. Llamar también al cerrar el diálogo. */
  const reset = () => {
    setUnitPrice("");
    setErrorMessage("");
  };

  /** Valida y, si vale, confirma, limpia y avisa con `onDone`. Devuelve si valió. */
  const submit = (): boolean => {
    const result = portfolioScreen.parseCostForm(unitPrice);
    if (!result.ok) {
      setErrorMessage(result.error);
      return false;
    }
    onConfirm(result.value);
    reset();
    onDone();
    return true;
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    submit();
  };

  return {
    unitPrice,
    setUnitPrice,
    /** "" si no hay error; si lo hay, va en línea con `role="alert"`. */
    errorMessage,
    /** "Invertido" en vivo, o `null` mientras el precio no sea válido. */
    invested: costInvested(unitPrice, amount),
    reset,
    submit,
    handleSubmit,
  };
}

export type SetCostForm = ReturnType<typeof useSetCostForm>;
