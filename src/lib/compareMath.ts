import type { PricePoint } from "@/types/coin";

/** El histórico de una moneda, listo para cruzar con los demás. */
export interface Series {
  coinId: string;
  symbol: string;
  points: PricePoint[];
}

/** Una fila del gráfico: una fecha y el % de cada moneda en esa fecha. */
export interface ComparisonRow {
  date: string;
  fullDate: string;
  timestamp: number;
  /** Variación acumulada en % desde el inicio del periodo, por moneda. */
  [coinId: string]: string | number;
}

/** Cómo le ha ido a una moneda en el periodo completo. */
export interface SeriesResult {
  coinId: string;
  symbol: string;
  changePct: number;
  firstPrice: number;
  lastPrice: number;
}

export interface Comparison {
  rows: ComparisonRow[];
  results: SeriesResult[];
}

/**
 * Las series no traen siempre los mismos instantes, así que las agrupamos por
 * intervalo y nos quedamos solo con los momentos que existen en TODAS: un
 * punto a medias desplazaría la curva y mentiría.
 */
function bucketKey(timestamp: number, bucketMs: number): number {
  return Math.round(timestamp / bucketMs) * bucketMs;
}

/**
 * Cruza las series y las normaliza: cada moneda arranca en 0 % y lo que se
 * dibuja es su variación, de forma que se puedan comparar monedas de precios
 * muy distintos en el mismo gráfico.
 */
export function compareSeries(series: Series[], days: number): Comparison {
  const conDatos = series.filter((s) => s.points.length > 0);
  if (conDatos.length === 0) return { rows: [], results: [] };

  // Por debajo de dos días los datos vienen por horas; por encima, por día.
  const bucketMs = days <= 1 ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const porMoneda = new Map<string, Map<number, PricePoint>>();
  for (const s of conDatos) {
    const mapa = new Map<number, PricePoint>();
    for (const punto of s.points) {
      // Si caen dos en el mismo intervalo, vale el último.
      mapa.set(bucketKey(punto.timestamp, bucketMs), punto);
    }
    porMoneda.set(s.coinId, mapa);
  }

  // La serie más corta manda: no inventamos puntos donde alguna no tiene dato.
  const [primera] = conDatos;
  const clavesComunes = [...(porMoneda.get(primera.coinId) ?? new Map()).keys()]
    .filter((clave) => conDatos.every((s) => porMoneda.get(s.coinId)?.has(clave)))
    .sort((a, b) => a - b);

  if (clavesComunes.length === 0) return { rows: [], results: [] };

  const bases = new Map<string, number>();
  for (const s of conDatos) {
    const punto = porMoneda.get(s.coinId)?.get(clavesComunes[0]);
    if (punto && punto.price > 0) bases.set(s.coinId, punto.price);
  }

  const rows: ComparisonRow[] = clavesComunes.map((clave) => {
    const referencia = porMoneda.get(primera.coinId)?.get(clave) as PricePoint;
    const row: ComparisonRow = {
      date: referencia.date,
      fullDate: referencia.fullDate,
      timestamp: clave,
    };
    for (const s of conDatos) {
      const punto = porMoneda.get(s.coinId)?.get(clave);
      const base = bases.get(s.coinId);
      if (punto && base !== undefined) {
        row[s.coinId] = ((punto.price - base) / base) * 100;
      }
    }
    return row;
  });

  const ultimaClave = clavesComunes[clavesComunes.length - 1];
  const results: SeriesResult[] = conDatos.flatMap((s) => {
    const base = bases.get(s.coinId);
    const ultimo = porMoneda.get(s.coinId)?.get(ultimaClave);
    if (base === undefined || !ultimo) return [];
    return [
      {
        coinId: s.coinId,
        symbol: s.symbol,
        firstPrice: base,
        lastPrice: ultimo.price,
        changePct: ((ultimo.price - base) / base) * 100,
      },
    ];
  });

  results.sort((a, b) => b.changePct - a.changePct);
  return { rows, results };
}
