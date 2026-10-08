import { useCallback, useEffect, useState, type RefObject } from "react";
import { useDeps } from "@/app/deps";
import type { AdvancedChartStatus } from "@/application/panel/advancedChart";
import type { ResolvedTheme } from "@/domain/theme/theme";

export interface TradingViewWidgetOptions {
  /** Tema ya resuelto (`useTheme().resolvedTheme`). Al cambiar, el widget se vuelve a montar. */
  theme: ResolvedTheme;
}

export interface TradingViewWidgetState {
  /** "loading" mientras baja el script, "ready" cuando cargó, "error" si no se pudo descargar. */
  status: AdvancedChartStatus;
  /** Vuelve a montar el widget desde cero. */
  retry: () => void;
}

interface Settled {
  mount: string;
  status: Exclude<AdvancedChartStatus, "loading">;
}

/**
 * Monta el widget de TradingView «Precio de Bitcoin» dentro del elemento de
 * `ref` y lo limpia al desmontar. El elemento tiene que estar siempre en el
 * árbol (también en carga y en error): los estados se pintan encima o al lado.
 */
export function useTradingViewWidget(
  ref: RefObject<HTMLElement | null>,
  { theme }: TradingViewWidgetOptions,
): TradingViewWidgetState {
  const { panel } = useDeps();
  const [attempt, setAttempt] = useState(0);
  const [settled, setSettled] = useState<Settled | null>(null);
  // Cada montaje (tema o reintento nuevos) empieza en "loading" sin tocar el estado.
  const mount = `${theme}:${attempt}`;

  useEffect(() => {
    const host = ref.current;
    if (!host) return;

    const handle = panel.mountBitcoinChart(host, theme, {
      onReady: () => setSettled({ mount, status: "ready" }),
      onError: () => setSettled({ mount, status: "error" }),
    });

    return () => handle.dispose();
  }, [panel, ref, theme, mount]);

  const retry = useCallback(() => setAttempt((current) => current + 1), []);

  return { status: settled?.mount === mount ? settled.status : "loading", retry };
}
