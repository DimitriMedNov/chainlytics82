import { CONVERTER_TEXTS } from "@/application/converter/presentation/texts";
import type { RateChangeBar } from "@/domain/converter/quick";
import { RateChangeChart } from "@/ui/pages/converter/rate-change-chart";

/** Título del bloque de la gráfica; el esqueleto reserva el mismo alto (`h-4` + `mb-3`). */
export const RATE_CHART_TITLE = "type-eyebrow mb-3 text-muted-foreground";

export interface RateChartBlockProps {
  bars: readonly RateChangeBar[];
}

/** Título visible + barras; si ninguna tasa trae cambio de 24 h, un vacío pequeño en el mismo hueco (`h-32`). */
export function RateChartBlock({ bars }: RateChartBlockProps) {
  const texts = CONVERTER_TEXTS.rates;

  return (
    <>
      <h3 className={RATE_CHART_TITLE}>{texts.chartTitle}</h3>
      {bars.length > 0 ? (
        <RateChangeChart bars={bars} />
      ) : (
        <div data-slot="rate-change-empty" className="flex h-32 flex-col items-center justify-center gap-1 text-center">
          <p className="text-sm font-medium text-foreground">{texts.chartEmptyTitle}</p>
          <p className="text-xs text-muted-foreground">{texts.chartEmptyDescription}</p>
        </div>
      )}
    </>
  );
}
