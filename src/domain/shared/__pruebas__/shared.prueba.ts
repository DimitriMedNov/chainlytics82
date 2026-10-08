/**
 * Comprobaciones del núcleo compartido: Result, dinero que puede ser
 * desconocido, cantidades escritas por el usuario y rangos. Se ejecutan con
 * `node --experimental-strip-types` sobre este archivo.
 */
import { foldUsd, isKnownUsd, mapUsd, usdFrom, usdTimes } from "../money.ts";
import { isHourlyRange, isRangeDays, nextWiderRange, RANGES } from "../range.ts";
import { err, ok, type Result } from "../result.ts";
import { optionalNonNegativeAmount, parseUserAmount, positiveAmount } from "../userAmount.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  const iguales = a === b || (Number.isNaN(real) && Number.isNaN(esperado));
  console.log(`${iguales ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (!iguales) process.exitCode = 1;
}

// Result: el éxito lleva valor, el error lleva motivo, y se distinguen por `ok`.
{
  const bien: Result<number, string> = ok(3);
  const mal: Result<number, string> = err("no");
  check("ok lleva el valor", bien, { ok: true, value: 3 });
  check("err lleva el motivo", mal, { ok: false, error: "no" });
  check("se estrecha por ok", bien.ok ? bien.value : -1, 3);
  check("se estrecha por error", mal.ok ? "" : mal.error, "no");
}

// Dinero desconocido: lo que se calcula con un desconocido sigue desconocido.
{
  check("número finito se conoce", usdFrom(12.5), 12.5);
  check("cero se conoce", usdFrom(0), 0);
  check("null es desconocido", usdFrom(null), null);
  check("texto es desconocido", usdFrom("12"), null);
  check("NaN es desconocido", usdFrom(Number.NaN), null);
  check("infinito es desconocido", usdFrom(Number.POSITIVE_INFINITY), null);
  check("isKnownUsd con valor", isKnownUsd(0), true);
  check("isKnownUsd con null", isKnownUsd(null), false);
  check("precio × cantidad", usdTimes(100, 2.5), 250);
  check("precio desconocido × cantidad", usdTimes(null, 2.5), null);
  check("mapUsd aplica el cálculo", mapUsd(10, (v) => v - 4), 6);
  check("mapUsd conserva el desconocido", mapUsd(null, (v) => v - 4), null);
  check("foldUsd con valor", foldUsd(5, (v) => `$${v}`, "—"), "$5");
  check("foldUsd sin valor", foldUsd(null, (v) => `$${v}`, "—"), "—");
}

// Cantidad escrita: mismo parseo que tenía la app (coma decimal, parseFloat).
{
  check("punto decimal", parseUserAmount("0.5"), 0.5);
  check("coma decimal", parseUserAmount("0,5"), 0.5);
  check("vacío no es número", parseUserAmount(""), Number.NaN);
  check("letras no son número", parseUserAmount("abc"), Number.NaN);
  check("parseFloat lee el prefijo numérico", parseUserAmount("12abc"), 12);
  check("solo se cambia la primera coma", parseUserAmount("1,5,5"), 1.5);

  check("positiva válida", positiveAmount("2"), { ok: true, value: 2 });
  check("positiva con cero", positiveAmount("0"), { ok: false, error: "not-positive" });
  check("positiva con negativo", positiveAmount("-1"), { ok: false, error: "not-positive" });
  check("positiva vacía", positiveAmount(""), { ok: false, error: "not-a-number" });

  check("precio vacío es 'no lo recuerdo'", optionalNonNegativeAmount("  "), { ok: true, value: null });
  check("precio cero vale", optionalNonNegativeAmount("0"), { ok: true, value: 0 });
  check("precio negativo no vale", optionalNonNegativeAmount("-3"), { ok: false, error: "negative" });
  check("precio con letras no vale", optionalNonNegativeAmount("x"), { ok: false, error: "not-a-number" });
}

// Rangos de los gráficos.
{
  check("cinco rangos", RANGES.map((r) => r.days), [1, 7, 30, 90, 365]);
  check("30 es un rango", isRangeDays(30), true);
  check("15 no es un rango", isRangeDays(15), false);
  check("1 día va por horas", isHourlyRange(1), true);
  check("7 días va por días", isHourlyRange(7), false);

  check("tras 24 h viene 7 d", nextWiderRange(1), { days: 7, label: "7 d" });
  check("tras 7 d viene 30 d", nextWiderRange(7), { days: 30, label: "30 d" });
  check("tras 30 d viene 90 d", nextWiderRange(30), { days: 90, label: "90 d" });
  check("tras 90 d viene 1 año", nextWiderRange(90), { days: 365, label: "1 año" });
  check("1 año ya es el mayor", nextWiderRange(365), null);
}
