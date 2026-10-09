/**
 * Comprobaciones de las marcas de eje: el formateador con rango no repite
 * texto entre marcas contiguas y `formatAxisPrice` sigue dando lo de siempre.
 * Se ejecutan con `node --experimental-strip-types` sobre este archivo.
 */
import {
  axisTickStep,
  createAxisPriceFormatter,
  formatAxisPrice,
  formatAxisPriceForStep,
} from "../format.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

/** Marcas como las del eje de las gráficas: base del eje + múltiplos del paso. */
function marks(domain: readonly [number, number], tickCount: number, fromBase: boolean): number[] {
  const step = axisTickStep(domain, tickCount);
  const start = fromBase ? domain[0] : Math.ceil(domain[0] / step - 1e-9) * step;
  const out: number[] = [];
  for (let i = 0; start + i * step <= domain[1] + step * 1e-9; i += 1) out.push(start + i * step);
  return out;
}

function texts(domain: readonly [number, number], tickCount = 4, fromBase = false): string[] {
  const format = createAxisPriceFormatter(domain, tickCount);
  return marks(domain, tickCount, fromBase).map(format);
}

const sinRepetir = (lista: string[]) => new Set(lista).size === lista.length;

// formatAxisPrice sin rango: igual que antes.
check("sin rango, miles", formatAxisPrice(3100), "$3 K");
check("sin rango, miles grandes", formatAxisPrice(64321), "$64 K");
check("sin rango, millones", formatAxisPrice(1_500_000), "$1.5 M");
check("sin rango, miles de millones", formatAxisPrice(2_340_000_000), "$2.3 G");
check("sin rango, unidades", formatAxisPrice(12.4), "$12");
check("sin rango, céntimos", formatAxisPrice(0.1234), "$0.1234");

// Paso entre marcas (misma cuenta que d3).
check("paso 3.000–3.400", axisTickStep([3000, 3400]), 100);
check("paso del fallo del vigía (2.940–3.468)", axisTickStep([2940, 3468]), 100);
check("paso rango amplio", axisTickStep([20000, 70000]), 10000);
check("paso sin anchura", axisTickStep([5, 5]), 0);

// Rango estrecho en miles: el caso del fallo.
check("3.000–3.400", texts([3000, 3400]), ["$3,0 K", "$3,1 K", "$3,2 K", "$3,3 K", "$3,4 K"]);
check(
  "2.940–3.468 desde la base del eje (6 marcas)",
  texts([2940, 3468], 4, true),
  ["$2,9 K", "$3,0 K", "$3,1 K", "$3,2 K", "$3,3 K", "$3,4 K"],
);
check("Bitcoin 24 h (63.800–64.900) sin repetir", sinRepetir(texts([63800, 64900], 4, true)), true);
check("Bitcoin 24 h, textos", texts([64000, 65000]), ["$64,0 K", "$64,2 K", "$64,4 K", "$64,6 K", "$64,8 K", "$65,0 K"]);
check("paso de 500 en miles", texts([3000, 5000]), ["$3,0 K", "$3,5 K", "$4,0 K", "$4,5 K", "$5,0 K"]);

// Rango amplio: igual que formatAxisPrice.
check("rango amplio en miles", texts([20000, 70000]), ["$20 K", "$30 K", "$40 K", "$50 K", "$60 K", "$70 K"]);
check(
  "rango amplio coincide con formatAxisPrice",
  texts([20000, 70000]),
  marks([20000, 70000], 4, false).map(formatAxisPrice),
);
check("rango amplio en unidades", texts([100, 500]), ["$100", "$200", "$300", "$400", "$500"]);
check("millones", texts([1_000_000, 3_000_000]), ["$1,0 M", "$1,5 M", "$2,0 M", "$2,5 M", "$3,0 M"]);

// Stablecoin.
check("stablecoin 0,9990–1,0010", texts([0.999, 1.001]), ["$0,9990", "$0,9995", "$1,0000", "$1,0005", "$1,0010"]);

// Céntimos.
check("céntimos 0,10–0,14", texts([0.1, 0.14]), ["$0,10", "$0,11", "$0,12", "$0,13", "$0,14"]);
check("fracciones de céntimo sin repetir", sinRepetir(texts([0.00012, 0.00019], 4, true)), true);
check("dólares con paso menor que 1 (12–14): céntimos", texts([12, 14]), ["$12,00", "$12,50", "$13,00", "$13,50", "$14,00"]);

// Barrido: ningún rango repite marcas contiguas.
const dominios: [number, number][] = [
  [2940, 3468], [0.98, 1.02], [61000, 61300], [995, 1005], [0.000021, 0.000024],
  [149.2, 151.7], [999_000, 1_002_000], [1.2e9, 1.21e9], [0.4, 9], [87, 12500],
];
for (const dominio of dominios) {
  for (const n of [3, 4, 5, 6]) {
    check(`sin repetir ${dominio[0]}–${dominio[1]} con ${n} marcas`, sinRepetir(texts(dominio, n, true)), true);
  }
}

// Paso inválido: cae en formatAxisPrice.
check("paso 0 = formatAxisPrice", formatAxisPriceForStep(3100, 0), "$3 K");
check("rango sin anchura = formatAxisPrice", createAxisPriceFormatter([3100, 3100])(3100), "$3 K");
check("paso NaN = formatAxisPrice", formatAxisPriceForStep(0.5, Number.NaN), "$0.5000");
