import { CircleHelp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { formatAmount, formatCurrency } from "@/application/shared/presentation/format";
import {
  hasRealizedGain,
  needsCost,
  positionRealizedGain,
  positionUnrealizedGain,
} from "@/domain/portfolio-screen/gain";
import type { Position } from "@/domain/portfolio/types";
import { foldUsd } from "@/domain/shared/money";
import { Badge } from "@/ui/base/badge";
import { CoinAvatar } from "@/ui/shared";
import { GainText } from "@/ui/pages/portfolio/GainText";
import { QUICK, itemLayoutTransition, itemVariants } from "@/ui/pages/portfolio/motion";
import { SetCostDialog } from "@/ui/pages/portfolio/SetCostDialog";

export interface PositionItemProps {
  position: Position;
  /** Fija el coste de esta posición (precio por unidad ya validado). */
  onSetCost: (position: Position, unitPrice: number) => void;
}

/**
 * Ficha de una moneda: qué tienes, cuánto vale, su coste y su ganancia.
 * Movimiento (Motion): entra con la lista; el bloque «Sin coste» se va con un
 * fundido al fijar el coste y las fichas de debajo suben con `transform`.
 */
export function PositionItem({ position, onSetCost }: PositionItemProps) {
  return (
    <motion.li
      layout="position"
      variants={itemVariants}
      exit="exit"
      transition={itemLayoutTransition}
      data-slot="position-item"
      className="flex flex-col gap-3 px-4 py-4 sm:px-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-3">
          <CoinAvatar src={position.image} symbol={position.symbol} size="lg" />
          <div className="min-w-0">
            <h3 className="truncate text-sm font-semibold text-foreground">{position.name}</h3>
            <p className="type-num text-xs text-muted-foreground">
              {formatAmount(position.amount)} {position.symbol} · {formatCurrency(position.price)}
            </p>
          </div>
        </div>
        <div className="flex min-w-0 flex-col sm:items-end">
          <p className="type-figure text-foreground">{formatCurrency(position.value)}</p>
          <p className="text-sm">
            <GainText gain={positionUnrealizedGain(position)} />
          </p>
        </div>
      </div>

      <dl className="flex flex-wrap gap-x-6 gap-y-1 border-t pt-3 text-sm">
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Coste medio:</dt>
          <dd className="type-num font-medium text-foreground">
            {foldUsd(position.avgCost, formatCurrency, "sin registrar")}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">Invertido:</dt>
          <dd className="type-num font-medium text-foreground">
            {foldUsd(position.invested, formatCurrency, "—")}
          </dd>
        </div>
        {hasRealizedGain(position) ? (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">Realizada:</dt>
            <dd>
              <GainText gain={positionRealizedGain(position)} />
            </dd>
          </div>
        ) : null}
      </dl>

      <AnimatePresence initial={false}>
        {needsCost(position) ? (
          <motion.div
            key="sin-coste"
            data-slot="position-no-cost"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={QUICK}
            className="flex flex-wrap items-center gap-x-3 gap-y-2 rounded-md bg-elevated px-3 py-2"
          >
            <Badge variant="outline">
              <CircleHelp aria-hidden="true" />
              Sin coste
            </Badge>
            <p className="min-w-40 flex-1 text-pretty text-sm text-muted-foreground">
              No sabemos a qué precio la compraste, así que no calculamos su ganancia.
            </p>
            <SetCostDialog position={position} onConfirm={(unitPrice) => onSetCost(position, unitPrice)} />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}
