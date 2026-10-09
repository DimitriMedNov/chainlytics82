import { formatPercent } from "@/application/shared/presentation/format";
import type { Change24hBar } from "@/domain/watchlist-screen/chart";
import { toUpDownRows, type UpDownRow } from "@/ui/charts/up-down-bars";

/** Categoría de cada barra: el id de la moneda (estable aunque se reordene). */
export const CATEGORY_KEY = "id";

/** Lo que la pantalla escribe de cada barra; `up` / `down` los pone el adaptador compartido. */
export type ChangeBarFields = {
  id: string;
  symbol: string;
  name: string;
  /** Cambio con signo, en puntos porcentuales. */
  change24h: number;
  /** Cambio ya escrito: «+2.45 %». */
  text: string;
};

/** El índice abierto es lo que pide `BarChart` para aceptar la fila como registro. */
export type ChangeBarRow = UpDownRow<ChangeBarFields & { [key: string]: unknown }>;

/** Quién sube lo decide el dominio (`isUp`: 0 cuenta como subida), no el signo. */
export function toChangeBarRows(series: readonly Change24hBar[]): ChangeBarRow[] {
  return toUpDownRows(
    series,
    (bar) => bar.change24h,
    (bar): ChangeBarFields & { [key: string]: unknown } => ({
      id: bar.id,
      symbol: bar.symbol,
      name: bar.name,
      change24h: bar.change24h,
      text: formatPercent(bar.change24h),
    }),
    (bar) => bar.isUp,
  );
}

export function describeChangeBar(row: ChangeBarRow): string {
  return `${row.name} ${row.text}`;
}

/** Bklit devuelve cada fila como registro sin tipo: se comprueba antes de leerla. */
export function readChangeBar(row: Record<string, unknown>): ChangeBarFields | null {
  const { id, symbol, name, change24h, text } = row;
  if (
    typeof id !== "string" ||
    typeof symbol !== "string" ||
    typeof name !== "string" ||
    typeof change24h !== "number" ||
    typeof text !== "string"
  ) {
    return null;
  }
  return { id, symbol, name, change24h, text };
}
