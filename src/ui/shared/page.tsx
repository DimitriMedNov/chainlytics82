import type { ComponentProps, ReactNode } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const pageContainerVariants = cva("mx-auto flex w-full flex-col gap-6 px-4 py-6 sm:px-6 lg:px-8 lg:py-8", {
  variants: {
    width: {
      /** Paneles y tablas: todo el ancho útil (1440 px). */
      full: "max-w-page",
      /** Formularios y lectura. */
      narrow: "max-w-3xl",
      /** Una sola tarjeta centrada (acceso, 404). */
      compact: "max-w-lg",
    },
  },
  defaultVariants: { width: "full" },
});

export interface PageContainerProps
  extends ComponentProps<"div">,
    VariantProps<typeof pageContainerVariants> {}

/** Contenedor de toda pantalla: ancho máximo, márgenes laterales y separación vertical. */
export function PageContainer({ width, className, ...props }: PageContainerProps) {
  return <div className={cn(pageContainerVariants({ width }), className)} {...props} />;
}

export interface PageHeaderProps extends Omit<ComponentProps<"header">, "title"> {
  /** Texto del `h1`. Uno por pantalla. */
  title: ReactNode;
  description?: ReactNode;
  /** Botones de la cabecera; en móvil bajan debajo del título. */
  actions?: ReactNode;
  /** Línea extra bajo la descripción (por ejemplo `StorageBadge` o `SaveStatus`). */
  children?: ReactNode;
}

/** Cabecera de página: `h1`, descripción y acciones. */
export function PageHeader({ title, description, actions, children, className, ...props }: PageHeaderProps) {
  return (
    <header
      className={cn("flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between", className)}
      {...props}
    >
      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="type-title text-balance text-foreground">{title}</h1>
        {description ? (
          <p className="max-w-2xl text-pretty text-sm text-muted-foreground">{description}</p>
        ) : null}
        {children ? <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1">{children}</div> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div> : null}
    </header>
  );
}

const pageGridVariants = cva("grid gap-4 lg:gap-6", {
  variants: {
    layout: {
      /** Una columna. */
      stack: "grid-cols-1",
      /** Dos mitades desde `lg`. */
      halves: "grid-cols-1 lg:grid-cols-2",
      /** Principal (2/3) + lateral (1/3) desde `lg`. */
      main: "grid-cols-1 lg:grid-cols-3 lg:[&>*:first-child]:col-span-2",
    },
  },
  defaultVariants: { layout: "stack" },
});

export interface PageGridProps extends ComponentProps<"div">, VariantProps<typeof pageGridVariants> {}

/** Rejilla de secciones de una página. Los hijos son `Panel`. */
export function PageGrid({ layout, className, ...props }: PageGridProps) {
  return <div className={cn(pageGridVariants({ layout }), "[&>*]:min-w-0", className)} {...props} />;
}

export { pageContainerVariants, pageGridVariants };
