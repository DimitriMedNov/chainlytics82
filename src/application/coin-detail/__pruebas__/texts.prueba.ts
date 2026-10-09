/**
 * Comprobaciones de los textos con parámetros del modal de detalle: deben dar
 * exactamente lo que la interfaz escribía a mano.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import { COIN_DETAIL_TEXTS as T } from "../presentation/texts.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

check("descripción del diálogo", T.dialogDescription("Ethereum"), "Precio, evolución y cifras de mercado de Ethereum.");
check("prefijo del ranking con espacio", T.rankPrefix, "Puesto ");
check("valor de la barra", T.ratioValueText(42), "42 %");
check(
  "barra con marcador",
  T.ratioMarkerLabel(T.dayRangeBarLabel, 42),
  "Precio dentro del rango de 24 h: 42 % del recorrido entre el mínimo y el máximo",
);
check("gráfica sin resumen", T.chartAlt("Ethereum"), "Evolución del precio de Ethereum.");
check(
  "gráfica con resumen",
  T.chartAltSummary({ coinName: "Ethereum", first: "$3000,00", last: "$3400,00", changePct: "+13.33 %", min: "$2950,00", max: "$3410,00" }),
  "Evolución del precio de Ethereum: de $3000,00 a $3400,00 (+13.33 %). Mínimo $2950,00, máximo $3410,00.",
);
check(
  "gráfica con resumen sin porcentaje",
  T.chartAltSummary({ coinName: "Ethereum", first: "$3000,00", last: "$3400,00", changePct: null, min: "$2950,00", max: "$3410,00" }),
  "Evolución del precio de Ethereum: de $3000,00 a $3400,00. Mínimo $2950,00, máximo $3410,00.",
);
