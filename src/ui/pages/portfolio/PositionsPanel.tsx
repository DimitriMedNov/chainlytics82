import { AnimatePresence, motion } from "motion/react";
import type { Position } from "@/domain/portfolio/types";
import { Panel } from "@/ui/shared";
import { listVariants } from "@/ui/pages/portfolio/motion";
import { PositionItem } from "@/ui/pages/portfolio/PositionItem";

export interface PositionsPanelProps {
  /** `screen.positions`, ya ordenadas por valor de mayor a menor. */
  positions: Position[];
  /** Fija el coste de una posición sin coste. */
  onSetCost: (position: Position, unitPrice: number) => void;
  className?: string;
}

/**
 * «Mis posiciones»: una ficha por moneda. Solo se monta si hay alguna.
 * Movimiento (Motion): las fichas entran escalonadas; una posición nueva entra
 * sola y una que desaparece sale con un fundido mientras las demás se recolocan.
 */
export function PositionsPanel({ positions, onSetCost, className }: PositionsPanelProps) {
  return (
    <Panel aria-labelledby="portfolio-posiciones-titulo" className={className}>
      <Panel.Header>
        <Panel.Title id="portfolio-posiciones-titulo">Mis posiciones</Panel.Title>
      </Panel.Header>
      <Panel.Body padding="flush">
        <motion.ul
          layoutRoot
          variants={listVariants}
          initial="hidden"
          animate="visible"
          className="divide-y"
          data-slot="position-list"
        >
          <AnimatePresence>
            {positions.map((position) => (
              <PositionItem key={position.coinId} position={position} onSetCost={onSetCost} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </Panel.Body>
    </Panel>
  );
}
