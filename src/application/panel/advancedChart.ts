import type { ResolvedTheme } from "../../domain/theme/theme.ts";
import type {
  AdvancedChartConfig,
  AdvancedChartHandle,
  AdvancedChartListeners,
  AdvancedChartWidgetPort,
} from "./ports.ts";

/** Estado de la carga del widget, para que la interfaz pinte cada caso. */
export type AdvancedChartStatus = "loading" | "ready" | "error";

/**
 * Configuración del widget «Precio de Bitcoin» del Panel: BTC/USDT de
 * Binance, velas diarias, en español. Solo cambia el tema.
 */
export function bitcoinAdvancedChartConfig(theme: ResolvedTheme): AdvancedChartConfig {
  return {
    autosize: true,
    symbol: "BINANCE:BTCUSDT",
    interval: "D",
    timezone: "Etc/UTC",
    theme,
    style: "1",
    locale: "es",
    enable_publishing: false,
    // Conservado: el bloque se titula «Precio de Bitcoin» pero el widget deja
    // cambiar de símbolo (inventario §9 nº 23).
    allow_symbol_change: true,
    calendar: false,
  };
}

export interface PanelUseCases {
  /**
   * Monta la gráfica avanzada de Bitcoin en `host` con el tema dado. Para
   * cambiar de tema hay que limpiar y volver a montar: el widget no se
   * puede actualizar una vez cargado.
   */
  mountBitcoinChart(
    host: HTMLElement,
    theme: ResolvedTheme,
    listeners: AdvancedChartListeners,
  ): AdvancedChartHandle;
}

/** Casos de uso del Panel. Reciben el puerto; no conocen al proveedor. */
export function createPanelUseCases(widget: AdvancedChartWidgetPort): PanelUseCases {
  return {
    mountBitcoinChart: (host, theme, listeners) =>
      widget.mount(host, bitcoinAdvancedChartConfig(theme), listeners),
  };
}
