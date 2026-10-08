import { useId, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { motion } from "motion/react";
import type { DetailRow } from "@/application/coin-detail/presentation/coinDetailView";
import { cn } from "@/lib/utils";
import { DetailRows } from "@/ui/coin-detail/DetailRows";
import { useCardStagger } from "@/ui/coin-detail/useCoinDetailMotion";

const metricAccentVariants = cva("absolute inset-y-4 left-0 w-1 rounded-full", {
  variants: {
    accent: {
      violet: "bg-chart-1",
      blue: "bg-chart-2",
      teal: "bg-chart-4",
    },
  },
  defaultVariants: { accent: "violet" },
});

const metricIconVariants = cva("size-3.5 shrink-0", {
  variants: {
    accent: {
      violet: "text-chart-1",
      blue: "text-chart-2",
      teal: "text-chart-4",
    },
  },
  defaultVariants: { accent: "violet" },
});

export interface MetricCardProps extends VariantProps<typeof metricAccentVariants> {
  icon: LucideIcon;
  title: string;
  /** Cifra principal, ya formateada. Sin ella la tarjeta solo lleva filas. */
  value?: string;
  /** Hueco entre la cifra y las filas: la barra de proporción, si se puede pintar. */
  bar?: ReactNode;
  rows: DetailRow[];
  className?: string;
}

/**
 * Tarjeta de cifra del modal. Estructura del bloque «Stats 2» de Watermelon UI
 * (barra de acento a la izquierda, pastilla con icono y título, cifra grande y
 * detalle debajo) con los tokens del proyecto y sin sus animaciones. La
 * entrada (Motion) la ordena el contenedor: ver `useCardStagger`.
 */
export function MetricCard({ icon: Icon, title, value, bar, rows, accent, className }: MetricCardProps) {
  const titleId = useId();
  const stagger = useCardStagger();

  return (
    <motion.section
      variants={stagger.card}
      aria-labelledby={titleId}
      data-slot="metric-card"
      className={cn(
        "relative flex min-w-0 flex-col gap-3 overflow-hidden rounded-lg border bg-card p-4 shadow-card sm:p-5",
        className,
      )}
    >
      <span aria-hidden="true" data-slot="metric-accent" className={metricAccentVariants({ accent })} />
      <h3
        id={titleId}
        className="type-eyebrow inline-flex w-fit max-w-full items-center gap-1.5 rounded-full bg-muted px-2.5 py-1 text-muted-foreground"
      >
        <Icon className={metricIconVariants({ accent })} aria-hidden="true" />
        <span className="min-w-0 truncate">{title}</span>
      </h3>
      {value ? (
        <p data-slot="metric-value" className="type-figure-lg break-words text-foreground">
          {value}
        </p>
      ) : null}
      {bar}
      <DetailRows rows={rows} />
    </motion.section>
  );
}
