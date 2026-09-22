import { HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Ganancia from "@/components/portfolio/Ganancia";
import SetCostDialog from "@/components/portfolio/SetCostDialog";
import { formatAmount, formatCurrency } from "@/lib/format";
import type { Position } from "@/types/portfolio";

export interface PositionsCardProps {
  positions: Position[];
  onSetCost: (position: Position, unitPrice: number) => void;
}

function PositionItem({ position, onSetCost }: { position: Position } & Pick<PositionsCardProps, "onSetCost">) {
  return (
    <li className="rounded-lg border p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 items-center gap-4">
          <img
            src={position.image}
            alt=""
            width={40}
            height={40}
            loading="lazy"
            className="h-10 w-10 flex-shrink-0 rounded-full"
          />
          <div className="min-w-0">
            <h3 className="truncate font-semibold">{position.name}</h3>
            <p className="text-sm text-muted-foreground">
              {formatAmount(position.amount)} {position.symbol} · {formatCurrency(position.price)}
            </p>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="font-semibold">{formatCurrency(position.value)}</p>
          <p className="text-sm">
            <Ganancia value={position.unrealizedPnl} pct={position.unrealizedPnlPct} />
          </p>
        </div>
      </div>

      <dl className="mt-3 flex flex-wrap gap-x-6 gap-y-1 border-t pt-3 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Coste medio:</dt>
          <dd className="font-medium">
            {position.avgCost === null ? (
              <span className="text-muted-foreground">sin registrar</span>
            ) : (
              formatCurrency(position.avgCost)
            )}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Invertido:</dt>
          <dd className="font-medium">
            {position.invested === null ? "—" : formatCurrency(position.invested)}
          </dd>
        </div>
        {position.realizedPnl !== 0 && (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Realizada:</dt>
            <dd>
              <Ganancia value={position.realizedPnl} pct={null} />
            </dd>
          </div>
        )}
      </dl>

      {position.avgCost === null && (
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md bg-muted/60 px-3 py-2">
          <Badge variant="outline" className="gap-1">
            <HelpCircle className="h-3 w-3" aria-hidden="true" />
            Sin coste
          </Badge>
          <p className="flex-1 text-sm text-muted-foreground">
            No sabemos a qué precio la compraste, así que no calculamos su ganancia.
          </p>
          <SetCostDialog
            coinId={position.coinId}
            coinName={position.name}
            symbol={position.symbol}
            amount={position.amount}
            currentPrice={position.price}
            onConfirm={(_coinId, unitPrice) => onSetCost(position, unitPrice)}
          />
        </div>
      )}
    </li>
  );
}

/** Una ficha por moneda con su coste, su ganancia y, si falta, cómo registrar el coste. */
export default function PositionsCard({ positions, onSetCost }: PositionsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Mis posiciones</CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-4">
          {positions.map((position) => (
            <PositionItem key={position.coinId} position={position} onSetCost={onSetCost} />
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
