import { Plus, X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import type { Coin } from "@/types/coin";

export interface CoinPickerProps {
  /** Monedas disponibles para elegir. */
  options: Coin[];
  selected: Coin[];
  colors: string[];
  max: number;
  onAdd: (coinId: string) => void;
  onRemove: (coinId: string) => void;
  disabled?: boolean;
}

/** Elige qué monedas entran en la comparación. */
export function CoinPicker({
  options,
  selected,
  colors,
  max,
  onAdd,
  onRemove,
  disabled = false,
}: CoinPickerProps) {
  const lleno = selected.length >= max;
  const disponibles = options.filter(
    (coin) => !selected.some((elegida) => elegida.id === coin.id),
  );

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {selected.map((coin, index) => (
          <span
            key={coin.id}
            className="flex items-center gap-2 rounded-full border py-1 pl-2 pr-1 text-sm"
          >
            <span
              aria-hidden="true"
              className="h-2.5 w-2.5 flex-shrink-0 rounded-full"
              style={{ backgroundColor: colors[index % colors.length] }}
            />
            <span className="font-medium">{coin.symbol}</span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onRemove(coin.id)}
              aria-label={`Quitar ${coin.name} de la comparación`}
              className="h-11 w-11 sm:h-8 sm:w-8"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
            </Button>
          </span>
        ))}
        {selected.length === 0 && (
          <p className="text-sm text-muted-foreground">Aún no has elegido ninguna moneda.</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="comparar-anadir">
          {lleno ? `Máximo ${max} monedas` : "Añadir moneda"}
        </Label>
        <Select value="" onValueChange={onAdd} disabled={disabled || lleno}>
          <SelectTrigger id="comparar-anadir" className="h-11 w-full sm:w-[280px]">
            <SelectValue
              placeholder={
                lleno ? "Quita una para añadir otra" : "Elige una criptomoneda"
              }
            />
          </SelectTrigger>
          <SelectContent className="max-h-[300px]">
            {disponibles.map((coin) => (
              <SelectItem key={coin.id} value={coin.id}>
                {coin.name} ({coin.symbol})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {!lleno && (
          <p className="flex items-center gap-1 text-xs text-muted-foreground">
            <Plus className="h-3 w-3" aria-hidden="true" />
            Puedes comparar hasta {max} a la vez
          </p>
        )}
      </div>
    </div>
  );
}

export default CoinPicker;
