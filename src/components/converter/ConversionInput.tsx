import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface ConversionInputProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const ConversionInput = ({
  id,
  label,
  value,
  onChange,
  placeholder = "0,00",
}: ConversionInputProps) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="number"
        inputMode="decimal"
        min="0"
        step="any"
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 text-lg font-medium"
      />
    </div>
  );
};

export default ConversionInput;
