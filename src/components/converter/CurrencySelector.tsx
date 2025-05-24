
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Currency } from "@/types/currency";
import { formatPrice } from "@/utils/currencyUtils";

interface CurrencySelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  currencies: Currency[];
  label: string;
  currentPrice?: number;
  category?: string;
}

const CurrencySelector = ({ 
  value, 
  onValueChange, 
  currencies, 
  label, 
  currentPrice, 
  category 
}: CurrencySelectorProps) => {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        {category && (
          <Badge variant="outline" className="text-xs">
            {category}
          </Badge>
        )}
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-[160px] h-12 border-2">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {currencies.map((currency) => (
            <SelectItem key={currency.symbol} value={currency.symbol}>
              <div className="flex items-center gap-3 w-full">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs">
                  {currency.icon}
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold">{currency.symbol}</span>
                  <span className="text-xs text-muted-foreground">{currency.name}</span>
                </div>
                <div className="ml-auto text-right">
                  <div className="text-xs font-medium">{formatPrice(currency.price)}</div>
                  <div className={`text-xs flex items-center gap-1 ${currency.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {currency.change >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    {Math.abs(currency.change)}%
                  </div>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {currentPrice && (
        <div className="text-sm text-muted-foreground">
          1 {value} = {formatPrice(currentPrice)}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
