/**
 * Comprobaciones del caso de uso de copiar y de los textos del convertidor.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import { convert } from "../../../domain/converter/conversion.ts";
import type { Convertible } from "../../../domain/converter/convertible.ts";
import { resultText, summaryText, unitPriceText } from "../presentation/conversionText.ts";
import { COPIED_FEEDBACK_MS, COPY_FAILED, copyResult } from "../useCases.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  const iguales = a === b;
  console.log(`${iguales ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (!iguales) process.exitCode = 1;
}

const btc: Convertible = { code: "BTC", name: "Bitcoin", usdPrice: 60000, change24h: 1, kind: "cripto" };
const eur: Convertible = { code: "EUR", name: "Euro", usdPrice: 1.1, change24h: null, kind: "fiat" };
const usd: Convertible = { code: "USD", name: "Dólar estadounidense", usdPrice: 1, change24h: null, kind: "fiat" };

// Copiar: éxito y fallo previsto.
{
  const copiados: string[] = [];
  const bien = await copyResult({ writeText: async (text) => void copiados.push(text) }, "60.000");
  check("copia el texto tal cual", copiados, ["60.000"]);
  check("éxito", bien, { ok: true });
  const mal = await copyResult({ writeText: () => Promise.reject(new Error("NotAllowedError")) }, "1");
  check("fallo con su aviso", mal, {
    ok: false,
    error: { title: "No se pudo copiar", description: "Tu navegador bloqueó el acceso al portapapeles." },
  });
  const roto = await copyResult({ writeText: () => { throw new TypeError("sin portapapeles"); } }, "1");
  check("fallo síncrono también es aviso", roto, { ok: false, error: COPY_FAILED });
  check("la señal de copiado dura 2 s", COPIED_FEEDBACK_MS, 2000);
}

// Textos.
{
  const form = { amount: "1", fromCode: "USD", toCode: "EUR" };
  const conversion = convert("1", usd, eur);
  check("resultado con 8 decimales como mucho", resultText(conversion), "0,90909091");
  check("resultado vacío", resultText(null), "");
  check("resumen", summaryText(form, conversion), "1 USD = 0,90909091 EUR");
  check("resumen con miles", summaryText({ amount: "2", fromCode: "BTC", toCode: "USD" }, convert("2", btc, usd)), "2 BTC = 120.000 USD");
  check("sin conversión no hay resumen", summaryText(form, null), null);
  check("precio por unidad", unitPriceText(btc), "1 BTC = $60.000,00");
  check("precio por unidad menor que 1", unitPriceText({ ...eur, usdPrice: 0.0068 }), "1 EUR = $0,0068");
}
