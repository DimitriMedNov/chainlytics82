import { useRef } from "react";
import { CircleHelp } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  AVG_COST_TERM,
  AVG_COST_UNKNOWN,
  INVESTED_TERM,
  NO_COST_EXPLANATION,
  NO_COST_LABEL,
  REALIZED_TERM,
  UNKNOWN_AMOUNT,
} from "@/application/portfolio-screen/messages";
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
import { useItemMotion } from "@/ui/pages/portfolio/hooks/useItemMotion";
import { QUICK } from "@/ui/pages/portfolio/motion";
import { SetCostDialog } from "@/ui/pages/portfolio/SetCostDialog";

export interface PositionItemProps {
  position: Position;
  /** Lugar en la lista: decide cuánto espera para entrar. */
  index: number;
  /** Fija el coste de esta posición (precio por unidad ya validado). */
  onSetCost: (position: Position, unitPrice: number) => void;
}

/**
 * Ficha de una moneda: qué tienes, cuánto vale, su coste y su ganancia.
 * Movimiento (Motion): entra con la lista; el bloque «Sin coste» se va con un
 * fundido al fijar el coste y las fichas de debajo suben con `transform`.
 * Tras guardar el coste el foco pasa al nombre de la moneda: el botón que abrió
 * el diálogo ya no existe.
 */
export function PositionItem({ position, index, onSetCost }: PositionItemProps) {
  const nameRef = useRef<HTMLHeadingElement>(null);
  const itemMotion = useItemMotion(index);

  return (
    <motion.li
      {...itemMotion}
      data-slot="position-item"
      className="flex flex-col gap-3 px-4 py-4 sm:px-5"
    >
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
        <div className="flex min-w-0 items-center gap-3">
          <CoinAvatar src={position.image} symbol={position.symbol} size="lg" />
          <div className="min-w-0">
            <h3
              ref={nameRef}
              tabIndex={-1}
              className="truncate rounded-sm text-sm font-semibold text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              {position.name}
            </h3>
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
          <dt className="text-muted-foreground">{AVG_COST_TERM}</dt>
          <dd className="type-num font-medium text-foreground">
            {foldUsd(position.avgCost, formatCurrency, AVG_COST_UNKNOWN)}
          </dd>
        </div>
        <div className="flex gap-2">
          <dt className="text-muted-foreground">{INVESTED_TERM}</dt>
          <dd className="type-num font-medium text-foreground">
            {foldUsd(position.invested, formatCurrency, UNKNOWN_AMOUNT)}
          </dd>
        </div>
        {hasRealizedGain(position) ? (
          <div className="flex gap-2">
            <dt className="text-muted-foreground">{REALIZED_TERM}</dt>
            <dd>
              <GainText gain={positionRealizedGain(position)} />
            </dd>
          </div>
        ) : null}
      </dl>

      {/*
        `initial={false}` a propósito: al montar, el bloque entra con el fundido
        de su ficha (un segundo fundido propio lo retrasaría); aquí solo hace
        falta la salida, cuando se fija el coste. No afecta al escalonado de la
        lista, que va en el `AnimatePresence` de `PositionsPanel`.
      */}
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
              {NO_COST_LABEL}
            </Badge>
            <p className="min-w-40 flex-1 text-pretty text-sm text-muted-foreground">
              {NO_COST_EXPLANATION}
            </p>
            <SetCostDialog
              position={position}
              onConfirm={(unitPrice) => onSetCost(position, unitPrice)}
              focusAfterConfirm={nameRef}
            />
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.li>
  );
}
