import { cn } from "@/lib/utils";
import { Progress, ProgressIndicator } from "@/ui/animate-ui/primitives/radix/progress";
import { useBarEntrance } from "@/ui/coin-detail/useCoinDetailMotion";

export interface RatioBarSlotProps {
  /** Proporción de 0 a 1, ya recortada por el dominio (`figures.*.ratio`). */
  ratio: number;
  /** Qué mide la barra, para lectores de pantalla. */
  label: string;
  /**
   * `fill`: parte de un total (capitalización / FDV, oferta circulante / total).
   * `marker`: posición dentro de un rango (precio entre mínimo y máximo de 24 h).
   */
  variant?: "fill" | "marker";
  /** Texto del extremo izquierdo y derecho (ya formateados). */
  startLabel?: string;
  endLabel?: string;
  className?: string;
}

/** De proporción 0–1 a porcentaje entero, que es lo que entiende la barra. */
function toPercent(ratio: number): number {
  return Math.round(ratio * 100);
}

/**
 * Barra de rango / proporción de una sola cifra.
 *
 * Sin equivalente en Bklit (revisado por `viernes-datos`): el catálogo
 * instalado (`@/ui/charts`) solo trae barras por categorías, cuyo eje acaba
 * siempre en el 110 % del valor mayor (no se puede fijar el total), y anillos.
 * Se queda con `Progress` de Animate UI y un marcador propio. Se monta con
 * sus primitivas (mismas clases que el componente con estilo) para poder
 * decidir la entrada del relleno: ver `useBarEntrance`.
 */
export function RatioBarSlot({
  ratio,
  label,
  variant = "fill",
  startLabel,
  endLabel,
  className,
}: RatioBarSlotProps) {
  const percent = toPercent(ratio);
  const entrance = useBarEntrance();

  return (
    <div data-slot="ratio-bar-slot" data-variant={variant} className={cn("flex flex-col gap-1.5", className)}>
      {variant === "fill" ? (
        <Progress
          value={percent}
          aria-label={label}
          aria-valuetext={`${percent} %`}
          className="relative h-2 w-full overflow-hidden rounded-full bg-muted"
        >
          <ProgressIndicator
            initial={entrance.initial}
            transition={entrance.transition}
            className="h-full w-full flex-1 rounded-full bg-primary"
          />
        </Progress>
      ) : (
        <div
          role="img"
          aria-label={`${label}: ${percent} % del recorrido entre el mínimo y el máximo`}
          className="relative h-2 w-full rounded-full bg-muted"
        >
          <span
            className="absolute top-1/2 size-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-popover bg-primary"
            style={{ left: `${percent}%` }}
          />
        </div>
      )}
      {startLabel || endLabel ? (
        <div className="type-num flex justify-between gap-2 text-2xs text-muted-foreground" aria-hidden="true">
          <span>{startLabel}</span>
          <span>{endLabel}</span>
        </div>
      ) : null}
    </div>
  );
}
