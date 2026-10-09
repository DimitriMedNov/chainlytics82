import { BarChart3 } from "lucide-react";
import { Link } from "react-router-dom";
import { SHELL_TEXTS } from "@/application/shared/presentation/texts";
import { cn } from "@/lib/utils";

export interface LogoProps {
  /** Esconde el nombre en pantallas muy estrechas (queda solo para lectores de pantalla). */
  compact?: boolean;
  onNavigate?: () => void;
  className?: string;
}

/** Marca: icono de barras + «Chainlytics». Enlaza al panel. */
export function Logo({ compact = false, onNavigate, className }: LogoProps) {
  return (
    <Link
      to="/"
      onClick={onNavigate}
      aria-label={SHELL_TEXTS.logo.label}
      className={cn("inline-flex min-h-11 min-w-11 shrink-0 items-center gap-2 rounded-md", className)}
    >
      <span className="flex size-8 items-center justify-center rounded-md bg-primary text-primary-foreground shadow-card">
        <BarChart3 className="size-4.5" aria-hidden="true" />
      </span>
      <span
        aria-hidden="true"
        className={cn("text-base font-semibold tracking-tight text-foreground", compact && "hidden xs:inline")}
      >
        {SHELL_TEXTS.brand}
      </span>
    </Link>
  );
}
