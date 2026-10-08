import type { TransactionFormError, TransactionKind } from "../../domain/portfolio-screen/transactionForm.ts";

/** Un aviso (toast) listo para lanzar. */
export interface Notice {
  title: string;
  description: string;
}

/** Errores del formulario "Registrar movimiento", en línea con `role="alert"`. */
export const TRANSACTION_FORM_ERRORS: Record<TransactionFormError, string> = {
  "no-coin": "Elige una criptomoneda.",
  "invalid-amount": "La cantidad debe ser un número mayor que cero.",
  "invalid-price": "El precio no puede ser negativo.",
};

/** Error del diálogo "Coste de {moneda}". */
export const COST_PRICE_ERROR = "Escribe el precio que pagaste por unidad.";

/** Texto del botón de enviar según la pestaña. */
export function submitLabel(kind: TransactionKind): string {
  return kind === "compra" ? "Registrar compra" : "Registrar venta";
}

/** Aviso tras fijar el coste de una posición. */
export function costRegisteredNotice(coinName: string): Notice {
  return {
    title: "Coste registrado",
    description: `Ya podemos calcular la ganancia de ${coinName}.`,
  };
}

/** Aviso tras borrar un movimiento. */
export const TRANSACTION_REMOVED_NOTICE: Notice = {
  title: "Movimiento borrado",
  description: "Las posiciones se han recalculado.",
};

/** Títulos de los dos estados de error de la pantalla. */
export const TRANSACTIONS_ERROR_TITLE = "No se pudieron cargar tus movimientos";
export const PRICES_ERROR_TITLE = "No se pudieron cargar los precios";

/** Estado vacío. */
export const EMPTY_TITLE = "Tu portfolio está vacío";
export const EMPTY_DESCRIPTION =
  "Registra tus compras con el precio que pagaste y verás tu ganancia real, no solo cuánto valen hoy.";

/** Nota bajo la tarjeta "Invertido". */
export function investedNote(positionsWithoutCost: number): string {
  return positionsWithoutCost > 0
    ? `${positionsWithoutCost} ${positionsWithoutCost === 1 ? "posición" : "posiciones"} sin coste, fuera del cálculo`
    : "Coste de todo lo que tienes";
}

/** Fecha de un movimiento: "1 ene 2026". */
export function formatTransactionDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/* ------------------------------------------------------------------------- *
 * Textos que hoy escribe la interfaz a mano (`src/ui/pages/portfolio/**`).
 * Copiados tal cual; solo se añaden, no sustituyen a nada de arriba.
 * ------------------------------------------------------------------------- */

/** Cabecera de la pantalla. */
export const PAGE_TITLE = "Mi portfolio";
export const PAGE_DESCRIPTION = "Valorado a precio de mercado, con tu coste real de compra";
/** Botón de la cabecera y del estado vacío, y título del diálogo de movimiento. */
export const REGISTER_TRANSACTION_LABEL = "Registrar movimiento";

/** Lo que anuncia el skeleton a un lector de pantalla. */
export const LOADING_LABEL = "Cargando tu portfolio";

/** `aria-label` del botón de cerrar de los dos diálogos. */
export const CLOSE_LABEL = "Cerrar";

/** Tarjetas de resumen: etiqueta de cada una y su nota. */
export const CURRENT_VALUE_LABEL = "Valor actual";
export const INVESTED_LABEL = "Invertido";
export const UNREALIZED_GAIN_LABEL = "Ganancia sobre el papel";
export const UNREALIZED_GAIN_HINT = "Si vendieras hoy";
export const REALIZED_GAIN_LABEL = "Ganancia realizada";
export const REALIZED_GAIN_HINT = "De lo que ya vendiste";

/** Nota de "Valor actual": "+1,23 % en 24 h" (recibe el porcentaje ya formateado). */
export function change24hNote(formattedPct: string): string {
  return `${formattedPct} en 24 h`;
}

/** Lo que oye un lector de pantalla donde se pinta "—" por una ganancia desconocida. */
export const UNKNOWN_GAIN_LABEL = "Sin dato";

/** Panel "Distribución" (donut). */
export const DISTRIBUTION_TITLE = "Distribución";
export const DISTRIBUTION_DESCRIPTION = "Cuánto vale cada posición sobre el total";
export const DISTRIBUTION_CHART_ARIA_LABEL = "Gráfica de anillo: valor de cada posición sobre el total";
/** Centro del donut cuando no hay ninguna porción señalada. */
export const DISTRIBUTION_TOTAL_LABEL = "Total";

/** Panel "Peso de cada moneda". */
export const WEIGHTS_TITLE = "Peso de cada moneda";

/** `aria-label` de la barra de peso de una moneda. */
export function weightAriaLabel(coinName: string): string {
  return `Peso de ${coinName}`;
}

