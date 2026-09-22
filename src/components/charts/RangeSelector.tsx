import { cn } from "@/lib/utils";

/** Rangos que ofrecemos, en días. */
// eslint-disable-next-line react-refresh/only-export-components
export const RANGES = [
  { days: 1, label: "24 h" },
  { days: 7, label: "7 d" },
  { days: 30, label: "30 d" },
  { days: 90, label: "90 d" },
  { days: 365, label: "1 año" },
] as const;

export type RangeDays = (typeof RANGES)[number]["days"];

export interface RangeSelectorProps {
  value: RangeDays;
  onChange: (days: RangeDays) => void;
  /** Texto para lectores de pantalla: de qué gráfico es este selector. */
  label: string;
  className?: string;
}

/** Botonera para cambiar el periodo de un gráfico. */
export function RangeSelector({ value, onChange, label, className }: RangeSelectorProps) {
  return (
    <div
      role="group"
      aria-label={label}
      className={cn("flex flex-wrap items-center gap-1", className)}
    >
      {RANGES.map((range) => {
        const activo = range.days === value;
        return (
          <button
            key={range.days}
            type="button"
            onClick={() => onChange(range.days)}
            aria-pressed={activo}
            className={cn(
              "min-h-11 rounded-md px-3 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:min-h-0 sm:py-1.5",
              activo
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-accent hover:text-foreground",
            )}
          >
            {range.label}
          </button>
        );
      })}
    </div>
  );
}

export default RangeSelector;
