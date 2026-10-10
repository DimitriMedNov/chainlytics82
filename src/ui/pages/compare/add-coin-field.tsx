import { Plus } from "lucide-react";
import { COMPARE_TEXTS } from "@/application/compare/presentation/texts";
import type { Coin } from "@/domain/market/coin";
import { cn } from "@/lib/utils";
import { Label } from "@/ui/base/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/base/select";
import { ADD_COIN_ID } from "@/ui/pages/compare/constants";
import { HopLabel } from "@/ui/pages/compare/hop-label";
import { useLabelHop } from "@/ui/pages/compare/use-label-hop";

export interface AddCoinFieldProps {
  /** Monedas del top 100 que aún no están elegidas. */
  available: Coin[];
  max: number;
  /** Con el máximo a la vista: selector deshabilitado y textos de «lleno». */
  isFull: boolean;
  onAdd: (coinId: string) => void;
  className?: string;
}

const TEXTS = COMPARE_TEXTS.picker;

/** Selector «Añadir moneda» con su etiqueta (que salta al enfocarlo) y su ayuda. */
export function AddCoinField({ available, max, isFull, onAdd, className }: AddCoinFieldProps) {
  const { hop, onFocus, onBlur, onOpenChange } = useLabelHop();
  return (
    <div data-slot="add-coin-field" className={cn("flex min-w-0 flex-col gap-2", className)}>
      <Label htmlFor={ADD_COIN_ID}>
        <HopLabel text={isFull ? TEXTS.fullLabel(max) : TEXTS.addLabel} hop={hop} />
      </Label>
      {/* `value=""` fijo: tras elegir, el selector vuelve a enseñar el texto de ayuda. */}
      <Select value="" onValueChange={onAdd} onOpenChange={onOpenChange} disabled={isFull}>
        <SelectTrigger
          id={ADD_COIN_ID}
          className="w-full data-[size=default]:h-11"
          onFocus={onFocus}
          onBlur={onBlur}
        >
          <SelectValue placeholder={isFull ? TEXTS.fullPlaceholder : TEXTS.addPlaceholder} />
        </SelectTrigger>
        {/* El desplegable base entra con zoom y deslizamiento también con «reducir movimiento»: aquí se apagan. */}
        <SelectContent
          position="popper"
          className="max-h-72 shadow-overlay motion-reduce:data-[state=closed]:animate-none motion-reduce:data-[state=open]:animate-none"
        >
          {available.map((coin) => (
            <SelectItem key={coin.id} value={coin.id} className="min-h-11">
              {TEXTS.optionLabel(coin.name, coin.symbol)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {isFull ? null : (
        <p className="flex items-center gap-1 text-xs text-muted-foreground">
          <Plus className="size-3 shrink-0" aria-hidden="true" />
          {TEXTS.hint(max)}
        </p>
      )}
    </div>
  );
}