/** Panel "Ganancia por posición" (barras). */
export const GAINS_TITLE = "Ganancia por posición";
export const GAINS_DESCRIPTION = "Sobre el papel: si vendieras hoy";
export const GAINS_CHART_ARIA_LABEL = "Gráfica de barras: ganancia sobre el papel de cada posición";
/** Vacío propio de la gráfica de ganancia: ninguna posición tiene coste. */
export const GAINS_EMPTY_TITLE = "Aún no hay ganancia que enseñar";
export const GAINS_EMPTY_DESCRIPTION =
  "Ninguna posición tiene coste. Regístralo en «Mis posiciones» y aquí verás cuánto gana o pierde cada una.";

/** Etiqueta de una posición sin coste: su badge y su fila en la gráfica de ganancia. */
export const NO_COST_LABEL = "Sin coste";

/** Panel "Mis posiciones". */
export const POSITIONS_TITLE = "Mis posiciones";
export const AVG_COST_TERM = "Coste medio:";
export const AVG_COST_UNKNOWN = "sin registrar";
export const INVESTED_TERM = "Invertido:";
export const REALIZED_TERM = "Realizada:";
/** Lo que se pinta donde falta un importe. */
export const UNKNOWN_AMOUNT = "—";
export const NO_COST_EXPLANATION =
  "No sabemos a qué precio la compraste, así que no calculamos su ganancia.";
export const SET_COST_TRIGGER_LABEL = "Registrar el coste";

/** Diálogo "Coste de {moneda}". */
export function costDialogTitle(coinName: string): string {
  return `Coste de ${coinName}`;
}

/** Recibe la cantidad y el precio ya formateados (`formatAmount`, `formatCurrency`). */
export function costDialogDescription(formattedAmount: string, symbol: string, formattedPrice: string): string {
  return `¿A qué precio por unidad compraste tus ${formattedAmount} ${symbol}? Hoy vale ${formattedPrice}.`;
}

export const COST_PRICE_LABEL = "Precio pagado por unidad";
export const COST_PRICE_PLACEHOLDER = "0,00";
export const SET_COST_SUBMIT_LABEL = "Guardar coste";

/** "Invertido: $1.234,00" bajo el campo (recibe el importe ya formateado). */
export function costInvestedNote(formattedInvested: string): string {
  return `${INVESTED_TERM} ${formattedInvested}`;
}

/** Diálogo "Registrar movimiento" (su título es `REGISTER_TRANSACTION_LABEL`). */
export const TRANSACTION_DIALOG_DESCRIPTION =
  "El precio es el que pagaste o cobraste por unidad. Si no lo recuerdas, déjalo vacío: la posición quedará sin coste en vez de con un coste inventado.";
export const TRANSACTION_KIND_ARIA_LABEL = "Tipo de movimiento";
/** Pestañas del diálogo y arranque de cada fila de la lista ("Compra de…"). */
export const TRANSACTION_KIND_LABELS: Record<TransactionKind, string> = {
  compra: "Compra",
  venta: "Venta",
};
export const COIN_FIELD_LABEL = "Criptomoneda";
export const COIN_FIELD_PLACEHOLDER = "Elige una moneda";
export const AMOUNT_FIELD_LABEL = "Cantidad";
export const AMOUNT_FIELD_PLACEHOLDER = "0,5";
export const UNIT_PRICE_FIELD_LABEL = "Precio por unidad";
export const UNIT_PRICE_FIELD_PLACEHOLDER = "Déjalo vacío si no lo sabes";
export const DATE_FIELD_LABEL = "Fecha";
/** Va seguido del importe: "Total de la operación: $1.234,00". */
export const OPERATION_TOTAL_TERM = "Total de la operación:";

/** Opción del select de monedas: "Bitcoin (BTC)". */
export function coinOptionLabel(coinName: string, symbol: string): string {
  return `${coinName} (${symbol})`;
}

/** Panel "Movimientos". */
export function transactionsTitle(count: number): string {
  return `Movimientos (${count})`;
}

export const TRANSACTIONS_EMPTY_TITLE = "Aún no hay movimientos";
export const TRANSACTIONS_EMPTY_DESCRIPTION =
  "Usa «Registrar movimiento», en la cabecera, para apuntar tu primera compra.";
/** Une el tipo con la cantidad en una fila: "Compra de 0,5 BTC". */
export const TRANSACTION_OF = "de";
export const TRANSACTION_NO_PRICE_NOTE = " · sin precio registrado";

/** Segunda mitad de la línea de fecha: " · a $60.000,00 por unidad" (precio ya formateado). */
export function transactionUnitPriceNote(formattedUnitPrice: string): string {
  return ` · a ${formattedUnitPrice} por unidad`;
}

/** `aria-label` de la papelera; `date` es `formatTransactionDate(happenedAt)`. */
export function removeTransactionAriaLabel(kind: TransactionKind, symbol: string, date: string): string {
  return `Borrar ${kind} de ${symbol} del ${date}`;
}
