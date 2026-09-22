import { Check, Copy } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export interface ConversionResultProps {
  id: string;
  label: string;
  result: string;
  copied: boolean;
  onCopy: () => void;
}

const ConversionResult = ({ id, label, result, copied, onCopy }: ConversionResultProps) => {
  return (
    <div className="w-full space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type="text"
          placeholder="Resultado"
          value={result}
          readOnly
          className="h-12 bg-muted pr-14 text-lg font-medium"
        />
        {result !== "" && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onCopy}
            aria-label="Copiar resultado"
            className="absolute right-1 top-1/2 h-11 w-11 -translate-y-1/2"
          >
            {copied ? (
              <Check className="h-4 w-4 text-success" aria-hidden="true" />
            ) : (
              <Copy className="h-4 w-4" aria-hidden="true" />
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ConversionResult;
