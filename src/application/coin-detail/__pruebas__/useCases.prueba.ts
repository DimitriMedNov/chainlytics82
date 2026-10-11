/**
 * Comprobaciones de los casos de uso del modal de detalle: alternar
 * seguimiento (qué acción se llama y qué aviso sale) y «Convertir».
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../../domain/market/coin.ts";
import { presentCoinDetail } from "../presentation/coinDetailView.ts";
import type { WatchlistTogglePort } from "../ports.ts";
import { convertFromDetail, toggleCoinWatchlist } from "../useCases.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const btc: Coin = {
  id: "bitcoin", symbol: "BTC", name: "Bitcoin", image: "btc.png", rank: 1, price: 150,
  change24h: 2, change7d: null, marketCap: 500, volume24h: 40, high24h: 200, low24h: 100,
  ath: 400, athChangePct: -62.5, atl: 1, circulatingSupply: 0, totalSupply: null, fdv: null,
};

/** Watchlist de mentira que apunta qué se le pidió. */
function watchlist(seguidas: string[]) {
  const llamadas: string[] = [];
  const port: WatchlistTogglePort = {
    has: (symbol) => seguidas.includes(symbol),
    add: (coin) => void llamadas.push(`add:${coin.id}:${coin.symbol}`),
    remove: (symbol) => void llamadas.push(`remove:${symbol}`),
  };
  return { port, llamadas };
}

// Alternar seguimiento
{
  const { port, llamadas } = watchlist([]);
  const resultado = toggleCoinWatchlist(port, btc);
  check("no seguida: se añade", llamadas, ["add:bitcoin:BTC"]);
  check("aviso de añadir", resultado, {
    action: "added",
    notice: { title: "Añadido al watchlist", description: "Bitcoin ya está en tu lista" },
  });
}
{
  const { port, llamadas } = watchlist(["BTC"]);
  const resultado = toggleCoinWatchlist(port, btc);
  check("seguida: se quita por símbolo", llamadas, ["remove:BTC"]);
  check("aviso de quitar", resultado, {
    action: "removed",
    notice: { title: "Eliminado del watchlist", description: "Bitcoin ya no está en tu lista" },
  });
}

// Convertir
check("convertir: ruta sin moneda preseleccionada y sin aviso", convertFromDetail(), {
  route: "/converter",
  notice: null,
});

// Lo que se escribe cuando falta un dato
{
  const vista = presentCoinDetail(btc);
  const valor = (filas: { id: string; value: string }[], id: string) =>
    filas.find((fila) => fila.id === id)?.value;
  check("sin cambio a 7 d, junto al precio no se pinta nada", vista.price.change7d, null);
  check("sin cambio a 7 d, en información adicional", valor(vista.additional.rows, "change7d"), "No disponible");
  check("sin FDV", valor(vista.marketCap.rows, "fdv"), "No disponible");
  check("oferta circulante 0", valor(vista.volume.rows, "circulatingSupply"), "No disponible");
  check("sin oferta total", valor(vista.volume.rows, "totalSupply"), "No disponible");
  check("ranking", [vista.header.rankLabel, valor(vista.marketCap.rows, "rank")], ["#1", "#1"]);
  // El proveedor de respaldo no da máximo ni mínimo de 24 h ni mínimo histórico: llegan en 0.
  const sinDatos = presentCoinDetail({ ...btc, high24h: 0, low24h: 0, atl: 0 });
  check("sin máximo, mínimo ni mínimo histórico",
    ["high24h", "low24h", "atl"].map((id) => valor(sinDatos.priceRows, id)),
    ["No disponible", "No disponible", "No disponible"]);
  check("sin dato no hay color de subida ni bajada", sinDatos.priceRows.map((fila) => fila.tone), [
    "neutral", "neutral", "neutral", "neutral",
  ]);
  check("cambio 24 h con signo", vista.price.change24h, "+2.00 %");
  check("distancia a su máximo", valor(vista.additional.rows, "athDistance"), "-62.50 %");
  check("máximo en verde, mínimo en naranja", vista.priceRows.map((fila) => fila.tone), [
    "success", "warning", "neutral", "neutral",
  ]);
}
{
  const vista = presentCoinDetail({ ...btc, change7d: 1.2 });
  check("cambio a 7 d junto al precio", vista.price.change7d, "· +1.20 % en 7 d");
}
