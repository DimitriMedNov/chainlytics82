import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { motion } from "motion/react";
import { formatTransactionDate } from "@/application/portfolio-screen/messages";
import { formatAmount, formatCurrency } from "@/application/shared/presentation/format";
import type { TransactionRow } from "@/domain/portfolio-screen/transactionRows";
import { foldUsd } from "@/domain/shared/money";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import { itemLayoutTransition, itemVariants } from "@/ui/pages/portfolio/motion";

export interface TransactionItemProps {
  row: TransactionRow;
  /** Borra el movimiento (sin confirmación) y lanza su aviso. */
  onRemove: (id: string) => void;
}

/**
 * Fila de un movimiento. En móvil el importe baja bajo el texto para que a
 * 320 px no haya scroll horizontal; desde `sm` va en su propia columna.
 * Movimiento (Motion): entra y sale con las variantes de la lista.
 */
export function TransactionItem({ row, onRemove }: TransactionItemProps) {
  const Icon = row.isBuy ? ArrowDownLeft : ArrowUpRight;
  const date = formatTransactionDate(row.happenedAt);

  return (
    <motion.li
      layout="position"
      variants={itemVariants}
      exit="exit"
      transition={itemLayoutTransition}
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
          {row.isBuy ? "Compra" : "Venta"} de <span className="type-num">{formatAmount(row.amount)}</span>{" "}
          {row.symbol}
        </p>
        <p className="text-xs text-muted-foreground">
          <time dateTime={row.happenedAt}>{date}</time>
          {foldUsd(row.unitPrice, (price) => ` · a ${formatCurrency(price)} por unidad`, " · sin precio registrado")}
        </p>
      </div>

      <p className="type-num col-start-2 row-start-2 text-sm font-semibold text-foreground sm:col-start-3 sm:row-start-1 sm:text-right">
        {foldUsd(row.total, (total) => formatCurrency(total), "—")}
      </p>

      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="col-start-3 row-span-2 row-start-1 size-11 text-destructive sm:col-start-4 sm:row-span-1"
        aria-label={`Borrar ${row.kind} de ${row.symbol} del ${date}`}
        onClick={() => onRemove(row.id)}
      >
        <Trash2 aria-hidden="true" />
      </Button>
    </motion.li>
  );
}
