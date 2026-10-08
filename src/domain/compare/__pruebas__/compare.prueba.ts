/**
 * Comprobaciones de las reglas de selección, de los estados de cada bloque y
 * de las series para las gráficas de Comparar.
 * Se ejecutan con `node scripts/run-pruebas.mjs`.
 */
import type { Coin } from "../../market/coin.ts";
import { toLineSeries, toRanking, toRankingBars, tooltipEntries } from "../charts.ts";
import {
  addToSelection,
  availableCoins,
  colorIndexOf,
  isSelectionFull,
  parseSelection,
  removeFromSelection,
  resolveSelection,
  serializeSelection,
} from "../selection.ts";
import { compareSeries } from "../series.ts";
import { chartStatus, pickerStatus, rankingStatus } from "../status.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const ok = JSON.stringify(real) === JSON.stringify(esperado);
  console.log(`${ok ? "✓" : "✗ FALLA"} ${nombre}: ${JSON.stringify(real)} (esperado ${JSON.stringify(esperado)})`);
  if (!ok) process.exitCode = 1;
}

function coin(id: string): Coin {
  return {
    id, rank: 1, name: `Nombre ${id}`, symbol: id.toUpperCase(), image: `${id}.png`, price: 1,
    change24h: 0, change7d: null, marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0,
    athChangePct: 0, atl: 0, circulatingSupply: 0, totalSupply: null, fdv: null,
  };
}

const catalogo = ["a", "b", "c", "d", "e", "f"].map(coin);

// Selección en la URL
check("sin parámetro: por defecto", parseSelection(null), ["bitcoin", "ethereum"]);
check("parámetro vacío: nada", parseSelection(""), []);
check("ignora huecos", parseSelection("a,,b,"), ["a", "b"]);
check("recorta a 5", parseSelection("a,b,c,d,e,f"), ["a", "b", "c", "d", "e"]);
check("formato de la URL", serializeSelection(["a", "b"]), "a,b");
check("lista vacía: se quita el parámetro", serializeSelection([]), null);
check("conservado: quitar la última restaura las de por defecto",
  parseSelection(serializeSelection(removeFromSelection(["a"], "a"))), ["bitcoin", "ethereum"]);

// Añadir y quitar
check("añade al final", addToSelection(["a"], "b"), ["a", "b"]);
check("sin duplicados", addToSelection(["a"], "a"), null);
check("id vacío no añade", addToSelection(["a"], ""), null);
check("con 5, la sexta no entra", addToSelection(["a", "b", "c", "d", "e"], "f"), ["a", "b", "c", "d", "e"]);
check("quita", removeFromSelection(["a", "b"], "a"), ["b"]);

// Catálogo
const ids = ["b", "fuera", "a"];
const elegidas = resolveSelection(ids, catalogo);
check("resuelve en el orden de la selección", elegidas.map((c) => c.id), ["b", "a"]);
check("sin catálogo: ninguna", resolveSelection(ids, undefined), []);
check("disponibles: las no elegidas", availableCoins(catalogo, elegidas).map((c) => c.id), ["c", "d", "e", "f"]);
check("no está lleno con 2", isSelectionFull(elegidas), false);
check("lleno con 5", isSelectionFull(catalogo.slice(0, 5)), true);
check("conservado: un id fuera del top ocupa hueco",
  [addToSelection(["a", "b", "c", "d", "fuera"], "e"), isSelectionFull(resolveSelection(["a", "b", "c", "d", "fuera"], catalogo))],
  [["a", "b", "c", "d", "fuera"], false]);

// Color por posición
check("color por posición (1..5)", [colorIndexOf(elegidas, "b"), colorIndexOf(elegidas, "a")], [1, 2]);
check("conservado: al quitar una, cambia el color de la siguiente",
  colorIndexOf(resolveSelection(["a"], catalogo), "a"), 1);
check("fuera de la selección: sin color", colorIndexOf(elegidas, "z"), null);

