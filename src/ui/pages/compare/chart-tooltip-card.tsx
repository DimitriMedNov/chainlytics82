import { cn } from "@/lib/utils";

export interface ChartTooltipRow {
  id: string;
  label: string;
  /** Valor ya formateado. */
  value: string;
  /** Clase de fondo del punto de color (`bg-chart-1`, `bg-success`…). */
  dotClassName: string;
}

export interface ChartTooltipCardProps {
  title: string;
  /** En el orden en que se leen (aquí, de mejor a peor). */
  rows: ChartTooltipRow[];
  className?: string;
}

/** Contenido del tooltip de las gráficas de Comparar: cabecera y una línea por moneda. */
export function ChartTooltipCard({ title, rows, className }: ChartTooltipCardProps) {
  return (
    <div data-slot="chart-tooltip-card" className={cn("px-3 py-2.5", className)}>
      <p className="mb-2 whitespace-nowrap text-xs font-medium text-chart-tooltip-foreground">{title}</p>
      <ul className="flex flex-col gap-1.5">
        {rows.map((row) => (
          <li key={row.id} className="flex items-center gap-2 text-sm">
            <span aria-hidden="true" className={cn("size-2.5 shrink-0 rounded-full", row.dotClassName)} />
            <span className="text-chart-tooltip-muted">{row.label}</span>
            <span className="type-num ml-auto pl-4 font-medium text-chart-tooltip-foreground">{row.value}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
