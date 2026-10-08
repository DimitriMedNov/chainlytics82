import type { TransactionKind } from "@/domain/portfolio-screen/transactionForm";
import { ToggleGroup, ToggleGroupItem } from "@/ui/animate-ui/components/radix/toggle-group";

export interface TransactionKindToggleProps {
  value: TransactionKind;
  onChange: (kind: TransactionKind) => void;
}

const KINDS: { value: TransactionKind; label: string }[] = [
  { value: "compra", label: "Compra" },
  { value: "venta", label: "Venta" },
];

/**
 * Selector Compra / Venta. Adapta el `ToggleGroup` de Animate UI a las props del
 * proyecto: siempre hay una opción elegida (pulsar la activa no la desmarca).
 */
export function TransactionKindToggle({ value, onChange }: TransactionKindToggleProps) {
  const handleChange = (next: string) => {
    const kind = KINDS.find((option) => option.value === next);
    if (kind) onChange(kind.value);
  };

  return (
    <ToggleGroup
      type="single"
      variant="outline"
      value={value}
      onValueChange={handleChange}
      aria-label="Tipo de movimiento"
      className="w-full"
    >
      {KINDS.map((option) => (
        <ToggleGroupItem key={option.value} value={option.value} className="min-h-11">
          {option.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
