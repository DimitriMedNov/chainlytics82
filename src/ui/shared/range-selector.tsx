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

/** Selector del rango de una gráfica: 24 h, 7 d, 30 d, 90 d, 1 año. */
export function RangeSelector({
  value,
  onChange,
  label = "Rango de la gráfica",
  disabled = false,
  className,
}: RangeSelectorProps) {
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
              "type-num inline-flex min-h-11 min-w-11 items-center justify-center whitespace-nowrap rounded-sm px-2 text-xs font-medium transition-colors sm:px-3",
              "disabled:pointer-events-none disabled:opacity-50",
              selected
                ? "bg-card text-foreground shadow-card"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}
