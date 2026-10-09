import { AnimatePresence, motion } from "motion/react";
import { POSITIONS_TITLE } from "@/application/portfolio-screen/messages";
import type { Position } from "@/domain/portfolio/types";
import { Panel } from "@/ui/shared";
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
        <Panel.Title id="portfolio-posiciones-titulo">{POSITIONS_TITLE}</Panel.Title>
      </Panel.Header>
      <Panel.Body padding="flush">
        <motion.ul
          layoutRoot
          className="divide-y"
          data-slot="position-list"
        >
          <AnimatePresence>
            {positions.map((position, index) => (
              <PositionItem key={position.coinId} position={position} index={index} onSetCost={onSetCost} />
            ))}
          </AnimatePresence>
        </motion.ul>
      </Panel.Body>
    </Panel>
  );
}
