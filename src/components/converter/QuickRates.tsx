
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Currency } from "@/types/currency";
import { formatPrice } from "@/utils/currencyUtils";

interface QuickRatesProps {
  currencies: Currency[];
}

const QuickRates = ({ currencies }: QuickRatesProps) => {
  return (
    <Card className="shadow-lg border-0">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <TrendingUp className="h-5 w-5 text-green-600" />
          Tasas Actuales
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currencies.slice(0, 4).map((currency) => (
            <div key={currency.symbol} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
                  {currency.icon}
                </div>
                <div>
                  <div className="font-semibold">{currency.symbol}</div>
                  <div className="text-xs text-muted-foreground">{currency.name}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-semibold">{formatPrice(currency.price)}</div>
                <div className={`text-xs flex items-center gap-1 justify-end ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currency.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                  {Math.abs(currency.change)}%
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuickRates;
