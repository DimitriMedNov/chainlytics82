import { cva } from "class-variance-authority";
import type { DetailRow } from "@/application/coin-detail/presentation/coinDetailView";
import { cn } from "@/lib/utils";

/** Color del valor según el tono que trae la fila (máximo en verde, mínimo en naranja). */
const detailValueVariants = cva("type-num font-medium", {
  variants: {
    tone: {
      success: "text-success",
      warning: "text-warning",
      neutral: "text-foreground",
    },
  },
  defaultVariants: { tone: "neutral" },
});

export interface DetailRowsProps {
  rows: DetailRow[];
  /** `list`: etiqueta a la izquierda y valor a la derecha. `tiles`: cifras en rejilla de 2. */
  layout?: "list" | "tiles";
  className?: string;
}

/** Filas «etiqueta: valor» ya escritas por `presentCoinDetail`. Solo pinta. */
export function DetailRows({ rows, layout = "list", className }: DetailRowsProps) {
  if (layout === "tiles") {
    return (
      <dl data-slot="detail-tiles" className={cn("grid grid-cols-2 gap-2 sm:gap-3", className)}>
        {rows.map((row) => (
          <div
            key={row.id}
            data-row={row.id}
            className="flex min-w-0 flex-col gap-1 rounded-lg border bg-elevated p-3"
          >
            <dt className="type-eyebrow text-muted-foreground">{row.label}</dt>
            <dd className={cn(detailValueVariants({ tone: row.tone }), "break-words text-sm sm:text-base")}>
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    );
  }

  return (
    <dl data-slot="detail-rows" className={cn("flex flex-col divide-y text-sm", className)}>
      {rows.map((row) => (
        <div
          key={row.id}
          data-row={row.id}
          className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5 py-2 first:pt-0 last:pb-0"
        >
          <dt className="text-muted-foreground">{row.label}</dt>
          <dd className={cn(detailValueVariants({ tone: row.tone }), "min-w-0 break-all text-right")}>
            {row.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
