import { useEffect, useState } from "react";
import { Calculator } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { ErrorState } from "@/components/states/ErrorState";
import type { Convertible } from "@/hooks/useConvertibles";
import { formatAmount } from "@/lib/format";
import ConversionInput from "./ConversionInput";
import SwapButton from "./SwapButton";
import ConversionResult from "./ConversionResult";
import CurrencySelector from "./CurrencySelector";

export interface ConverterFormProps {
  options: Convertible[];
  isPending: boolean;
  isError: boolean;
  errorMessage: string;
  isRetrying: boolean;
  onRetry: () => void;
}

const ConverterForm = ({
  options,
  isPending,
  isError,
  errorMessage,
  isRetrying,
  onRetry,
}: ConverterFormProps) => {
  const [amount, setAmount] = useState("1");
  const [fromCode, setFromCode] = useState("BTC");
  const [toCode, setToCode] = useState("USD");
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const from = options.find((option) => option.code === fromCode);
  const to = options.find((option) => option.code === toCode);

  // El resultado es un valor derivado: se recalcula solo al cambiar entrada o monedas.
  const parsedAmount = Number.parseFloat(amount.replace(",", "."));
  const canConvert =
    from !== undefined && to !== undefined && Number.isFinite(parsedAmount) && parsedAmount > 0;
  const resultValue = canConvert ? (parsedAmount * from.usdPrice) / to.usdPrice : null;
  const result = resultValue === null ? "" : formatAmount(resultValue);

  useEffect(() => {
    if (!copied) return;
    const timer = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(timer);
  }, [copied]);

  const swap = () => {
    setFromCode(toCode);
    setToCode(fromCode);
    // El campo de cantidad necesita un número en crudo, no el texto formateado.
    if (resultValue !== null) setAmount(String(resultValue));
  };

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
    } catch {
      toast({
        title: "No se pudo copiar",
        description: "Tu navegador bloqueó el acceso al portapapeles.",
        variant: "destructive",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
          <Calculator className="h-5 w-5" aria-hidden="true" />
          Convertidor
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isError ? (
          <ErrorState
            title="No se pudieron cargar las tasas"
            message={errorMessage}
            onRetry={onRetry}
            isRetrying={isRetrying}
          />
        ) : isPending ? (
          <div className="space-y-4" aria-busy="true">
            <Skeleton className="h-[72px] w-full" />
            <Skeleton className="mx-auto h-12 w-12 rounded-full" />
            <Skeleton className="h-[72px] w-full" />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
              <ConversionInput id="convert-amount" label="Cantidad" value={amount} onChange={setAmount} />
              <CurrencySelector
                id="convert-from"
                label="Desde"
                value={fromCode}
                onValueChange={setFromCode}
                options={options}
                selected={from}
              />
            </div>

            <SwapButton onClick={swap} />

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_220px]">
              <ConversionResult
                id="convert-result"
                label="Resultado"
                result={result}
                copied={copied}
                onCopy={() => void copyResult()}
              />
              <CurrencySelector
                id="convert-to"
                label="Hacia"
                value={toCode}
                onValueChange={setToCode}
                options={options}
                selected={to}
              />
            </div>

            {canConvert && (
              <p className="text-center text-sm text-muted-foreground">
                {formatAmount(parsedAmount)} {fromCode} = {result} {toCode}
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ConverterForm;
