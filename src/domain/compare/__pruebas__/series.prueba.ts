/**
 * Comprobaciones del cruce y la normalización de series.
 * Se ejecutan con `node scripts/run-pruebas.mjs`. Copia de
 * `src/lib/__pruebas__/compareMath.prueba.ts` apuntando al dominio nuevo: solo
 * cambia cómo se lee el % de una fila (`row.changes[id]` en vez de `row[id]`).
 *
 * Lo delicado aquí es alinear series que no traen los mismos instantes: si se
 * cuela un punto a medias, la curva se desplaza y el gráfico miente.
 */
import { compareSeries, type Series } from "../series.ts";
import type { PricePoint } from "../../market/coin.ts";

const DIA = 24 * 60 * 60 * 1000;
const BASE = Date.UTC(2026, 0, 1);

function punto(dias: number, price: number): PricePoint {
  const timestamp = BASE + dias * DIA;
  return { timestamp, price };
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
  check("ambas arrancan en 0 %", [rows[0].changes.btc, rows[0].changes.eth], [0, 0]);
  check("btc +50 %", rows[1].changes.btc, 50);
  check("eth +100 %", rows[1].changes.eth, 100);
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
  check("btc normalizado sobre el día 0", rows[1].changes.btc, 20);
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
  check("normalizado desde el más antiguo", rows[2].changes.btc, 20);
}

// Precio base cero: no se divide entre cero
{
  const { results } = compareSeries([serie("raro", [[0, 0], [1, 5]])], 30);
  check("se descarta la serie sin base válida", results.length, 0);
}

// La etiqueta de fecha sale del instante real del punto de la primera serie
{
  const HORA = 60 * 60 * 1000;
  const { rows } = compareSeries(
    [
      { coinId: "btc", symbol: "BTC", points: [{ timestamp: BASE + 5 * 60 * 1000, price: 100 }] },
      { coinId: "eth", symbol: "ETH", points: [{ timestamp: BASE - 5 * 60 * 1000, price: 10 }] },
    ],
    1,
  );
  check("por horas: mismo intervalo", rows.length, 1);
  check("intervalo redondeado a la hora", rows[0].timestamp, Math.round(BASE / HORA) * HORA);
  check("instante de referencia: el de la primera serie", rows[0].referenceTimestamp, BASE + 5 * 60 * 1000);
}

// Base cero junto a una serie válida: la fila existe, pero sin esa moneda
{
  const { rows, results } = compareSeries(
    [serie("raro", [[0, 0], [1, 5]]), serie("btc", [[0, 100], [1, 150]])],
    30,
  );
  check("filas presentes", rows.length, 2);
  check("solo la moneda con base", Object.keys(rows[1].changes), ["btc"]);
  check("un resultado", results.map((r) => r.coinId), ["btc"]);
}
