/**
 * Comprobaciones de los textos con parámetros del Panel: deben dar
 * exactamente lo que la interfaz escribía a mano.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import { PANEL_TEXTS as T } from "../texts.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

check("etiqueta del anillo", T.stats.dominanceRingLabel, "Bitcoin");
check("texto alternativo del anillo", T.stats.dominanceRingAlt("54.3 %"), "Bitcoin supone el 54.3 % del mercado");
check("gráfica de Bitcoin sin puntos", T.bitcoin.chartAlt, "Evolución del precio de Bitcoin.");
check(
  "gráfica de Bitcoin con puntos",
  T.bitcoin.chartAltRange({ firstPrice: "$60000,00", firstDate: "1 de julio de 2026", lastPrice: "$64000,00", lastDate: "8 de octubre de 2026" }),
  "Evolución del precio de Bitcoin: de $60000,00 (1 de julio de 2026) a $64000,00 (8 de octubre de 2026).",
);
