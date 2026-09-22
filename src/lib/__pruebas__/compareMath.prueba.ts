/**
 * Comprobaciones del cruce y la normalización de series.
 * Se ejecutan con `npm run test:comparar`.
 *
 * Lo delicado aquí es alinear series que no traen los mismos instantes: si se
 * cuela un punto a medias, la curva se desplaza y el gráfico miente.
 */
import { compareSeries, type Series } from "../compareMath.ts";
import type { PricePoint } from "../../types/coin.ts";

const DIA = 24 * 60 * 60 * 1000;
const BASE = Date.UTC(2026, 0, 1);

function punto(dias: number, price: number): PricePoint {
  const timestamp = BASE + dias * DIA;
  return { timestamp, price, date: `d${dias}`, fullDate: `día ${dias}` };
}

function serie(coinId: string, precios: Array<[number, number]>): Series {
  return { coinId, symbol: coinId.toUpperCase(), points: precios.map(([d, p]) => punto(d, p)) };
}

function check(nombre: string, real: unknown, esperado: unknown) {
  const ok =
    typeof real === "number" && typeof esperado === "number"
      ? Math.abs(real - esperado) < 0.001
      : JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${ok ? "✓" : "✗ FALLA"} ${nombre}: ${JSON.stringify(real)} (esperado ${JSON.stringify(esperado)})`);
  if (!ok) process.exitCode = 1;
}

// Cada serie arranca en 0 %, sea cual sea su precio
{
  const { rows, results } = compareSeries(
    [serie("btc", [[0, 100], [1, 150]]), serie("eth", [[0, 1], [1, 2]])],
    30,
  );
  check("ambas arrancan en 0 %", [rows[0].btc, rows[0].eth], [0, 0]);
  check("btc +50 %", rows[1].btc, 50);
  check("eth +100 %", rows[1].eth, 100);
  check("gana la que más sube", results[0].symbol, "ETH");
  check("precios de referencia", [results[0].firstPrice, results[0].lastPrice], [1, 2]);
}

// Series desalineadas: solo valen los días que están en las dos
{
  const { rows } = compareSeries(
    [serie("btc", [[0, 100], [1, 110], [2, 120]]), serie("eth", [[0, 10], [2, 12]])],
    30,
  );
  check("se queda con los días comunes", rows.length, 2);
  check("el día suelto no aparece", rows.map((r) => r.timestamp), [BASE, BASE + 2 * DIA]);
  check("btc normalizado sobre el día 0", rows[1].btc, 20);
}

// Una serie vacía no rompe: se ignora
{
  const { rows, results } = compareSeries(
    [serie("btc", [[0, 100], [1, 200]]), { coinId: "vacia", symbol: "VAC", points: [] }],
    30,
  );
  check("sigue habiendo filas", rows.length, 2);
  check("solo una moneda en los resultados", results.length, 1);
}

// Sin nada en común, no se inventa un gráfico
{
  const { rows, results } = compareSeries(
    [serie("btc", [[0, 100]]), serie("eth", [[5, 10]])],
    30,
  );
  check("sin filas", rows.length, 0);
  check("sin resultados", results.length, 0);
}

// Bajadas también, y el orden es de mejor a peor
{
  const { results } = compareSeries(
    [serie("sube", [[0, 100], [1, 120]]), serie("baja", [[0, 100], [1, 80]])],
    30,
  );
  check("primero el que sube", results[0].symbol, "SUBE");
  check("el que baja, negativo", results[1].changePct, -20);
}

// Los puntos llegan desordenados: se ordenan por fecha
{
  const s: Series = { coinId: "btc", symbol: "BTC", points: [punto(2, 120), punto(0, 100), punto(1, 110)] };
  const { rows } = compareSeries([s], 30);
  check("filas en orden cronológico", rows.map((r) => r.timestamp), [BASE, BASE + DIA, BASE + 2 * DIA]);
  check("normalizado desde el más antiguo", rows[2].btc, 20);
}

// Precio base cero: no se divide entre cero
{
  const { results } = compareSeries([serie("raro", [[0, 0], [1, 5]])], 30);
  check("se descarta la serie sin base válida", results.length, 0);
}
