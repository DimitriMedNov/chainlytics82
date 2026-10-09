import { ArrowDownRight, ArrowUpRight, Minus, type LucideIcon } from "lucide-react";
import type { TrendKey } from "@/domain/markets/charts";

export interface TrendStyle {
  /** Color del anillo (variable del tema, para el SVG de Bklit). */
  color: string;
  /** Clase de texto del mismo color, para la leyenda. */
  textClass: string;
  Icon: LucideIcon;
}

/** Sube = verde, baja = naranja (decisión del proyecto), sin cambio = neutro. */
export const TREND_STYLES: Readonly<Record<TrendKey, TrendStyle>> = {
  up: { color: "hsl(var(--success))", textClass: "text-success", Icon: ArrowUpRight },
  down: { color: "hsl(var(--warning))", textClass: "text-warning", Icon: ArrowDownRight },
  flat: { color: "hsl(var(--muted-foreground))", textClass: "text-muted-foreground", Icon: Minus },
};
