import { cn } from "@/lib/utils";

export interface ChartLegendItem {
  id: string;
  label: string;
  /** Clase de fondo del punto de color. */
  dotClassName: string;
}

export interface ChartLegendProps {
  items: ChartLegendItem[];
  className?: string;
}

/**
 * Leyenda de una gráfica: punto de color y nombre, para que nada dependa solo del color.
 * Va oculta al lector de pantalla porque el nombre accesible de la gráfica ya lo dice.
 * Una línea de 12 px, como las etiquetas del esqueleto; si no caben, baja a otra línea.
 */
export function ChartLegend({ items, className }: ChartLegendProps) {
  return (
    <ul
      aria-hidden="true"
      data-slot="chart-legend"
      className={cn("flex min-h-3 flex-wrap items-center gap-x-3 gap-y-1 text-2xs leading-3 text-muted-foreground", className)}
    >
      {items.map((item) => (
        <li key={item.id} className="flex items-center gap-1.5">
          <span className={cn("size-2 shrink-0 rounded-full", item.dotClassName)} />
          {item.label}
        </li>
      ))}
    </ul>
  );
}
