
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
    date: new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    price: Math.round(price),
    fullDate: new Date(timestamp).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    })
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
    tooltipBg: isDark ? "#2A2A2A" : "#FFFFFF",
    tooltipBorder: isDark ? "#605F5B" : "#E5E7EB",
    tooltipLabel: isDark ? "#E6E4DD" : "#374151",
    tooltipValue: "#8989DE"
  };

  const formatPrice = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div 
          className="bg-background/95 backdrop-blur-md border border-border/50 rounded-xl p-4 shadow-2xl"
          style={{
            background: `linear-gradient(135deg, ${chartColors.tooltipBg}f0, ${chartColors.tooltipBg}f8)`,
            border: `1px solid ${chartColors.tooltipBorder}`,
          }}
        >
          <p className="text-sm font-medium mb-2" style={{ color: chartColors.tooltipLabel }}>
            {data.fullDate}
          </p>
          <p className="text-lg font-bold" style={{ color: chartColors.tooltipValue }}>
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer">
        <h2 className="text-xl font-semibold mb-6">Bitcoin Performance</h2>
        <div className="w-full h-[200px] flex items-center justify-center">
          <div className="animate-pulse">
            <div className="h-4 bg-muted rounded w-20 mb-2"></div>
            <div className="h-32 bg-muted rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-[1.02] cursor-pointer group border border-border/20 hover:border-border/40">
      <h2 className="text-xl font-semibold mb-6 group-hover:text-primary transition-colors duration-300">Bitcoin Performance</h2>
      <div className="w-full h-[200px] rounded-lg overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={priceData}>
            <XAxis 
              dataKey="date" 
              stroke={chartColors.axis}
              fontSize={13}
              fontWeight={500}
              tick={{ fontSize: 13, fontWeight: 500 }}
            />
            <YAxis 
              stroke={chartColors.axis}
              fontSize={13}
              fontWeight={500}
              tick={{ fontSize: 13, fontWeight: 500 }}
              tickFormatter={formatPrice}
              width={80}
            />
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                stroke: chartColors.line, 
                strokeWidth: 2, 
                strokeDasharray: '4 4',
                strokeOpacity: 0.5 
              }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke={chartColors.line} 
              strokeWidth={3}
              dot={false}
              activeDot={{ 
                r: 8, 
                fill: chartColors.line, 
                strokeWidth: 3, 
                stroke: '#ffffff',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default PortfolioCard;
