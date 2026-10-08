import type { ComponentProps, ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { PriceChange } from "@/ui/shared/price-change";

const statVariants = cva("flex min-w-0 flex-col gap-1.5 rounded-lg", {
  variants: {
    surface: {
      card: "border bg-card p-4 shadow-card",
      elevated: "border bg-elevated p-4",
      plain: "",
    },
  },
  defaultVariants: { surface: "card" },
});

export interface StatProps extends VariantProps<typeof statVariants> {
  /** Qué es la cifra: "Capitalización total". */
  label: string;
  /** La cifra ya formateada (o un nodo, p. ej. un número animado). */
  value: ReactNode;
  /** Variación en %; pinta `PriceChange`. Omitir si no aplica. */
  change?: number | null;
  /** Periodo de la variación: "24 h". Se ve junto a ella. */
  changePeriod?: string;
  /** Texto de apoyo bajo la cifra, en vez de (o además de) la variación. */
  hint?: ReactNode;
  icon?: LucideIcon;
  /** `lg` para la cifra principal de la pantalla. */
  size?: "md" | "lg";
  className?: string;
}

/** Etiqueta + cifra + variación. Se agrupan con `StatGrid`. */
export function Stat({ label, value, change, changePeriod, hint, icon: Icon, size = "md", surface, className }: StatProps) {
  const hasChange = change !== undefined;

  return (
    <div data-slot="stat" className={cn(statVariants({ surface }), className)}>
      <dt className="type-eyebrow flex items-center gap-1.5 text-muted-foreground">
        {Icon ? <Icon className="size-3.5 shrink-0" aria-hidden="true" /> : null}
        <span className="truncate">{label}</span>
      </dt>
      <dd className="flex min-w-0 flex-col gap-1">
        <span className={cn("truncate text-foreground", size === "lg" ? "type-figure-lg" : "type-figure")}>
          {value}
        </span>
        {hasChange || hint ? (
          <span className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
            {hasChange ? <PriceChange value={change} period={changePeriod ? `en ${changePeriod}` : undefined} /> : null}
            {hasChange && changePeriod ? <span aria-hidden="true">{changePeriod}</span> : null}
            {hint ? <span className="min-w-0">{hint}</span> : null}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

const statGridVariants = cva("grid gap-3 sm:gap-4", {
  variants: {
    columns: {
      2: "grid-cols-1 xs:grid-cols-2",
      3: "grid-cols-1 sm:grid-cols-3",
      4: "grid-cols-1 xs:grid-cols-2 lg:grid-cols-4",
    },
  },
  defaultVariants: { columns: 4 },
});

export interface StatGridProps extends ComponentProps<"dl">, VariantProps<typeof statGridVariants> {}

/** Rejilla de cifras (`<dl>`). Los hijos son `Stat` o `StatSkeleton`. */
export function StatGrid({ columns, className, ...props }: StatGridProps) {
  return <dl className={cn(statGridVariants({ columns }), className)} {...props} />;
}

export { statVariants, statGridVariants };
