
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
    <div className="space-y-2 sm:space-y-3 min-w-0">
      <div className="flex items-center justify-between">
        <label className="text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</label>
        {category && (
          <Badge variant="outline" className="text-xs px-2 py-1">
            {category}
          </Badge>
        )}
      </div>
      <Select value={value} onValueChange={onValueChange}>
        <SelectTrigger className="w-full sm:w-[160px] h-10 sm:h-12 border-2 text-sm sm:text-base">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="max-h-[300px] w-full min-w-[280px]">
          {currencies.map((currency) => (
            <SelectItem key={currency.symbol} value={currency.symbol}>
              <div className="flex items-center gap-2 sm:gap-3 w-full min-w-0">
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xs flex-shrink-0">
                  {currency.icon}
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="font-semibold text-sm sm:text-base truncate">{currency.symbol}</span>
                  <span className="text-xs text-muted-foreground truncate">{currency.name}</span>
                </div>
                <div className="text-right flex-shrink-0">
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
        <div className="text-xs sm:text-sm text-muted-foreground">
          1 {value} = {formatPrice(currentPrice)}
        </div>
      )}
    </div>
  );
};

export default CurrencySelector;
