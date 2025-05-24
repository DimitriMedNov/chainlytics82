
import { Currency } from "@/types/currency";

export const formatPrice = (price: number): string => {
  if (price >= 1000) {
    return `$${price.toLocaleString()}`;
  }
  return `$${price}`;
};

export const getCurrencyInfo = (symbol: string, currencies: Currency[]): Currency | undefined => {
  return currencies.find(c => c.symbol === symbol);
};

export const formatConversionResult = (value: number): string => {
  if (value >= 1) {
    return value.toFixed(2);
  } else if (value >= 0.01) {
    return value.toFixed(4);
  } else {
    return value.toFixed(8);
  }
};
