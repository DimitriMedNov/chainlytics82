/**
 * Comprobaciones del convertidor: lista de convertibles, fórmula, intercambio,
 * atajos, tasas, serie de la gráfica y estados por bloque. Se ejecutan con
 * `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../market/coin.ts";
import type { FiatRate } from "../../market/fiat.ts";
import { blockStatus, formStatus } from "../blocks.ts";
import { convert, DEFAULT_CONVERTER_FORM, noConversionReason, swapForm } from "../conversion.ts";
import { buildConvertibles, CRYPTOS_IN_LIST, findConvertible } from "../convertible.ts";
import { quickConversions, quickRates, rateChangeSeries } from "../quick.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  const iguales = a === b || (Number.isNaN(real) && Number.isNaN(esperado));
  console.log(`${iguales ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (!iguales) process.exitCode = 1;
}

function coin(symbol: string, price: number, change24h = 1): Coin {
  return {
    id: symbol.toLowerCase(), rank: 1, name: `Moneda ${symbol}`, symbol, image: `${symbol}.png`,
    price, change24h, change7d: null, marketCap: 0, volume24h: 0, high24h: 0, low24h: 0,
    ath: 0, athChangePct: 0, atl: 0, circulatingSupply: 0, totalSupply: null, fdv: null,
  };
}

const coins: Coin[] = [
  coin("BTC", 60000, 2.5),
  coin("ETH", 3000, -1.2),
  coin("SOL", 150, 0),
  coin("XRP", 0.5, 4),
  coin("ADA", 0.4, -3),
];
const rates: FiatRate[] = [
  { code: "USD", name: "Dólar estadounidense", usdPerUnit: 1 },
  { code: "EUR", name: "Euro", usdPerUnit: 1.1 },
];
const options = buildConvertibles(coins, rates);
const btc = findConvertible(options, "BTC");
const usd = findConvertible(options, "USD");
const eur = findConvertible(options, "EUR");

// Lista: criptos primero, luego fiat; como mucho 30 criptos.
{
  check("orden: criptos y luego fiat", options.map((o) => o.code), ["BTC", "ETH", "SOL", "XRP", "ADA", "USD", "EUR"]);
  check("cripto desde Coin", btc, {
    code: "BTC", name: "Moneda BTC", usdPrice: 60000, change24h: 2.5, kind: "cripto", image: "BTC.png",
  });
  check("fiat desde FiatRate", eur, { code: "EUR", name: "Euro", usdPrice: 1.1, change24h: null, kind: "fiat" });
  const muchas = Array.from({ length: 100 }, (_, i) => coin(`C${i}`, i + 1));
  const lista = buildConvertibles(muchas, rates);
  check("solo las 30 primeras criptos", lista.filter((o) => o.kind === "cripto").length, CRYPTOS_IN_LIST);
  check("la número 31 queda fuera", findConvertible(lista, "C30"), undefined);
  check("total con fiat", lista.length, 32);
  check("sin datos aún, lista vacía", buildConvertibles(undefined, undefined), []);
  check("solo fiat cargado", buildConvertibles(undefined, rates).map((o) => o.code), ["USD", "EUR"]);
  check("código que no está", findConvertible(options, "DOGE"), undefined);
}

// Valores por defecto y fórmula.
{
  check("por defecto 1 BTC a USD", DEFAULT_CONVERTER_FORM, { amount: "1", fromCode: "BTC", toCode: "USD" });
  check("1 BTC a USD", convert("1", btc, usd), { amount: 1, value: 60000 });
  check("110 USD a EUR", convert("110", usd, eur)?.value, 110 / 1.1);
  check("coma decimal", convert("0,5", btc, usd), { amount: 0.5, value: 30000 });
  check("vacío no convierte", convert("", btc, usd), null);
  check("cero no convierte", convert("0", btc, usd), null);
  check("negativo no convierte", convert("-2", btc, usd), null);
  check("texto no convierte", convert("abc", btc, usd), null);
  check("sin origen no convierte", convert("1", undefined, usd), null);
  check("sin destino no convierte", convert("1", btc, undefined), null);
  check("misma moneda en los dos lados (conservado)", convert("3", btc, btc), { amount: 3, value: 3 });
  check("motivo: cantidad", noConversionReason("0", btc, usd), "invalid-amount");
  check("motivo: moneda", noConversionReason("1", undefined, usd), "unknown-currency");
  check("motivo: moneda antes que cantidad", noConversionReason("", btc, undefined), "unknown-currency");
  check("sin motivo si convierte", noConversionReason("1", btc, usd), null);
}

// Intercambio.
{
  const form = { amount: "1", fromCode: "USD", toCode: "EUR" };
  const conversion = convert("1", usd, eur);
  check("cruza y pone el número crudo (conservado)", swapForm(form, conversion), {
    amount: String(1 / 1.1), fromCode: "EUR", toCode: "USD",
  });
  check("el crudo lleva más de 8 decimales", swapForm(form, conversion).amount, "0.9090909090909091");
  check("sin resultado, la cantidad no cambia", swapForm({ ...form, amount: "" }, null), {
    amount: "", fromCode: "EUR", toCode: "USD",
  });
}

// Tasas actuales, conversiones rápidas y serie de la gráfica.
{
  check("las 4 primeras criptos", quickRates(options).map((o) => o.code), ["BTC", "ETH", "SOL", "XRP"]);
  check("fiat no cuenta como tasa", quickRates(buildConvertibles(undefined, rates)), []);
  check("atajos calculados", quickConversions(options), [
    { code: "BTC", amount: 1, name: "Moneda BTC", value: 60000 },
    { code: "ETH", amount: 1, name: "Moneda ETH", value: 3000 },
    { code: "SOL", amount: 10, name: "Moneda SOL", value: 1500 },
    { code: "ADA", amount: 1000, name: "Moneda ADA", value: 400 },
  ]);
  const sinSol = buildConvertibles(coins.filter((c) => c.symbol !== "SOL"), rates);
  check("atajo sin moneda desaparece (conservado)", quickConversions(sinSol).map((r) => r.code), ["BTC", "ETH", "ADA"]);
  check("serie de barras", rateChangeSeries(quickRates(options)), [
    { code: "BTC", name: "Moneda BTC", change24h: 2.5, direction: "up" },
    { code: "ETH", name: "Moneda ETH", change24h: -1.2, direction: "down" },
    { code: "SOL", name: "Moneda SOL", change24h: 0, direction: "up" },
    { code: "XRP", name: "Moneda XRP", change24h: 4, direction: "up" },
  ]);
  check("sin cambio conocido no hay barra", rateChangeSeries(options.filter((o) => o.kind === "fiat")), []);
}

// Estados.
{
  check("bloque cargando", blockStatus({ isPending: true, isError: false, rows: 0 }), "loading");
  check("bloque con filas", blockStatus({ isPending: false, isError: false, rows: 4 }), "ready");
  check("bloque con filas aunque falle la recarga", blockStatus({ isPending: false, isError: true, rows: 4 }), "ready");
  check("bloque con error", blockStatus({ isPending: false, isError: true, rows: 0 }), "error");
  check("bloque vacío", blockStatus({ isPending: false, isError: false, rows: 0 }), "empty");
  check("formulario: el error manda", formStatus(true, true), "error");
  check("formulario cargando", formStatus(true, false), "loading");
  check("formulario listo", formStatus(false, false), "ready");
}
