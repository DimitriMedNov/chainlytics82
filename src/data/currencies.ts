
import { Currency } from "@/types/currency";

export const currencies: Currency[] = [
  { symbol: "BTC", name: "Bitcoin", price: 43500, change: 2.4, category: "Major", icon: "₿" },
  { symbol: "ETH", name: "Ethereum", price: 2650, change: 1.8, category: "Major", icon: "Ξ" },
  { symbol: "ADA", name: "Cardano", price: 0.38, change: -0.5, category: "Alt", icon: "₳" },
  { symbol: "SOL", name: "Solana", price: 98, change: 5.2, category: "Alt", icon: "◎" },
  { symbol: "USDT", name: "Tether", price: 1, change: 0, category: "Stable", icon: "₮" },
  { symbol: "USD", name: "US Dollar", price: 1, change: 0, category: "Fiat", icon: "$" },
  { symbol: "EUR", name: "Euro", price: 0.92, change: 0, category: "Fiat", icon: "€" },
];
