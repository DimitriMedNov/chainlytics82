import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { formatPercent } from "@/application/shared/presentation/format";
import { cn } from "@/lib/utils";

const priceChangeVariants = cva("type-num inline-flex items-center gap-0.5 whitespace-nowrap font-medium", {
  variants: {
    direction: {
      up: "text-success",
      /** Baja = naranja de aviso. `destructive` queda para errores y acciones destructivas. */
      down: "text-warning",
      unknown: "text-muted-foreground",
    },
    appearance: {
      text: "",
      /** Pastilla con fondo tintado, para destacar junto a una cifra. */
      badge: "rounded-sm px-1.5 py-0.5",
    },
    size: {
      sm: "text-xs [&_svg]:size-3",
      md: "text-sm [&_svg]:size-3.5",
    },
  },
  compoundVariants: [
    { appearance: "badge", direction: "up", className: "bg-success/12" },
    { appearance: "badge", direction: "down", className: "bg-warning/12" },
    { appearance: "badge", direction: "unknown", className: "bg-muted" },
  ],
  defaultVariants: { appearance: "text", size: "sm" },
});

export interface PriceChangeProps extends Omit<VariantProps<typeof priceChangeVariants>, "direction"> {
  /** Variación en tanto por ciento (2.45 = +2,45 %). `null` si no se conoce. */
  value: number | null | undefined;
  /** Texto ya formateado, si no se quiere el porcentaje por defecto (p. ej. una ganancia en $). */
  label?: string;
  /** Contexto para lectores de pantalla: "en 24 horas", "en 7 días"... */
  period?: string;
  className?: string;
}

/**
 * Variación con signo, flecha y color (nunca solo color).
 * Conservado: 0 exacto cuenta como subida, igual que en la interfaz anterior.
 */
export function PriceChange({ value, label, period, appearance, size, className }: PriceChangeProps) {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return (
      <span className={cn(priceChangeVariants({ direction: "unknown", appearance, size }), className)}>
        <span aria-hidden="true">—</span>
        <span className="sr-only">Sin dato{period ? ` ${period}` : ""}</span>
      </span>
    );
  }

  const up = value >= 0;
  const Icon = up ? ArrowUpRight : ArrowDownRight;

  return (
    <span className={cn(priceChangeVariants({ direction: up ? "up" : "down", appearance, size }), className)}>
      <Icon aria-hidden="true" />
      <span className="sr-only">{up ? "Sube" : "Baja"} </span>
      {label ?? formatPercent(value)}
      {period ? <span className="sr-only"> {period}</span> : null}
    </span>
  );
}

export { priceChangeVariants };
