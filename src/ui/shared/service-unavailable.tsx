import { CloudOff, RefreshCw, Settings } from "lucide-react";
import { accountServiceNotice } from "@/application/auth-screen/presentation/texts";
import { useSession } from "@/hooks/session/useSession";
import { cn } from "@/lib/utils";
import { Button } from "@/ui/animate-ui/components/buttons/button";

export interface ServiceUnavailableProps {
  /** `useSession().access.reason` cuando `access.kind === "unavailable"`. */
  reason: "unconfigured" | "unreachable";
  /** Qué no se puede hacer mientras tanto: "no puedes iniciar sesión ni usar el analista con IA". */
  what?: string;
  /** Sustituye a la comprobación por defecto (`useSession().recheckService`). */
  onRetry?: () => void;
  /** Sustituye a `useSession().isRecheckingService`. */
  isRetrying?: boolean;
  className?: string;
}

const ICONS = { settings: Settings, "cloud-off": CloudOff } as const;

/**
 * Aviso de «servicio de cuentas no disponible». Distingue "falta configurarlo"
 * de "no responde" y trae «Volver a comprobar», que repite la comprobación sin
 * recargar la página.
 */
export function ServiceUnavailable({ reason, what, onRetry, isRetrying, className }: ServiceUnavailableProps) {
  const { recheckService, isRecheckingService } = useSession();
  const notice = accountServiceNotice(reason, what);
  const Icon = ICONS[notice.icon];
  const retrying = isRetrying ?? isRecheckingService;
  const retry = onRetry ?? (() => void recheckService());

  return (
    <section
      data-slot="service-unavailable"
      aria-labelledby="service-unavailable-title"
      className={cn(
        "mx-auto flex w-full max-w-lg flex-col items-center gap-3 rounded-lg border border-dashed bg-card px-6 py-8 text-center",
        className,
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-5" aria-hidden="true" />
      </span>
      <h2 id="service-unavailable-title" className="type-section text-balance text-foreground">
        {notice.title}
      </h2>
      <p className="text-pretty text-sm text-muted-foreground">{notice.description}</p>
      <p className="text-pretty text-sm text-muted-foreground">
        {notice.meanwhile.before}
        <span className="font-medium text-foreground">{notice.meanwhile.what}</span>
        {notice.meanwhile.after}
      </p>
      {notice.command ? (
        <pre className="w-full overflow-x-auto rounded-md bg-muted p-3 text-left font-mono text-xs text-foreground">
          <code>{notice.command}</code>
        </pre>
      ) : null}
      <Button type="button" variant="outline" className="mt-1 min-h-11" onClick={retry} disabled={retrying}>
        <RefreshCw className={cn(retrying && "animate-spin")} aria-hidden="true" />
        {retrying ? "Comprobando…" : "Volver a comprobar"}
      </Button>
    </section>
  );
}
