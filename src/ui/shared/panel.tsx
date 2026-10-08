import type { ComponentProps } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const panelVariants = cva("flex min-w-0 flex-col rounded-lg text-card-foreground", {
  variants: {
    surface: {
      /** Lo normal: tarjeta sobre el lienzo. */
      card: "border bg-card shadow-card",
      /** Bloque dentro de otra tarjeta. */
      elevated: "border bg-elevated",
      /** Sin caja: solo agrupa cabecera y cuerpo. */
      plain: "",
      /** Hueco por rellenar (vacío, en construcción). */
      dashed: "border border-dashed bg-card/50",
    },
  },
  defaultVariants: { surface: "card" },
});

export interface PanelProps extends ComponentProps<"section">, VariantProps<typeof panelVariants> {}

/**
 * Sección o tarjeta de una página (Compound Components):
 *
 *   <Panel aria-labelledby="top-title">
 *     <Panel.Header>
 *       <div><Panel.Title id="top-title">Top 5</Panel.Title><Panel.Description>…</Panel.Description></div>
 *       <Panel.Actions>…</Panel.Actions>
 *     </Panel.Header>
 *     <Panel.Body>…</Panel.Body>
 *     <Panel.Footer>…</Panel.Footer>
 *   </Panel>
 */
function PanelRoot({ surface, className, ...props }: PanelProps) {
  return <section data-slot="panel" className={cn(panelVariants({ surface }), className)} {...props} />;
}

export type PanelHeaderProps = ComponentProps<"div">;

function PanelHeader({ className, ...props }: PanelHeaderProps) {
  return (
    <div
      data-slot="panel-header"
      className={cn(
        "flex flex-wrap items-start justify-between gap-x-4 gap-y-2 px-4 pt-4 sm:px-5 sm:pt-5",
        className,
      )}
      {...props}
    />
  );
}

export interface PanelTitleProps extends ComponentProps<"h2"> {
  /** Nivel del encabezado. Por defecto `h2` (el `h1` es el de la página). */
  as?: "h2" | "h3" | "h4";
}

function PanelTitle({ as: Heading = "h2", className, ...props }: PanelTitleProps) {
  return <Heading data-slot="panel-title" className={cn("type-section text-foreground", className)} {...props} />;
}

export type PanelDescriptionProps = ComponentProps<"p">;

function PanelDescription({ className, ...props }: PanelDescriptionProps) {
  return (
    <p data-slot="panel-description" className={cn("mt-0.5 text-xs text-muted-foreground", className)} {...props} />
  );
}

export type PanelActionsProps = ComponentProps<"div">;

function PanelActions({ className, ...props }: PanelActionsProps) {
  return (
    <div data-slot="panel-actions" className={cn("flex flex-wrap items-center gap-2", className)} {...props} />
  );
}

const panelBodyVariants = cva("min-w-0 flex-1", {
  variants: {
    padding: {
      default: "p-4 sm:p-5",
      /** Tablas y listas que llegan hasta el borde. */
      flush: "pt-3",
      none: "",
    },
  },
  defaultVariants: { padding: "default" },
});

export interface PanelBodyProps extends ComponentProps<"div">, VariantProps<typeof panelBodyVariants> {}

function PanelBody({ padding, className, ...props }: PanelBodyProps) {
  return <div data-slot="panel-body" className={cn(panelBodyVariants({ padding }), className)} {...props} />;
}

export type PanelFooterProps = ComponentProps<"div">;

function PanelFooter({ className, ...props }: PanelFooterProps) {
  return (
    <div
      data-slot="panel-footer"
      className={cn(
        "flex flex-wrap items-center justify-between gap-2 border-t px-4 py-3 text-xs text-muted-foreground sm:px-5",
        className,
      )}
      {...props}
    />
  );
}

export const Panel = Object.assign(PanelRoot, {
  Header: PanelHeader,
  Title: PanelTitle,
  Description: PanelDescription,
  Actions: PanelActions,
  Body: PanelBody,
  Footer: PanelFooter,
});

export { panelVariants, panelBodyVariants };
