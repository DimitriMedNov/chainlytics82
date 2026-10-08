/**
 * Comprobaciones del modal de detalle: cifras derivadas de la moneda y serie
 * de precios de la gráfica.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../market/coin.ts";
import {
  coinDetailFigures,
  dayRangePosition,
  marketCapVsFdv,
  supplyShare,
  trend24h,
} from "../figures.ts";
import {
  DEFAULT_DETAIL_RANGE,
  priceAxisDomain,
  priceSeriesStatus,
  summarizePriceSeries,
} from "../priceSeries.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (cambios: Partial<Coin> = {}): Coin => ({
  id: "bitcoin", symbol: "BTC", name: "Bitcoin", image: "", rank: 1, price: 150,
  change24h: 2, change7d: -1, marketCap: 500, volume24h: 40, high24h: 200, low24h: 100,
  ath: 400, athChangePct: -62.5, atl: 1, circulatingSupply: 19, totalSupply: 21, fdv: 1000,
  ...cambios,
});

// Sentido del cambio en 24 h
check("sube con cambio positivo", trend24h({ change24h: 0.01 }), "up");
check("baja con cambio negativo", trend24h({ change24h: -0.01 }), "down");
check("conservado: 0 cuenta como subida", trend24h({ change24h: 0 }), "up");

// Posición dentro del rango de 24 h
check("precio a mitad del rango", dayRangePosition(coin()).ratio, 0.5);
check("precio en el mínimo", dayRangePosition(coin({ price: 100 })).ratio, 0);
check("precio en el máximo", dayRangePosition(coin({ price: 200 })).ratio, 1);
check("precio por debajo del mínimo se recorta", dayRangePosition(coin({ price: 90 })).ratio, 0);
check("precio por encima del máximo se recorta", dayRangePosition(coin({ price: 250 })).ratio, 1);
check("rango plano no se pinta", dayRangePosition(coin({ high24h: 100 })).ratio, null);
check("rango invertido no se pinta", dayRangePosition(coin({ high24h: 50 })).ratio, null);
check("rango sin número no se pinta", dayRangePosition(coin({ high24h: Number.NaN })).ratio, null);
check("devuelve también los extremos", dayRangePosition(coin()), {
  low: 100, high: 200, price: 150, ratio: 0.5,
});

// Capitalización frente a FDV
check("capitalización / FDV", marketCapVsFdv(coin()), { marketCap: 500, fdv: 1000, ratio: 0.5 });
check("sin FDV no hay proporción", marketCapVsFdv(coin({ fdv: null })), {
  marketCap: 500, fdv: null, ratio: null,
});
check("FDV 0 no divide", marketCapVsFdv(coin({ fdv: 0 })).ratio, null);
check("capitalización mayor que FDV se recorta", marketCapVsFdv(coin({ fdv: 250 })).ratio, 1);

// Oferta circulante frente a total
check("circulante / total", supplyShare(coin({ circulatingSupply: 5, totalSupply: 20 })).ratio, 0.25);
check("sin oferta total no hay proporción", supplyShare(coin({ totalSupply: null })).ratio, null);
check("oferta total 0 no divide", supplyShare(coin({ totalSupply: 0 })).ratio, null);
check("circulante 0 es dato desconocido", supplyShare(coin({ circulatingSupply: 0 })).ratio, null);
check("circulante mayor que total se recorta", supplyShare(coin({ circulatingSupply: 30 })).ratio, 1);

// Conjunto de cifras
{
  const cifras = coinDetailFigures(coin());
  check("distancia al máximo: el dato de la API tal cual", cifras.athDistancePct, -62.5);
  check("cambio a 7 días tal cual", cifras.change7d, -1);
  check("cambio a 7 días ausente se queda en null", coinDetailFigures(coin({ change7d: null })).change7d, null);
  check("incluye el sentido", cifras.trend24h, "up");
  check("incluye el rango de 24 h", cifras.dayRange.ratio, 0.5);
}

// Serie de precios
check("rango por defecto de la gráfica", DEFAULT_DETAIL_RANGE, 30);
check("eje con 2 % de holgura", priceAxisDomain(100, 200), [98, 204]);
check("serie vacía no tiene resumen", summarizePriceSeries([]), null);
{
  const serie = [
    { timestamp: 1, price: 100 },
    { timestamp: 2, price: 80 },
    { timestamp: 3, price: 140 },
    { timestamp: 4, price: 120 },
  ];
  check("resumen de la serie", summarizePriceSeries(serie), {
    min: 80, max: 140, first: 100, last: 120, change: 20, changePct: 20, trend: "up",
    axisDomain: [78.4, 142.8],
  });
  check("serie que baja", summarizePriceSeries([...serie].reverse())?.trend, "down");
  check("un solo punto", summarizePriceSeries([serie[0]]), {
    min: 100, max: 100, first: 100, last: 100, change: 0, changePct: 0, trend: "up",
    axisDomain: [98, 102],
  });
  check(
    "primer precio 0 no divide",
    summarizePriceSeries([{ timestamp: 1, price: 0 }, { timestamp: 2, price: 5 }])?.changePct,
    null,
  );
}

// Estados de la gráfica
check("error gana a la carga", priceSeriesStatus({ isError: true, isPending: true, pointCount: undefined }), "error");
check("error gana a los datos viejos", priceSeriesStatus({ isError: true, isPending: false, pointCount: 9 }), "error");
check("cargando", priceSeriesStatus({ isError: false, isPending: true, pointCount: undefined }), "loading");
check("vacío con serie sin puntos", priceSeriesStatus({ isError: false, isPending: false, pointCount: 0 }), "empty");
check("listo con puntos", priceSeriesStatus({ isError: false, isPending: false, pointCount: 3 }), "ready");
