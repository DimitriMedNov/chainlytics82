import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const emptyStateVariants = cva("flex flex-col items-center justify-center text-center", {
  variants: {
    size: {
      /** Dentro de una tarjeta o de una lista. */
      sm: "gap-2 px-4 py-8",
      /** Ocupa la sección entera. */
      md: "gap-3 px-6 py-12",
    },
    framed: {
      true: "rounded-lg border border-dashed bg-card/50",
      false: "",
    },
  },
  defaultVariants: { size: "md", framed: true },
});

export interface EmptyStateProps extends VariantProps<typeof emptyStateVariants> {
  icon?: LucideIcon;
  title: string;
  /** Por qué está vacío y qué se puede hacer. */
  description?: ReactNode;
  /** La salida del vacío: un botón o un enlace. Obligatoria salvo que no exista ninguna. */
  action?: ReactNode;
  /** Nivel del título según dónde caiga. Por defecto `h2`. */
  headingLevel?: "h1" | "h2" | "h3" | "h4";
  className?: string;
}

/** Estado vacío: icono, título, mensaje y una acción para salir de él. */
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  headingLevel: Heading = "h2",
  size,
  framed,
  className,
}: EmptyStateProps) {
  return (
    <div data-slot="empty-state" className={cn(emptyStateVariants({ size, framed }), className)}>
      {Icon ? (
        <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <Icon className="size-5" aria-hidden="true" />
        </span>
      ) : null}
      <Heading className="type-section text-balance text-foreground">{title}</Heading>
      {description ? (
        <p className="max-w-md text-pretty text-sm text-muted-foreground">{description}</p>
      ) : null}
      {action ? <div className="mt-2 flex flex-wrap items-center justify-center gap-2">{action}</div> : null}
    </div>
  );
}

export { emptyStateVariants };
