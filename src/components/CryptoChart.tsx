import { useEffect, useRef } from "react";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

/**
 * Widget de TradingView. Se vuelve a montar al cambiar de tema porque el
 * script no expone forma de actualizarlo una vez inyectado.
 */
const CryptoChart = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useResolvedTheme();

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "D",
      timezone: "Etc/UTC",
      theme,
      style: "1",
      locale: "es",
      enable_publishing: false,
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(script);

    return () => {
      container.innerHTML = "";
    };
  }, [theme]);

  return (
    <section className="glass-card mb-8 animate-fade-in rounded-lg p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">Precio de Bitcoin</h2>
      </div>
      <div className="h-[400px] w-full overflow-hidden rounded-lg border border-border/20">
        <div ref={containerRef} className="h-full w-full" />
      </div>
    </section>
  );
};

export default CryptoChart;
