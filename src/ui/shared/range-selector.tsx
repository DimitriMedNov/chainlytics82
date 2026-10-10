import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { SHARED_TEXTS } from "@/application/shared/presentation/texts";
import { RANGES, type RangeDays } from "@/domain/shared/range";
import { cn } from "@/lib/utils";

export interface RangeSelectorProps {
  value: RangeDays;
  onChange: (days: RangeDays) => void;
  /** Nombre del grupo para lectores de pantalla. */
  label?: string;
  disabled?: boolean;
  className?: string;
}

/** El indicador se desliza de un rango a otro: corto y sin rebote. */
const INDICATOR_SLIDE = { type: "spring", stiffness: 420, damping: 36 } as const;
const INDICATOR_INSTANT = { duration: 0 } as const;

/**
 * Selector del rango de una gráfica: 24 h, 7 d, 30 d, 90 d, 1 año.
 * El fondo del valor activo es una sola pieza (`layoutId`) que Motion mueve
 * con `transform`; con «reducir movimiento» aparece ya en su sitio.
 */
export function RangeSelector({
  value,
  onChange,
  label = SHARED_TEXTS.rangeSelector.defaultLabel,
  disabled = false,
  className,
}: RangeSelectorProps) {
  const indicatorId = useId();
  const reduceMotion = useReducedMotion();

  return (
    <div
      role="group"
      aria-label={label}
      className={cn("inline-flex max-w-full items-center rounded-md border bg-muted/60 p-0.5", className)}
    >
      {RANGES.map((range) => {
        const selected = range.days === value;
        return (
          <button
            key={range.days}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => onChange(range.days)}
            className={cn(
              "type-num relative inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap rounded-sm px-2 text-xs font-medium transition-colors sm:px-3",
              "disabled:pointer-events-none disabled:opacity-50",
              selected ? "text-foreground" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {selected ? (
              <motion.span
                // Con «reducir movimiento» no hay `layoutId`: Motion lo aplicaría
                // al instante y dejaría un fotograma con `transform`.
                layoutId={reduceMotion ? undefined : indicatorId}
                aria-hidden="true"
                data-slot="range-indicator"
                className="absolute inset-0 rounded-sm bg-card shadow-card"
                transition={reduceMotion ? INDICATOR_INSTANT : INDICATOR_SLIDE}
              />
            ) : null}
            <span className="relative">{range.label}</span>
          </button>
        );
      })}
    </div>
  );
}
