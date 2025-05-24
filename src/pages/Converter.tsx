
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { currencies } from "@/data/currencies";
import { getCurrencyInfo, formatConversionResult } from "@/utils/currencyUtils";
import CurrencySelector from "@/components/converter/CurrencySelector";
import ConversionResult from "@/components/converter/ConversionResult";
import QuickRates from "@/components/converter/QuickRates";
import QuickConversions from "@/components/converter/QuickConversions";

const Converter = () => {
  const [fromAmount, setFromAmount] = useState("");
  const [fromCurrency, setFromCurrency] = useState("BTC");
  const [toCurrency, setToCurrency] = useState("USD");
  const [result, setResult] = useState("");
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const convertCurrency = () => {
    console.log("Converting:", fromAmount, fromCurrency, "to", toCurrency);
    
    if (!fromAmount || fromAmount === "0") {
      setResult("");
      toast({
        title: "Error",
        description: "Por favor ingresa una cantidad válida",
        variant: "destructive"
      });
      return;
    }

    const amount = parseFloat(fromAmount);
    if (isNaN(amount) || amount <= 0) {
      setResult("Ingresa un número válido");
      toast({
        title: "Error", 
        description: "La cantidad debe ser un número positivo",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      try {
        const fromPrice = getCurrencyInfo(fromCurrency, currencies)?.price || 1;
        const toPrice = getCurrencyInfo(toCurrency, currencies)?.price || 1;
        
        console.log("From price:", fromPrice, "To price:", toPrice);
        
        const amountInUSD = amount * fromPrice;
        const convertedValue = amountInUSD / toPrice;
        
        console.log("Amount in USD:", amountInUSD, "Converted value:", convertedValue);
        
        const formattedResult = formatConversionResult(convertedValue);
        setResult(formattedResult);
        
        toast({
          title: "Conversión exitosa",
          description: `${amount} ${fromCurrency} = ${formattedResult} ${toCurrency}`,
        });
      } catch (error) {
        console.error("Error en conversión:", error);
        setResult("Error en la conversión");
        toast({
          title: "Error",
          description: "No se pudo realizar la conversión",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    }, 500);
  };

  const swapCurrencies = () => {
    console.log("Swapping currencies");
    const tempCurrency = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(tempCurrency);
    
    if (result && result !== "Ingresa un número válido" && result !== "Error en la conversión") {
      setFromAmount(result);
      setResult("");
    }
    
    toast({
      title: "Monedas intercambiadas",
      description: `Ahora convirtiendo de ${toCurrency} a ${tempCurrency}`,
    });
  };

  const copyResult = async () => {
    if (!result || result === "Ingresa un número válido" || result === "Error en la conversión") {
      toast({
        title: "Error",
        description: "No hay resultado válido para copiar",
        variant: "destructive"
      });
      return;
    }

    try {
      await navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      
      toast({
        title: "Copiado",
        description: "Resultado copiado al portapapeles",
      });
    } catch (error) {
      console.error("Error al copiar:", error);
      toast({
        title: "Error",
        description: "No se pudo copiar al portapapeles",
        variant: "destructive"
      });
    }
  };

  useEffect(() => {
    if (fromAmount && parseFloat(fromAmount) > 0) {
      convertCurrency();
    } else {
      setResult("");
    }
  }, [fromCurrency, toCurrency]);

  const fromCurrencyInfo = getCurrencyInfo(fromCurrency, currencies);
  const toCurrencyInfo = getCurrencyInfo(toCurrency, currencies);

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Convertidor de Cryptos
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base lg:text-lg px-4">
          Convierte entre diferentes criptomonedas y monedas fiat con tasas actualizadas
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-8">
        <div className="lg:col-span-2">
          <Card className="shadow-lg border-0 bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                <Calculator className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                Convertidor
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 sm:space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-3">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="h-12 text-lg font-medium border-2 focus:border-blue-500"
                    min="0"
                    step="any"
                  />
                  <CurrencySelector
                    value={fromCurrency}
                    onValueChange={setFromCurrency}
                    currencies={currencies}
                    label="Desde"
                    currentPrice={fromCurrencyInfo?.price}
                    category={fromCurrencyInfo?.category}
                  />
                </div>

                <div className="flex justify-center py-2">
                  <Button 
                    variant="outline" 
                    size="icon" 
                    onClick={swapCurrencies}
                    className="h-12 w-12 rounded-full border-2 hover:bg-blue-50 hover:border-blue-300 transition-all duration-200"
                    disabled={isLoading}
                  >
                    <ArrowUpDown className="h-5 w-5" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-3">
                  <ConversionResult
                    result={result}
                    isLoading={isLoading}
                    copied={copied}
                    onCopy={copyResult}
                  />
                  <CurrencySelector
                    value={toCurrency}
                    onValueChange={setToCurrency}
                    currencies={currencies}
                    label="Hacia"
                    currentPrice={toCurrencyInfo?.price}
                    category={toCurrencyInfo?.category}
                  />
                </div>

                <Button 
                  onClick={convertCurrency} 
                  className="w-full h-12 text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? "Convirtiendo..." : "Convertir"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4 lg:space-y-6">
          <QuickRates currencies={currencies} />
          <QuickConversions />
        </div>
      </div>
    </div>
  );
};

export default Converter;
