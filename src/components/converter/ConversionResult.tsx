
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Copy, Check } from "lucide-react";

interface ConversionResultProps {
  result: string;
  isLoading: boolean;
  copied: boolean;
  onCopy: () => void;
}

const ConversionResult = ({ result, isLoading, copied, onCopy }: ConversionResultProps) => {
  const hasValidResult = result && result !== "Ingresa un número válido" && result !== "Error en la conversión";

  return (
    <div className="flex-1 relative min-w-0">
      <Input
        type="text"
        placeholder={isLoading ? "Calculando..." : "Resultado"}
        value={isLoading ? "Calculando..." : result}
        readOnly
        className="h-10 sm:h-12 text-base sm:text-lg font-medium bg-gray-50 dark:bg-gray-800 border-2 pr-10 sm:pr-12"
      />
      {hasValidResult && !isLoading && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onCopy}
          className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 sm:h-8 sm:w-8"
        >
          {copied ? <Check className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" /> : <Copy className="h-3 w-3 sm:h-4 sm:w-4" />}
        </Button>
      )}
    </div>
  );
};

export default ConversionResult;
