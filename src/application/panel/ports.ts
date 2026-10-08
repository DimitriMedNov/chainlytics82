import type { ResolvedTheme } from "../../domain/theme/theme.ts";

/**
 * Configuración del widget de gráfica avanzada, con las claves que espera el
 * proveedor. El orden de las claves se conserva al enviarla. Las direcciones
 * del proveedor (de dónde baja el script, su sitio de soporte) no van aquí:
 * las pone el adaptador.
 */
export interface AdvancedChartConfig {
  autosize: boolean;
  symbol: string;
  interval: string;
  timezone: string;
  theme: ResolvedTheme;
  style: string;
  locale: string;
  enable_publishing: boolean;
  allow_symbol_change: boolean;
  calendar: boolean;
}

/** Avisos del cargador mientras el widget está montado. */
export interface AdvancedChartListeners {
  /** El script del widget se descargó y se ejecutó. */
  onReady(): void;
  /** El script no se pudo descargar (sin red, bloqueado...). */
  onError(): void;
}

/** Un widget montado. `dispose` lo quita y deja el elemento vacío. */
export interface AdvancedChartHandle {
  dispose(): void;
}

/**
 * Puerto: cargador del widget de gráfica avanzada. Lo monta dentro de un
 * elemento con una configuración y devuelve cómo limpiarlo. La app no sabe
 * de qué proveedor es ni de dónde se descarga.
 */
export interface AdvancedChartWidgetPort {
  mount(
    host: HTMLElement,
    config: AdvancedChartConfig,
    listeners: AdvancedChartListeners,
  ): AdvancedChartHandle;
}
