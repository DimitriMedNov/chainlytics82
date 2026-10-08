import { CalendarRange, Plus } from "lucide-react";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import { nextWiderRange, type RangeDays } from "@/domain/shared/range";
import { Button } from "@/ui/animate-ui/components/buttons/button";

export interface EmptyActionProps {
  /** Qué vacío es: sin monedas elegidas, o sin instantes comunes en el periodo. */
  reason: "empty-selection" | "empty-no-common";
  days: RangeDays;
  onPickRange: (days: RangeDays) => void;
  /** `false` con el máximo de monedas: no se ofrece añadir. */
  canAddCoin: boolean;
  /** Lleva el foco al selector «Añadir moneda». */
  onAddCoin: () => void;
}

/**
 * La salida de un vacío de la comparación: ampliar el periodo si no hay datos en
 * común (y existe uno mayor) o, si no, ir a añadir una moneda.
 */
export function EmptyAction({ reason, days, onPickRange, canAddCoin, onAddCoin }: EmptyActionProps) {
  const wider = reason === "empty-no-common" ? nextWiderRange(days) : null;

  if (wider) {
    return (
      <Button type="button" variant="outline" className="min-h-11" onClick={() => onPickRange(wider.days)}>
        <CalendarRange aria-hidden="true" />
        {COMPARE_TEXTS.range.widenAction(wider.label)}
      </Button>
    );
  }
  if (!canAddCoin) return null;
  return (
    <Button type="button" variant="outline" className="min-h-11" onClick={onAddCoin}>
      <Plus aria-hidden="true" />
      {COMPARE_TEXTS.picker.addLabel}
    </Button>
  );
}
