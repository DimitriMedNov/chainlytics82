
import TradingViewWidget from 'react-tradingview-widget';

const CryptoChart = () => {
  return (
    <div className="glass-card p-6 rounded-lg mb-8 animate-fade-in hover:shadow-xl transition-all duration-300 hover:scale-[1.01] cursor-pointer group">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold group-hover:text-primary transition-colors duration-300">Bitcoin Price</h2>
      </div>
      <div className="h-[400px] w-full rounded-lg overflow-hidden border border-border/20 group-hover:border-border/40 transition-all duration-300">
        <TradingViewWidget
          symbol="BINANCE:BTCUSDT"
          theme="dark"
          locale="en"
          autosize
          hide_side_toolbar={false}
          allow_symbol_change={true}
          interval="D"
          toolbar_bg="#141413"
          enable_publishing={false}
          hide_top_toolbar={false}
          save_image={false}
          container_id="tradingview_chart"
        />
      </div>
    </div>
  );
};

export default CryptoChart;
