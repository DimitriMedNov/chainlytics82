import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import { useCardEntrance } from "@/ui/pages/panel/motion/use-card-entrance";
import { Skeleton } from "@/ui/shared";

const statIconVariants = cva("flex size-9 shrink-0 items-center justify-center rounded-full", {
  variants: {
    tone: {
      violet: "bg-chart-1/12 text-chart-1",
      blue: "bg-chart-2/12 text-chart-2",
      amber: "bg-chart-3/12 text-chart-3",
    },
  },
  defaultVariants: { tone: "violet" },
});

const CARD = "flex min-w-0 flex-col gap-3 rounded-lg border bg-card p-4 shadow-card sm:p-5";

export interface StatCardProps extends VariantProps<typeof statIconVariants> {
  /** Qué es la cifra: "Capitalización total". */
  label: string;
  /** La cifra ya formateada. */
  value: ReactNode;
  icon: LucideIcon;
  /** Línea bajo la cifra (la variación). Si falta, se reserva su alto para alinear las tarjetas. */
  detail?: ReactNode;
  /** Mini-gráfica de la tarjeta: va a la derecha de la cifra. Si no hay, la cifra ocupa todo el ancho. */
  chart?: ReactNode;
  /** Posición en la fila (0, 1, 2…): las tarjetas entran una detrás de otra. */
  index?: number;
  className?: string;
}

/** Cifra + variación a la izquierda y mini-gráfica a la derecha. El alto mínimo es el del anillo (`size-16`). */
const FIGURE_ROW = "flex min-h-16 min-w-0 items-center justify-between gap-3";

/**
 * Tarjeta de cifra del Panel: icono + etiqueta, cifra, variación y, si la hay, mini-gráfica.
 * Va dentro de un `<dl>` (pinta `dt` + `dd`). Entra una vez, al montarse (fundido + sube 8 px);
 * los refrescos de datos no la vuelven a montar, así que no repiten la entrada.
 */
export function StatCard({ label, value, icon: Icon, tone, detail, chart, index = 0, className }: StatCardProps) {
  const entrance = useCardEntrance(index);

  return (
    <motion.div data-slot="stat-card" className={cn(CARD, className)} {...entrance}>
      <dt className="flex min-w-0 items-center gap-2.5">
        <span className={statIconVariants({ tone })}>
          <Icon className="size-4.5" aria-hidden="true" />
        </span>
        <span className="type-eyebrow truncate text-muted-foreground">{label}</span>
      </dt>
      <dd className={FIGURE_ROW}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <span data-slot="stat-value" className="type-figure-lg truncate text-foreground">
            {value}
          </span>
          <span className="flex min-h-5 items-center text-xs text-muted-foreground">{detail}</span>
        </div>
        {chart}
      </dd>
    </motion.div>
  );
}

/** Con la forma de `StatCard`: icono + etiqueta, cifra y variación (mismo alto que con datos). */
export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn(CARD, className)}>
      <div className="flex items-center gap-2.5">
        <Skeleton className="size-9 shrink-0 rounded-full" />
        <Skeleton className="h-4 w-28" />
      </div>
      <div className={FIGURE_ROW}>
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <Skeleton className="h-8.5 w-40 max-w-full" />
          <Skeleton className="h-5 w-24" />
        </div>
      </div>
    </div>
  );
}
