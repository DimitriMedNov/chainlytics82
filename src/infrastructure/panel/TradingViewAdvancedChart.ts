import type {
  AdvancedChartConfig,
  AdvancedChartHandle,
  AdvancedChartListeners,
  AdvancedChartWidgetPort,
} from "@/application/panel/ports";

/** Script oficial de TradingView para incrustar la gráfica avanzada. */
const SCRIPT_URL = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";

/** Sitio de TradingView al que apuntan los enlaces del widget (clave `support_host`). */
const SUPPORT_HOST = "https://www.tradingview.com";

/**
 * Adaptador del widget de TradingView. El script lee su configuración del
 * texto que lleva dentro, así que se inyecta una etiqueta nueva en cada
 * montaje; no hay forma de actualizar un widget ya cargado.
 */
export function createTradingViewAdvancedChart(): AdvancedChartWidgetPort {
  return {
    mount(
      host: HTMLElement,
      config: AdvancedChartConfig,
      listeners: AdvancedChartListeners,
    ): AdvancedChartHandle {
      let disposed = false;

      host.innerHTML = "";

      const script = document.createElement("script");
      script.src = SCRIPT_URL;
      script.type = "text/javascript";
      script.async = true;
      // `support_host` va la última, igual que siempre: el texto que recibe el
      // script es el mismo, clave por clave y en el mismo orden.
      script.innerHTML = JSON.stringify({ ...config, support_host: SUPPORT_HOST });

      // Tras limpiar, un aviso tardío del script anterior no cuenta.
      const onLoad = () => {
        if (!disposed) listeners.onReady();
      };
      const onError = () => {
        if (!disposed) listeners.onError();
      };
      script.addEventListener("load", onLoad);
      script.addEventListener("error", onError);

      host.appendChild(script);

      return {
        dispose() {
          disposed = true;
          script.removeEventListener("load", onLoad);
          script.removeEventListener("error", onError);
          host.innerHTML = "";
        },
      };
    },
  };
}
