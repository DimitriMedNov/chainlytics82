import { ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { motion } from "motion/react";
import {
  formatTransactionDate,
  removeTransactionAriaLabel,
  TRANSACTION_KIND_LABELS,
  TRANSACTION_NO_PRICE_NOTE,
  TRANSACTION_OF,
  transactionUnitPriceNote,
  UNKNOWN_AMOUNT,
} from "@/application/portfolio-screen/messages";
import { formatAmount, formatCurrency } from "@/application/shared/presentation/format";
import type { TransactionRow } from "@/domain/portfolio-screen/transactionRows";
import { foldUsd } from "@/domain/shared/money";
import { cn } from "@/lib/utils";
import { useItemMotion } from "@/ui/pages/portfolio/hooks/useItemMotion";
import { RemoveTransactionButton } from "./RemoveTransactionButton";

export interface TransactionItemProps {
  row: TransactionRow;
  /** Lugar en la lista: decide cuánto espera para entrar. */
  index: number;
  /** Borra el movimiento (sin confirmación) y lanza su aviso. */
  onRemove: (id: string) => void;
}

/**
 * Fila de un movimiento. En móvil el importe baja bajo el texto para que a
 * 320 px no haya scroll horizontal; desde `sm` va en su propia columna.
 * Movimiento (Motion): entra y sale con las variantes de la lista; la papelera
 * confirma el borrado en su sitio (`RemoveTransactionButton`).
 */
export function TransactionItem({ row, index, onRemove }: TransactionItemProps) {
  const Icon = row.isBuy ? ArrowDownLeft : ArrowUpRight;
  const date = formatTransactionDate(row.happenedAt);
  // La salida espera un instante: así se ve la marca de «hecho» de la papelera.
  const itemMotion = useItemMotion(index, true);

  return (
    <motion.li
      {...itemMotion}
      data-slot="transaction-item"
      data-kind={row.kind}
      className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:px-5"
    >
      <span
        className={cn(
          "col-start-1 row-start-1 flex size-9 items-center justify-center rounded-full",
          row.isBuy ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
        )}
      >
        <Icon className="size-4" aria-hidden="true" />
      </span>

      <div className="col-start-2 row-start-1 min-w-0">
        <p className="text-sm font-medium text-foreground">
          {TRANSACTION_KIND_LABELS[row.kind]} {TRANSACTION_OF} <span className="type-num">{formatAmount(row.amount)}</span>{" "}
          {row.symbol}
        </p>
        <p className="text-xs text-muted-foreground">
          <time dateTime={row.happenedAt}>{date}</time>
          {foldUsd(row.unitPrice, (price) => transactionUnitPriceNote(formatCurrency(price)), TRANSACTION_NO_PRICE_NOTE)}
        </p>
      </div>

      <p className="type-num col-start-2 row-start-2 text-sm font-semibold text-foreground sm:col-start-3 sm:row-start-1 sm:text-right">
        {foldUsd(row.total, (total) => formatCurrency(total), UNKNOWN_AMOUNT)}
      </p>

      <RemoveTransactionButton
        className="col-start-3 row-span-2 row-start-1 size-11 sm:col-start-4 sm:row-span-1"
        label={removeTransactionAriaLabel(row.kind, row.symbol, date)}
        onRemove={() => onRemove(row.id)}
      />
    </motion.li>
  );
}
