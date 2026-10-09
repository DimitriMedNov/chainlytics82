import {
  DISTRIBUTION_DESCRIPTION,
  DISTRIBUTION_TITLE,
  GAINS_DESCRIPTION,
  GAINS_TITLE,
  WEIGHTS_TITLE,
} from "@/application/portfolio-screen/messages";
import type { DistributionSlice, PositionGainPoint } from "@/domain/portfolio-screen/series";
import { cn } from "@/lib/utils";
import { Panel } from "@/ui/shared";
import { DistributionChart } from "@/ui/pages/portfolio/charts/DistributionChart";
import { GainsChart } from "@/ui/pages/portfolio/charts/GainsChart";
import { WeightList } from "@/ui/pages/portfolio/WeightList";

export interface DistributionSectionProps {
  /** `screen.distribution`. */
  distribution: DistributionSlice[];
  /** `screen.gains`. */
  gains: PositionGainPoint[];
  className?: string;
}

/**
 * Bloque de distribución: tarta, peso de cada moneda y ganancia por posición.
 * Solo se monta con posiciones (`screen.hasPositions`), así que aquí no hay
 * estado vacío ni de carga propios: los pone la pantalla.
 * 1 columna en móvil, 2 desde `lg` (la de ganancia a lo ancho) y 3 desde `xl`.
 */
export function DistributionSection({ distribution, gains, className }: DistributionSectionProps) {
  return (
    <div
      data-slot="portfolio-distribution"
      className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3 [&>*]:min-w-0", className)}
    >
      <Panel aria-labelledby="portfolio-distribucion-titulo">
        <Panel.Header>
          <div>
            <Panel.Title id="portfolio-distribucion-titulo">{DISTRIBUTION_TITLE}</Panel.Title>
            <Panel.Description>{DISTRIBUTION_DESCRIPTION}</Panel.Description>
          </div>
        </Panel.Header>
        <Panel.Body>
          <DistributionChart slices={distribution} />
        </Panel.Body>
      </Panel>

      <Panel aria-labelledby="portfolio-peso-titulo">
        <Panel.Header>
          <Panel.Title id="portfolio-peso-titulo">{WEIGHTS_TITLE}</Panel.Title>
        </Panel.Header>
        <Panel.Body>
          <WeightList slices={distribution} />
        </Panel.Body>
      </Panel>

      <Panel aria-labelledby="portfolio-ganancia-titulo" className="lg:col-span-2 xl:col-span-1">
        <Panel.Header>
          <div>
            <Panel.Title id="portfolio-ganancia-titulo">{GAINS_TITLE}</Panel.Title>
            <Panel.Description>{GAINS_DESCRIPTION}</Panel.Description>
          </div>
        </Panel.Header>
        <Panel.Body>
          <GainsChart points={gains} />
        </Panel.Body>
      </Panel>
    </div>
  );
}
