
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

const fetchCryptoData = async () => {
  const response = await fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=5&page=1&sparkline=false');
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const CryptoList = () => {
  const { data: cryptos, isLoading } = useQuery({
    queryKey: ['cryptos'],
    queryFn: fetchCryptoData,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  if (isLoading) {
    return (
      <div className="glass-card rounded-lg p-6 animate-pulse hover:shadow-xl transition-all duration-300 hover:scale-[1.01]">
        <div className="h-6 bg-muted rounded w-48 mb-6"></div>
        <div className="space-y-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex items-center space-x-4">
              <div className="w-8 h-8 bg-muted rounded-full"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded w-24"></div>
                <div className="h-3 bg-muted rounded w-16"></div>
              </div>
              <div className="h-4 bg-muted rounded w-20"></div>
              <div className="h-4 bg-muted rounded w-16"></div>
              <div className="h-4 bg-muted rounded w-12"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-lg p-6 animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group border border-border/20 hover:border-border/40">
      <h2 className="text-xl font-semibold mb-6 group-hover:text-primary transition-colors duration-300">Top Cryptocurrencies</h2>
      <div className="overflow-x-auto rounded-lg">
        <table className="w-full">
          <thead>
            <tr className="text-left text-sm text-muted-foreground border-b border-border/30">
              <th className="pb-4 font-medium">Name</th>
              <th className="pb-4 font-medium">Price</th>
              <th className="pb-4 font-medium">24h Change</th>
              <th className="pb-4 font-medium">Volume</th>
            </tr>
          </thead>
          <tbody>
            {cryptos?.map((crypto) => (
              <tr key={crypto.symbol} className="border-t border-border/20 hover:bg-muted/20 transition-all duration-200 group/row">
                <td className="py-4">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img 
                        src={crypto.image} 
                        alt={crypto.name} 
                        className="w-8 h-8 rounded-full transition-transform duration-200 group-hover/row:scale-110" 
                      />
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-primary/20 to-secondary/20 opacity-0 group-hover/row:opacity-100 transition-opacity duration-200"></div>
                    </div>
                    <div>
                      <p className="font-medium group-hover/row:text-primary transition-colors duration-200">{crypto.name}</p>
                      <p className="text-sm text-muted-foreground">{crypto.symbol.toUpperCase()}</p>
                    </div>
                  </div>
                </td>
                <td className="py-4 font-semibold group-hover/row:text-primary transition-colors duration-200">
                  ${crypto.current_price.toLocaleString()}
                </td>
                <td className="py-4">
                  <span
                    className={`flex items-center gap-1 font-medium transition-all duration-200 ${
                      crypto.price_change_percentage_24h >= 0 
                        ? "text-success group-hover/row:text-green-400" 
                        : "text-warning group-hover/row:text-red-400"
                    }`}
                  >
                    {crypto.price_change_percentage_24h >= 0 ? (
                      <ArrowUpIcon className="w-3 h-3 transition-transform duration-200 group-hover/row:scale-125" />
                    ) : (
                      <ArrowDownIcon className="w-3 h-3 transition-transform duration-200 group-hover/row:scale-125" />
                    )}
                    {Math.abs(crypto.price_change_percentage_24h).toFixed(2)}%
                  </span>
                </td>
                <td className="py-4 font-medium group-hover/row:text-primary transition-colors duration-200">
                  ${(crypto.total_volume / 1e9).toFixed(1)}B
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CryptoList;
