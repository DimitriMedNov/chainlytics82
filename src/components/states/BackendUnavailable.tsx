import { CloudOff, Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BackendStatus } from "@/lib/backendStatus";

export interface BackendUnavailableProps {
  status: Exclude<BackendStatus, "ready" | "checking">;
  /** Qué se queda sin poder hacer, para decirlo sin rodeos. */
  what: string;
}

/**
 * Explica que el servicio de cuentas no está disponible, distinguiendo entre
 * "falta configurarlo" y "está configurado pero no responde", que se arreglan
 * de formas distintas.
 */
export function BackendUnavailable({ status, what }: BackendUnavailableProps) {
  const sinConfigurar = status === "unconfigured";

  return (
    <Card className="mx-auto max-w-lg border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          {sinConfigurar ? (
            <Settings className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          ) : (
            <CloudOff className="h-6 w-6 text-muted-foreground" aria-hidden="true" />
          )}
        </div>
        <CardTitle>
          {sinConfigurar
            ? "El servicio de cuentas no está configurado"
            : "El servicio de cuentas no responde"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-center">
        <p className="text-sm text-muted-foreground">
          {sinConfigurar
            ? "Faltan las variables de Supabase en el archivo .env."
            : "El proyecto de Supabase configurado no contesta. Puede estar pausado, borrado, o puede que no haya conexión."}
        </p>
        <p className="text-sm text-muted-foreground">
          Mientras tanto, <span className="font-medium text-foreground">{what}</span>. El resto
          de la app funciona con normalidad: los precios no necesitan cuenta.
        </p>
        {sinConfigurar && (
          <pre className="overflow-x-auto rounded-md bg-muted p-3 text-left text-xs">
            <code>{`cp .env.example .env\n# y rellena los tres valores`}</code>
          </pre>
        )}
      </CardContent>
    </Card>
  );
}

export default BackendUnavailable;
