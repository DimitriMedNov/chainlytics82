
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { useTheme } from "./ThemeProvider";

const fetchBitcoinPrices = async () => {
  const response = await fetch(
    "https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=180&interval=daily"
  );
  const data = await response.json();
  
  // Format data for the chart - take last 6 months
  return data.prices.slice(-180).map(([timestamp, price]: [number, number]) => ({
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short' }),
    price: Math.round(price)
  }));
};

const PortfolioCard = () => {
  const { theme } = useTheme();
  const { data: priceData, isLoading } = useQuery({
    queryKey: ['bitcoinPrices'],
    queryFn: fetchBitcoinPrices,
    refetchInterval: 60000, // Refetch every minute
  });

  // Dynamic colors based on theme
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches);
  
  const chartColors = {
    axis: isDark ? "#E6E4DD" : "#6B7280",
    line: "#8989DE",
    tooltipBg: isDark ? "#3A3935" : "#FFFFFF",
    tooltipBorder: isDark ? "#605F5B" : "#E5E7EB",
    tooltipLabel: isDark ? "#E6E4DD" : "#374151",
    tooltipValue: "#8989DE"
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
        <h2 className="text-xl font-semibold mb-6">Bitcoin Performance</h2>
        <div className="w-full h-[200px] flex items-center justify-center">
          <span className="text-muted-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in">
      <h2 className="text-xl font-semibold mb-6">Bitcoin Performance</h2>
      <div className="w-full h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <XAxis 
              dataKey="date" 
              stroke={chartColors.axis}
              fontSize={12}
            />
            <YAxis 
              stroke={chartColors.axis}
              fontSize={12}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip 
              contentStyle={{ 
                background: chartColors.tooltipBg,
                border: `1px solid ${chartColors.tooltipBorder}`,
                borderRadius: '8px',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
              }}
              labelStyle={{ color: chartColors.tooltipLabel }}
              itemStyle={{ color: chartColors.tooltipValue }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={chartColors.line} 
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioCard;
