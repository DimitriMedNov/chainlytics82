import { UNKNOWN_AMOUNT, UNKNOWN_GAIN_LABEL } from "@/application/portfolio-screen/messages";
import { formatCurrency, formatPercent } from "@/application/shared/presentation/format";
import type { Gain } from "@/domain/portfolio-screen/gain";
import { cn } from "@/lib/utils";

export interface GainTextProps {
  /** Ganancia ya resuelta por el dominio (signo, valor absoluto y porcentaje). */
  gain: Gain;
  /** `false` deja solo el importe (el porcentaje se pinta aparte). Por defecto `true`. */
  showPct?: boolean;
  className?: string;
}

/**
 * Pinta una ganancia: signo + importe + porcentaje si lo hay, o «—» si no se
 * puede saber. Sube en verde, baja en naranja (aviso, no error); el signo va
 * siempre escrito, así que el color nunca es la única señal.
 */
export function GainText({ gain, showPct = true, className }: GainTextProps) {
  if (!gain.known) {
    return (
      <span className={cn("type-num text-muted-foreground", className)}>
        <span aria-hidden="true">{UNKNOWN_AMOUNT}</span>
        <span className="sr-only">{UNKNOWN_GAIN_LABEL}</span>
      </span>
    );
  }

  return (
    <span className={cn("type-num font-medium", gain.rises ? "text-success" : "text-warning", className)}>
      {gain.sign}
      {formatCurrency(gain.absValue)}
      {showPct && gain.pct !== null ? <> ({formatPercent(gain.pct)})</> : null}
    </span>
  );
}
