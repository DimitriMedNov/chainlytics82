import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/format";
import type { Convertible } from "@/hooks/useConvertibles";

export interface CurrencySelectorProps {
  id: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Convertible[];
  label: string;
  selected?: Convertible;
}

const CurrencySelector = ({
  id,
  value,
  onValueChange,
  options,
  label,
  selected,
}: CurrencySelectorProps) => {
  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between gap-2">
        <Label htmlFor={id}>{label}</Label>
        {selected && (
          <Badge variant="outline" className="text-xs capitalize">
            {selected.kind}
          </Badge>
        )}
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger id={id} className="h-12 w-full">
          <SelectValue placeholder="Elige" />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {options.map((option) => (
            <SelectItem key={option.code} value={option.code}>
              <span className="flex w-full items-center gap-2">
                <span className="font-semibold">{option.code}</span>
                <span className="truncate text-xs text-muted-foreground">{option.name}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {selected && (
        <p className="text-sm text-muted-foreground">
          1 {selected.code} = {formatCurrency(selected.usdPrice)}
        </p>
      )}
    </div>
  );
};

export default CurrencySelector;
