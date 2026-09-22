import { Cloud, MonitorSmartphone } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export interface StorageBadgeProps {
  /** true cuando los datos viven en la cuenta del usuario. */
  isSynced: boolean;
}

/** Dice sin rodeos dónde se están guardando los datos. */
export function StorageBadge({ isSynced }: StorageBadgeProps) {
  const { canSignIn } = useAuth();

  if (isSynced) {
    return (
      <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Cloud className="h-3.5 w-3.5" aria-hidden="true" />
        Guardado en tu cuenta
      </p>
    );
  }

  return (
    <p className="flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
      <MonitorSmartphone className="h-3.5 w-3.5" aria-hidden="true" />
      Solo en este navegador.
      {/* Sin servicio de cuentas, invitar a sincronizar sería una promesa falsa. */}
      {canSignIn && (
        <Link to="/auth" className="rounded underline underline-offset-2 hover:text-foreground">
          Inicia sesión para sincronizar
        </Link>
      )}
    </p>
  );
}

export default StorageBadge;
