import { ArrowDownLeft, ArrowUpRight, Trash2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatAmount, formatCurrency } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { Transaction } from "@/types/portfolio";

export interface TransactionsCardProps {
  transactions: Transaction[];
  onRemove: (id: string) => void;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

/** Historial de movimientos, del más reciente al más antiguo. */
const TransactionsCard = ({ transactions, onRemove }: TransactionsCardProps) => {
  const ordenadas = [...transactions].sort(
    (a, b) => new Date(b.happenedAt).getTime() - new Date(a.happenedAt).getTime(),
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Movimientos ({transactions.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-3">
          {ordenadas.map((tx) => {
            const esCompra = tx.kind === "compra";
            return (
              <li
                key={tx.id}
                className="flex flex-col gap-3 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span
                    className={cn(
                      "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full",
                      esCompra ? "bg-success/15 text-success" : "bg-warning/15 text-warning",
                    )}
                  >
                    {esCompra ? (
                      <ArrowDownLeft className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                    )}
                  </span>
                  <div className="min-w-0">
                    <p className="font-medium">
                      {esCompra ? "Compra" : "Venta"} de {formatAmount(tx.amount)} {tx.symbol}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(tx.happenedAt)}
                      {tx.unitPrice === null
                        ? " · sin precio registrado"
                        : ` · a ${formatCurrency(tx.unitPrice)} por unidad`}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <p className="font-semibold">
                    {tx.unitPrice === null ? "—" : formatCurrency(tx.amount * tx.unitPrice)}
                  </p>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-destructive"
                    aria-label={`Borrar ${tx.kind} de ${tx.symbol} del ${formatDate(tx.happenedAt)}`}
                    onClick={() => onRemove(tx.id)}
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </Button>
                </div>
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
};

export default TransactionsCard;
