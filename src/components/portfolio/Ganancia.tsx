import { formatCurrency, formatPercent } from "@/lib/format";
import { cn } from "@/lib/utils";

export interface GananciaProps {
  value: number | null;
  pct: number | null;
}

/** Cifra con su signo y su color, o "—" cuando el dato no se puede saber. */
export default function Ganancia({ value, pct }: GananciaProps) {
  if (value === null) {
    return <span className="text-muted-foreground">—</span>;
  }
  const sube = value >= 0;
  return (
    <span className={cn("font-semibold", sube ? "text-success" : "text-warning")}>
      {sube ? "+" : "−"}
      {formatCurrency(Math.abs(value))}
      {pct !== null && <span className="ml-1 text-sm font-normal">({formatPercent(pct)})</span>}
    </span>
  );
}
