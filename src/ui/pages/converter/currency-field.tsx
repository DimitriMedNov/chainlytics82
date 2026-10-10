import { CONVERTER_TEXTS, CONVERTIBLE_KIND_LABELS } from "@/application/converter/presentation/texts";
import { unitPriceText } from "@/application/converter/presentation/conversionText";
import type { Convertible } from "@/domain/converter/convertible";
import { Badge } from "@/ui/base/badge";
import { Label } from "@/ui/base/label";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/base/select";

/**
 * Con «reducir movimiento» el desplegable aparece y se va sin animación: la del
 * Select base lleva escala 0,95 y 8 px de desplazamiento dentro del mismo fotograma clave.
 */
const LIST_REDUCED_MOTION =
  "motion-reduce:data-[state=open]:animate-none motion-reduce:data-[state=closed]:animate-none";

export interface CurrencyFieldProps {
  /** `id` del selector, al que apunta su etiqueta. */
  id: string;
  label: string;
  /** Código elegido. */
  value: string;
  /** La opción elegida; `undefined` si su código no está en la lista. */
  selected: Convertible | undefined;
  options: readonly Convertible[];
  onChange: (code: string) => void;
}

/** Selector de moneda: etiqueta + badge «cripto»/«fiat», 35 opciones y el precio de 1 unidad debajo. */
export function CurrencyField({ id, label, value, selected, options, onChange }: CurrencyFieldProps) {
  return (
    <div data-slot="currency-field" className="flex min-w-0 flex-col gap-2">
      <div className="flex min-h-6 items-center gap-2">
        <Label htmlFor={id}>{label}</Label>
        {selected ? <Badge variant="outline">{CONVERTIBLE_KIND_LABELS[selected.kind]}</Badge> : null}
      </div>
      {/* Sin opción que coincida, valor vacío: así Radix enseña el texto «Elige». */}
      <Select value={selected ? value : ""} onValueChange={onChange}>
        <SelectTrigger id={id} className="w-full min-w-0 bg-card data-[size=default]:h-11">
          <SelectValue placeholder={CONVERTER_TEXTS.form.currencyPlaceholder} />
        </SelectTrigger>
        <SelectContent position="popper" className={cn("max-h-72 bg-popover shadow-overlay", LIST_REDUCED_MOTION)}>
          {options.map((option) => (
            // Conservado: la clave es el código (inventario: dos criptos con el mismo símbolo la repetirían).
            <SelectItem key={option.code} value={option.code} className="min-h-11">
              <span className="font-semibold">{option.code}</span>
              <span className="truncate text-muted-foreground">{option.name}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="type-num min-h-4 text-xs text-muted-foreground">{selected ? unitPriceText(selected) : null}</p>
    </div>
  );
}
