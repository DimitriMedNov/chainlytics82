import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Link } from "react-router-dom";
import { useSession } from "@/hooks/session/useSession";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/ui/animate-ui/components/radix/dropdown-menu";
import { LogIn } from "@/ui/animate-ui/icons/log-in";
import { LogOut } from "@/ui/animate-ui/icons/log-out";
import { Skeleton } from "@/ui/base/skeleton";
import { useSignOut } from "@/ui/shell/useSignOut";

export interface SessionAreaProps {
  className?: string;
}

/** Texto a enseñar cuando el proveedor de cuentas no da correo. */
export const NO_EMAIL_LABEL = "Tu cuenta";

/**
 * Zona de sesión de la barra (escritorio), según `useSession().access.kind`:
 * comprobando → esqueleto · con sesión → menú con el correo y «Cerrar sesión» ·
 * sin sesión → «Iniciar sesión» · sin servicio de cuentas → nada.
 */
export function SessionArea({ className }: SessionAreaProps) {
  const { access, user } = useSession();
  const { signOut, isSigningOut } = useSignOut();
  // Dónde se pinta el menú: dentro de la barra (`<header>`), no suelto en `<body>`.
  const [menuHost, setMenuHost] = useState<HTMLDivElement | null>(null);

  if (access.kind === "unavailable") return null;

  if (access.kind === "checking") {
    return (
      <div role="status" className={cn("flex min-h-11 items-center", className)}>
        <span className="sr-only">Comprobando la sesión</span>
        <Skeleton className="h-9 w-28" aria-hidden="true" />
      </div>
    );
  }

  if (access.kind === "signed-out") {
    return (
      <Button asChild className={cn("min-h-11", className)}>
        <Link to="/auth">
          <LogIn animateOnHover aria-hidden="true" />
          Iniciar sesión
        </Link>
      </Button>
    );
  }

  const email = user?.email ?? NO_EMAIL_LABEL;

  // `modal={false}`: un menú modal de Radix marca el resto de la página con
  // `aria-hidden` mientras está abierto, y axe lo cuenta como fallo (contenido
  // enfocable oculto, página sin `main` ni `h1`). Escape y un clic fuera lo
  // siguen cerrando. `container`: el menú queda dentro de la región de la barra.
  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={`Cuenta de ${email}`}
            className={cn(
              "inline-flex min-h-11 max-w-56 items-center gap-2 rounded-md border bg-card px-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
              className,
            )}
          >
            <span
              aria-hidden="true"
              className="flex size-7 shrink-0 items-center justify-center rounded-full bg-primary/14 text-xs font-semibold uppercase text-link"
            >
              {email.slice(0, 1)}
            </span>
            <span className="hidden min-w-0 truncate xl:inline">{email}</span>
            <ChevronDown className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent container={menuHost} align="end" className="w-64 rounded-lg p-1.5 shadow-overlay">
          <DropdownMenuLabel className="flex flex-col gap-0.5 px-2 py-1.5">
            <span className="type-eyebrow text-muted-foreground">Sesión iniciada</span>
            <span className="truncate text-sm font-medium text-foreground">{email}</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            variant="destructive"
            disabled={isSigningOut}
            className="min-h-11"
            onSelect={() => void signOut()}
          >
            <LogOut aria-hidden="true" />
            {isSigningOut ? "Cerrando sesión…" : "Cerrar sesión"}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <div ref={setMenuHost} className="contents" />
    </>
  );
}
