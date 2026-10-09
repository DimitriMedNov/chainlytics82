import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { PANEL_TEXTS } from "@/application/panel/presentation/texts";
import { cn } from "@/lib/utils";
import { FadeOnChange } from "@/ui/pages/panel/motion/fade-on-change";
import { priceChangeVariants } from "@/ui/shared";

export interface TrendLabelProps {
  /** Texto ya formateado: "+2.45 %" o "-1.23 % (24 h)". */
  text: string;
  /** true: flecha arriba y color de subida. Viene del hook (0 cuenta como subida). */
  rising: boolean;
  size?: "sm" | "md";
  className?: string;
}

/**
 * Variación ya formateada, con flecha, color y texto para lectores (nunca solo color).
 * Cuando el texto cambia en un refresco, hace un fundido corto.
 */
export function TrendLabel({ text, rising, size = "sm", className }: TrendLabelProps) {
  const Icon = rising ? ArrowUpRight : ArrowDownRight;

  return (
    <FadeOnChange
      changeKey={text}
      data-slot="trend-label"
      data-rising={rising}
      className={cn(priceChangeVariants({ direction: rising ? "up" : "down", size }), className)}
    >
      <Icon aria-hidden="true" />
      <span className="sr-only">{rising ? PANEL_TEXTS.trend.rises : PANEL_TEXTS.trend.falls} </span>
      {text}
    </FadeOnChange>
  );
}
