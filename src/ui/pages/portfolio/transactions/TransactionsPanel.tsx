import type { JSX } from "react";
import { ReceiptText } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { Notice } from "@/application/portfolio-screen/messages";
import type { TransactionRow } from "@/domain/portfolio-screen/transactionRows";
import { EmptyState, Panel, notify } from "@/ui/shared";
import { listVariants } from "@/ui/pages/portfolio/motion";
import { TransactionItem } from "./TransactionItem";

export interface TransactionsPanelProps {
  /** Movimientos ya ordenados del más reciente al más antiguo (`screen.rows`). */
  rows: TransactionRow[];
  /** Número del título: `screen.transactions.length`. */
  count: number;
  /** Borra sin confirmación y devuelve el aviso a lanzar (`screen.removeTransaction`). */
  onRemove: (id: string) => Notice;
}

const TITLE_ID = "portfolio-movimientos-titulo";

/**
 * Sección «Movimientos ({n})»: historial con su importe y su papelera.
 * Movimiento (Motion): las filas entran escalonadas la primera vez; un movimiento
 * nuevo entra solo, arriba, y el borrado sale con un fundido mientras las demás
 * filas se recolocan con `transform`. El borrado y su aviso no esperan a nada.
 */
export function TransactionsPanel({ rows, count, onRemove }: TransactionsPanelProps): JSX.Element {
  const remove = (id: string) => {
    const notice = onRemove(id);
    notify.info(notice.title, { description: notice.description });
  };

  return (
    <Panel aria-labelledby={TITLE_ID}>
      <Panel.Header>
        <Panel.Title id={TITLE_ID}>Movimientos ({count})</Panel.Title>
      </Panel.Header>
      {rows.length === 0 ? (
        <Panel.Body>
          <EmptyState
            icon={ReceiptText}
            size="sm"
            headingLevel="h3"
            title="Aún no hay movimientos"
            description="Usa «Registrar movimiento», en la cabecera, para apuntar tu primera compra."
          />
        </Panel.Body>
      ) : (
        <Panel.Body padding="flush">
          <motion.ul
            layoutRoot
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="divide-y divide-border border-t border-border"
          >
            <AnimatePresence>
              {rows.map((row) => (
                <TransactionItem key={row.id} row={row} onRemove={remove} />
              ))}
            </AnimatePresence>
          </motion.ul>
        </Panel.Body>
      )}
    </Panel>
  );
}
