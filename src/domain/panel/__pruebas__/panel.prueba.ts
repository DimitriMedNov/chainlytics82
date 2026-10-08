/**
 * Comprobaciones de las reglas puras del Panel: top 5, cifras de mercado,
 * dominio de la gráfica de Bitcoin, estados de bloque y series de gráficas.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin, GlobalMarket } from "../../market/coin.ts";
import {
  BITCOIN_ID,
  DEFAULT_BITCOIN_RANGE,
  isEmptySeries,
  priceAreaSeries,
  priceAxisDomain,
} from "../bitcoinChart.ts";
import { resolveBlockStatus } from "../blockStatus.ts";
import { btcDominanceRing, marketFigures } from "../marketFigures.ts";
import { isRising, TOP_COINS_VISIBLE, topChangeBars, topCoins, topVolumeBars } from "../topCoins.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  const iguales = a === b || (Number.isNaN(real) && Number.isNaN(esperado));
  console.log(`${iguales ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (!iguales) process.exitCode = 1;
}

function coin(id: string, change24h: number, volume24h: number): Coin {
  return {
    id, rank: 1, name: id.toUpperCase(), symbol: id.slice(0, 3).toUpperCase(), image: `${id}.png`,
    price: 10, change24h, change7d: null, marketCap: 1, volume24h, high24h: 0, low24h: 0,
    ath: 0, athChangePct: 0, atl: 0, circulatingSupply: 0, totalSupply: null, fdv: null,
  };
}

// Top 5: las cinco primeras, en el orden en que llegan.
{
  const siete = ["a", "b", "c", "d", "e", "f", "g"].map((id, i) => coin(id, i - 3, i * 100));
  check("se ven 5", TOP_COINS_VISIBLE, 5);
  check("corta en 5", topCoins(siete).map((c) => c.id), ["a", "b", "c", "d", "e"]);
  check("con menos de 5 las da todas", topCoins(siete.slice(0, 2)).map((c) => c.id), ["a", "b"]);
  check("sin monedas, lista vacía", topCoins([]), []);
  check("no toca la lista original", siete.length, 7);
}

// Sube con cero o más; baja solo en negativo.
{
  check("positivo sube", isRising(2.4), true);
  check("cero sube", isRising(0), true);
  check("negativo baja", isRising(-0.01), false);
}

// Barras del top: cambio 24 h y volumen, en el mismo orden.
{
  const dos = [coin("bitcoin", 1.5, 900), coin("ethereum", -2, 400)];
  check("barras de cambio", topChangeBars(dos), [
    { id: "bitcoin", symbol: "BIT", name: "BITCOIN", value: 1.5, rising: true },
    { id: "ethereum", symbol: "ETH", name: "ETHEREUM", value: -2, rising: false },
  ]);
  check("barras de volumen", topVolumeBars(dos), [
    { id: "bitcoin", symbol: "BIT", name: "BITCOIN", value: 900 },
    { id: "ethereum", symbol: "ETH", name: "ETHEREUM", value: 400 },
  ]);
  check("sin monedas, sin barras", topChangeBars([]), []);
}

// Cifras de mercado y dominancia como proporción.
{
  const global: GlobalMarket = {
    totalMarketCap: 2.5e12, totalVolume24h: 9e10, btcDominance: 54.321, marketCapChange24hPct: -1.2,
  };
  check("cifras", marketFigures(global), {
    totalMarketCap: 2.5e12, marketCapChange24hPct: -1.2, totalVolume24h: 9e10, btcDominance: 54.321,
  });
  check("anillo: proporción", btcDominanceRing(50), { percent: 50, share: 0.5, rest: 0.5 });
  check("anillo: suma 1", btcDominanceRing(54.321).share + btcDominanceRing(54.321).rest, 1);
  check("anillo: por encima de 100 se acota", btcDominanceRing(130).share, 1);
  check("anillo: negativo se acota", btcDominanceRing(-5).share, 0);
  check("anillo: dato no numérico da 0", btcDominanceRing(Number.NaN).share, 0);
}

// Gráfica de Bitcoin: moneda, rango y dominio del eje Y.
{
  const puntos = [
    { timestamp: 1, price: 100 },
    { timestamp: 2, price: 50 },
    { timestamp: 3, price: 200 },
  ];
  check("moneda", BITCOIN_ID, "bitcoin");
  check("rango por defecto", DEFAULT_BITCOIN_RANGE, 90);
  check("dominio con holgura", priceAxisDomain(puntos), [50 * 0.98, 200 * 1.02]);
  check("dominio con un punto", priceAxisDomain([{ timestamp: 1, price: 10 }]), [9.8, 10.2]);
  check("dominio sin puntos", priceAxisDomain([]), null);
  check("serie vacía", isEmptySeries([]), true);
  check("serie con puntos", isEmptySeries(puntos), false);
  const etiquetados = puntos.map((p) => ({ ...p, date: "d", fullDate: "f" }));
  check("el área conserva los puntos", priceAreaSeries(etiquetados).points, etiquetados);
  check("el área trae el dominio", priceAreaSeries(etiquetados).yDomain, [49, 204]);
  check("área sin puntos", priceAreaSeries([]), { points: [], yDomain: null });
}

// Estado del bloque: error antes que carga, carga antes que vacío.
{
  check("error gana a todo", resolveBlockStatus({ isPending: true, isError: true }, true), "error");
  check("cargando", resolveBlockStatus({ isPending: true, isError: false }, true), "loading");
  check("vacío", resolveBlockStatus({ isPending: false, isError: false }, true), "empty");
  check("éxito", resolveBlockStatus({ isPending: false, isError: false }, false), "success");
}