// Estados
check("selector: error antes que cargando", pickerStatus({ isError: true, isPending: true, selectedCount: 0 }), "error");
check("selector: cargando", pickerStatus({ isError: false, isPending: true, selectedCount: 0 }), "loading");
check("selector: vacío", pickerStatus({ isError: false, isPending: false, selectedCount: 0 }), "empty");
check("selector: listo", pickerStatus({ isError: false, isPending: false, selectedCount: 2 }), "ready");
check("gráfica: sin selección gana al error", chartStatus({ selectedCount: 0, isError: true, isPending: true, rowCount: 0 }), "empty-selection");
check("gráfica: error antes que cargando", chartStatus({ selectedCount: 2, isError: true, isPending: true, rowCount: 0 }), "error");
check("gráfica: cargando", chartStatus({ selectedCount: 2, isError: false, isPending: true, rowCount: 3 }), "loading");
check("gráfica: sin datos en común", chartStatus({ selectedCount: 2, isError: false, isPending: false, rowCount: 0 }), "empty-no-common");
check("gráfica: lista", chartStatus({ selectedCount: 2, isError: false, isPending: false, rowCount: 3 }), "ready");
check("conservado: ranking con resultados aunque haya error", rankingStatus({ resultCount: 1, selectedCount: 2, isError: true, isPending: true }), "ready");
check("ranking: sin selección", rankingStatus({ resultCount: 0, selectedCount: 0, isError: false, isPending: false }), "empty-selection");
check("ranking: error", rankingStatus({ resultCount: 0, selectedCount: 2, isError: true, isPending: true }), "error");
check("ranking: cargando", rankingStatus({ resultCount: 0, selectedCount: 2, isError: false, isPending: true }), "loading");
check("ranking: sin datos en común", rankingStatus({ resultCount: 0, selectedCount: 2, isError: false, isPending: false }), "empty-no-common");

// Series para las gráficas
{
  const DIA = 24 * 60 * 60 * 1000;
  const sel = resolveSelection(["a", "b", "c"], catalogo);
  const { rows, results } = compareSeries(
    [
      { coinId: "a", symbol: "A", points: [{ timestamp: 0, price: 100 }, { timestamp: DIA, price: 90 }] },
      { coinId: "b", symbol: "B", points: [{ timestamp: 0, price: 10 }, { timestamp: DIA, price: 15 }] },
    ],
    30,
  );
  const lineas = toLineSeries(rows, sel);
  check("una línea por moneda elegida", lineas.map((l) => [l.coinId, l.colorIndex, l.points.length]), [["a", 1, 2], ["b", 2, 2], ["c", 3, 0]]);
  check("puntos de la línea", lineas[1].points, [{ timestamp: 0, changePct: 0 }, { timestamp: DIA, changePct: 50 }]);
  check("tooltip de mejor a peor", tooltipEntries(rows[1], sel).map((e) => [e.symbol, e.changePct, e.colorIndex]), [["B", 50, 2], ["A", -10, 1]]);
  const ranking = toRanking(results, sel);
  check("ranking de mejor a peor", ranking.map((r) => [r.position, r.name, r.colorIndex, r.rises]), [[1, "Nombre b", 2, true], [2, "Nombre a", 1, false]]);
  check("precio inicial y final", [ranking[0].firstPrice, ranking[0].lastPrice, ranking[0].image], [10, 15, "b.png"]);
  check("0 % cuenta como subida", toRanking([{ coinId: "a", symbol: "A", changePct: 0, firstPrice: 1, lastPrice: 1 }], sel)[0].rises, true);
  check("moneda fuera de la selección: símbolo y sin color", toRanking([{ coinId: "z", symbol: "Z", changePct: 1, firstPrice: 1, lastPrice: 2 }], sel).map((r) => [r.name, r.image, r.colorIndex]), [["Z", null, null]]);
  check("barras del ranking", toRankingBars(ranking), [
    { coinId: "b", label: "B", value: 50, colorIndex: 2, rises: true },
    { coinId: "a", label: "A", value: -10, colorIndex: 1, rises: false },
  ]);
}
