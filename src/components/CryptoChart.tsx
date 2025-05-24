
import { useEffect, useRef } from 'react';

const CryptoChart = () => {
  const widgetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (widgetRef.current) {
      // Clear any existing widget
      widgetRef.current.innerHTML = '';
      
      const script = document.createElement('script');
      script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
      script.type = 'text/javascript';
      script.async = true;
      script.innerHTML = JSON.stringify({
        autosize: true,
        symbol: "BINANCE:BTCUSDT",
        interval: "D",
        timezone: "Etc/UTC",
        theme: "dark",
        style: "1",
        locale: "en",
        enable_publishing: false,
        allow_symbol_change: true,
        calendar: false,
        support_host: "https://www.tradingview.com"
      });
      
      widgetRef.current.appendChild(script);
    }
  }, []);

  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">Bitcoin Price</h2>
      </div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border/20 group-hover:border-border/40 transition-all duration-300">
        <div ref={widgetRef} className="w-full h-full" />
      </div>
    </div>
  );
};

export default CryptoChart;
