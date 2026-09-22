import { useState, type FormEvent } from "react";
import type { Coin } from "@/types/coin";
import type { NewTransaction } from "@/types/portfolio";

export type TransactionKind = "compra" | "venta";

export function hoyEnFormatoInput(): string {
  const ahora = new Date();
  const desfase = ahora.getTimezoneOffset() * 60_000;
  return new Date(ahora.getTime() - desfase).toISOString().slice(0, 10);
}

const parse = (texto: string) => Number.parseFloat(texto.replace(",", "."));

/**
 * Estado y validación del formulario de "Registrar movimiento".
 * `onDone` se llama tras un envío válido, para cerrar el diálogo.
 */
export function useTransactionForm(
  coins: Coin[],
  onAdd: (tx: NewTransaction) => void,
  onDone: () => void,
) {
  const [kind, setKind] = useState<TransactionKind>("compra");
  const [coinId, setCoinIdState] = useState("");
  const [amount, setAmount] = useState("");
  const [unitPrice, setUnitPrice] = useState("");
  const [date, setDate] = useState(hoyEnFormatoInput);
  const [errorMessage, setErrorMessage] = useState("");

  const selected = coins.find((coin) => coin.id === coinId);

  // Al elegir moneda proponemos su precio de hoy, que es lo más probable. Se hace
  // al elegir y no en un efecto: los precios se refrescan cada minuto y un efecto
  // pisaría lo que la persona ya hubiera escrito.
  const setCoinId = (id: string) => {
    setCoinIdState(id);
    const coin = coins.find((c) => c.id === id);
    if (coin) setUnitPrice(String(coin.price));
  };

  const parsedAmount = parse(amount);
  const parsedPrice = parse(unitPrice);
  const total =
    Number.isFinite(parsedAmount) && Number.isFinite(parsedPrice) && parsedAmount > 0
      ? parsedAmount * parsedPrice
      : null;

  const reset = () => {
    setKind("compra");
    setCoinIdState("");
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
    onDone();
  };

  return {
    kind,
    setKind,
    coinId,
    setCoinId,
    amount,
    setAmount,
    unitPrice,
    setUnitPrice,
    date,
    setDate,
    errorMessage,
    total,
    reset,
    handleSubmit,
  };
}
