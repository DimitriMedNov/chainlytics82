/**
 * Comprobaciones de los dos formularios de la pantalla Portfolio: registrar
 * movimiento y fijar el coste de una posición. Se ejecutan con
 * `node --experimental-strip-types` sobre este archivo.
 */
import type { Coin } from "../../market/coin.ts";
import { costInvested, parseCostPrice } from "../setCost.ts";
import {
  buildNewTransaction,
  emptyTransactionForm,
  happenedAtFromInputDate,
  operationTotal,
  suggestedUnitPrice,
  todayAsInputDate,
  type TransactionFormValues,
} from "../transactionForm.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const btc = { id: "bitcoin", symbol: "BTC", name: "Bitcoin", price: 50_000 } as Coin;
const coins = [btc];
const form: TransactionFormValues = {
  kind: "compra", coinId: "bitcoin", amount: "0,5", unitPrice: "40000", date: "2026-03-10",
};

// Formulario de movimiento
{
  const local = new Date(2026, 9, 8, 23, 30);
  check("hoy en hora local", todayAsInputDate(local), "2026-10-08");
  check("formulario vacío", emptyTransactionForm("2026-10-08"), {
    kind: "compra", coinId: "", amount: "", unitPrice: "", date: "2026-10-08",
  });
  check("fecha a las 12:00 locales", happenedAtFromInputDate("2026-03-10"),
    new Date(2026, 2, 10, 12).toISOString());
  check("precio propuesto", suggestedUnitPrice(coins, "bitcoin"), "50000");
  check("moneda desconocida no propone", suggestedUnitPrice(coins, "nada"), null);

  check("total en vivo", operationTotal("0,5", "40000"), 20_000);
  check("sin precio no hay total", operationTotal("1", ""), null);
  check("cantidad 0 no hay total", operationTotal("0", "10"), null);
  check("precio negativo da total negativo (conservado)", operationTotal("2", "-5"), -10);

  check("movimiento válido", buildNewTransaction(form, coins), {
    ok: true,
    value: {
      coinId: "bitcoin", symbol: "BTC", kind: "compra", amount: 0.5, unitPrice: 40_000,
      happenedAt: new Date(2026, 2, 10, 12).toISOString(),
    },
  });
  const sinPrecio = buildNewTransaction({ ...form, unitPrice: "  " }, coins);
  check("precio vacío se guarda null", sinPrecio.ok && sinPrecio.value.unitPrice, null);
  const gratis = buildNewTransaction({ ...form, unitPrice: "0" }, coins);
  check("precio 0 vale", gratis.ok && gratis.value.unitPrice, 0);
  const venta = buildNewTransaction({ ...form, kind: "venta", amount: "999" }, coins);
  check("venta mayor que el saldo no se rechaza (conservado)", venta.ok, true);

  const error = (values: TransactionFormValues) => {
    const result = buildNewTransaction(values, coins);
    return result.ok ? null : result.error;
  };
  check("sin moneda", error({ ...form, coinId: "" }), "no-coin");
  check("la moneda va antes que la cantidad", error({ ...form, coinId: "", amount: "" }), "no-coin");
  check("cantidad vacía", error({ ...form, amount: "" }), "invalid-amount");
  check("cantidad 0", error({ ...form, amount: "0" }), "invalid-amount");
  check("cantidad negativa", error({ ...form, amount: "-1" }), "invalid-amount");
  check("cantidad antes que precio", error({ ...form, amount: "x", unitPrice: "-1" }), "invalid-amount");
  check("precio negativo", error({ ...form, unitPrice: "-1" }), "invalid-price");
  check("precio no numérico", error({ ...form, unitPrice: "abc" }), "invalid-price");
}

// Diálogo de coste
{
  check("precio válido", parseCostPrice("12,5"), { ok: true, value: 12.5 });
  check("vacío no vale", parseCostPrice("").ok, false);
  check("0 no vale", parseCostPrice("0").ok, false);
  check("invertido en vivo", costInvested("100", 2.5), 250);
  check("sin precio válido no hay invertido", costInvested("", 2.5), null);
}
