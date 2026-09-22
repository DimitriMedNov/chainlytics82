import { useEffect, useState } from "react";
import { useResolvedTheme } from "@/hooks/useResolvedTheme";

/**
 * Recharts pinta los colores como atributos SVG, y ahí `var(--token)` no se
 * resuelve: hay que pasarle un color ya calculado. Este hook lee los tokens
 * del tema actual y los vuelve a leer cuando el tema cambia.
 */
export interface ChartColors {
  series: string[];
  axis: string;
  grid: string;
}

const SERIES_TOKENS = ["--chart-1", "--chart-2", "--chart-3", "--chart-4", "--chart-5"] as const;

function readToken(token: string, fallback: string): string {
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token).trim();
  return raw === "" ? fallback : `hsl(${raw})`;
}

function readAll(): ChartColors {
  return {
    series: SERIES_TOKENS.map((token, index) => readToken(token, `hsl(${index * 60} 70% 55%)`)),
    axis: readToken("--muted-foreground", "hsl(0 0% 50%)"),
    grid: readToken("--border", "hsl(0 0% 80%)"),
  };
}

export function useChartColors(): ChartColors {
  const theme = useResolvedTheme();
  const [colors, setColors] = useState<ChartColors>(readAll);

  useEffect(() => {
    // El cambio de clase en <html> ocurre en un efecto del ThemeProvider,
    // así que leemos en el siguiente frame para tomar ya los valores nuevos.
    const frame = window.requestAnimationFrame(() => setColors(readAll()));
    return () => window.cancelAnimationFrame(frame);
  }, [theme]);

  return colors;
}
