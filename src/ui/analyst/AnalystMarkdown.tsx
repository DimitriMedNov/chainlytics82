import { createElement, type HTMLAttributes } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import { cn } from "@/lib/utils";
import { ANALYST_TEXTS } from "@/application/analyst/presentation/texts";

interface MarkdownElementProps extends HTMLAttributes<HTMLElement> {
  /** Nodo del árbol que pasa react-markdown: no debe llegar al DOM. */
  node?: unknown;
}

/** Etiqueta HTML con las clases del proyecto (sustituye a `prose`, que no está cargado). */
function styled(tag: string, base: string) {
  return function MarkdownElement({ node, className, ...rest }: MarkdownElementProps) {
    void node;
    return createElement(tag, { ...rest, className: cn(base, className) });
  };
}

function MarkdownLink({ node, className, children, ...rest }: MarkdownElementProps) {
  void node;
  return (
    <a {...rest} target="_blank" rel="noreferrer noopener" className={cn("text-link underline underline-offset-2", className)}>
      {children}
    </a>
  );
}

/**
 * Bloque de código: tiene scroll horizontal, así que entra en el orden de Tab
 * (con foco se desplaza con las flechas) y se anuncia como grupo con nombre.
 * Es `group` y no `region` para no crear un landmark repetido por cada bloque.
 */
function MarkdownPre({ node, className, children, ...rest }: MarkdownElementProps) {
  void node;
  return (
    <pre
      {...rest}
      tabIndex={0}
      role="group"
      aria-label={ANALYST_TEXTS.codeBlockLabel}
      className={cn(
        "my-2 overflow-x-auto rounded-md bg-background p-3 text-xs",
        "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
        className,
      )}
    >
      {children}
    </pre>
  );
}

const COMPONENTS: Components = {
  p: styled("p", "my-1 first:mt-0 last:mb-0"),
  h1: styled("h1", "mb-1 mt-3 text-base font-semibold first:mt-0"),
  h2: styled("h2", "mb-1 mt-3 text-base font-semibold first:mt-0"),
  h3: styled("h3", "mb-1 mt-2 text-sm font-semibold first:mt-0"),
  h4: styled("h4", "mb-1 mt-2 text-sm font-semibold first:mt-0"),
  ul: styled("ul", "my-1 list-disc space-y-1 pl-5"),
  ol: styled("ol", "my-1 list-decimal space-y-1 pl-5"),
  li: styled("li", "pl-1"),
  strong: styled("strong", "font-semibold"),
  blockquote: styled("blockquote", "my-2 border-l-2 border-border pl-3 text-muted-foreground"),
  hr: styled("hr", "my-3 border-border"),
  code: styled("code", "rounded-sm bg-background px-1 py-0.5 font-mono text-xs"),
  pre: MarkdownPre,
  a: MarkdownLink,
};

export interface AnalystMarkdownProps {
  /** Texto en Markdown de la respuesta. */
  children: string;
}

/** Respuesta del asistente renderizada como Markdown con los tokens del proyecto. */
export function AnalystMarkdown({ children }: AnalystMarkdownProps) {
  return (
    <div data-slot="analyst-markdown" className="min-w-0">
      <ReactMarkdown components={COMPONENTS}>{children}</ReactMarkdown>
    </div>
  );
}
