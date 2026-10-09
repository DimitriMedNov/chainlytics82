import { Cloud, MonitorSmartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { SHARED_TEXTS } from "@/application/shared/presentation/texts";
import { useSession } from "@/hooks/session/useSession";
import { cn } from "@/lib/utils";

export interface StorageBadgeProps {
  /** `isSynced` del hook de datos: true cuando se guarda en la cuenta. */
  isSynced: boolean;
  className?: string;
}

/**
 * Dice dónde se están guardando los datos. El enlace para iniciar sesión solo
 * sale si de verdad se puede (sin servicio de cuentas sería una promesa falsa).
 */
export function StorageBadge({ isSynced, className }: StorageBadgeProps) {
  const { access } = useSession();
  const base = cn("flex flex-wrap items-center gap-x-1.5 text-xs text-muted-foreground", className);

  if (isSynced) {
    return (
      <p data-slot="storage-badge" className={base}>
        <Cloud className="size-3.5 shrink-0" aria-hidden="true" />
        {SHARED_TEXTS.storage.synced}
      </p>
    );
  }

  return (
    <p data-slot="storage-badge" className={base}>
      <MonitorSmartphone className="size-3.5 shrink-0" aria-hidden="true" />
      {SHARED_TEXTS.storage.localOnly}
      {access.kind === "signed-out" ? (
        <Link
          to="/auth"
          className="inline-flex min-h-11 items-center rounded-sm font-medium text-link underline underline-offset-2 hover:text-foreground"
        >
          {SHARED_TEXTS.storage.signInToSync}
        </Link>
      ) : null}
    </p>
  );
}
