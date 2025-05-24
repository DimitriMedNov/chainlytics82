
import { Input } from "@/components/ui/input";

interface ConversionInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

const ConversionInput = ({ value, onChange, placeholder = "0.00", disabled = false }: ConversionInputProps) => {
  return (
    <Input
      type="number"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-12 text-lg font-medium border-2 focus:border-blue-500"
      min="0"
      step="any"
      disabled={disabled}
    />
  );
};

export default ConversionInput;
