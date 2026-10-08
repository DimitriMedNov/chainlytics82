/**
 * Comprobaciones de las reglas del buscador global. Se comparan con lo que
 * hacía la interfaz anterior, copiado aquí al pie de la letra. Se ejecutan
 * con `node --experimental-strip-types`.
 */
import type { Coin, CoinSearchResult } from "../../market/coin.ts";
import {
  SEARCH_MAX_RESULTS,
  SEARCH_MIN_CHARS,
  idsToFetch,
  isQueryTooShort,
  limitResults,
  resolveSearchStatus,
  resolveSelectedCoin,
} from "../rules.ts";
import { isMacPlatform, isSearchShortcut } from "../shortcut.ts";

function check(nombre: string, real: unknown, esperado: unknown) {
  const a = JSON.stringify(real);
  const b = JSON.stringify(esperado);
  console.log(`${a === b ? "✓" : "✗ FALLA"} ${nombre}: ${a} (esperado ${b})`);
  if (a !== b) process.exitCode = 1;
}

const coin = (id: string, symbol: string): Coin => ({
  id, symbol, rank: 1, name: id, image: "", price: 1, change24h: 0, change7d: null,
  marketCap: 0, volume24h: 0, high24h: 0, low24h: 0, ath: 0, athChangePct: 0, atl: 0,
  circulatingSupply: 0, totalSupply: null, fdv: null,
});
const result = (n: number): CoinSearchResult => ({
  id: `c${n}`, name: `C${n}`, symbol: `C${n}`, thumb: "", rank: null,
});

// --- Mínimo y máximo ---
check("mínimo de letras", SEARCH_MIN_CHARS, 2);
check("máximo de resultados", SEARCH_MAX_RESULTS, 12);
check("vacío es corto", isQueryTooShort(""), true);
check("una letra es corto", isQueryTooShort("b"), true);
check("una letra con espacios es corto", isQueryTooShort("  b  "), true);
check("dos letras ya busca", isQueryTooShort("bt"), false);
check("recorta a 12", limitResults(Array.from({ length: 20 }, (_, i) => result(i))).length, 12);
check("menos de 12 se queda igual", limitResults([result(1), result(2)]).length, 2);

// --- Estado de la paleta: CoinSearchDialog.tsx:31-39, 50-59 ---
function estadoAntes(query: string, n: number, isFetching: boolean, isError: boolean): string {
  if (n > 0) return "results";
  if (query.trim().length < 2) return "too-short";
  if (isFetching) return "searching";
  if (isError) return "error";
  return "empty";
}
for (const query of ["", "b", "bt"]) {
  for (const resultCount of [0, 3]) {
    for (const isFetching of [false, true]) {
      for (const isError of [false, true]) {
        check(
          `estado "${query}" n=${resultCount} fetching=${isFetching} error=${isError}`,
          resolveSearchStatus({ query, resultCount, isFetching, isError }),
          estadoAntes(query, resultCount, isFetching, isError),
        );
      }
    }
  }
}

// --- "Si ya está en el top, no la pidas otra vez": GlobalSearch.tsx:20-26 ---
const top = [coin("bitcoin", "BTC"), coin("ethereum", "ETH")];
const fuera = coin("pepe", "PEPE");
check("sin selección no pide nada", idsToFetch(top, null), []);
check("en el top no pide nada", idsToFetch(top, "bitcoin"), []);
check("fuera del top pide por id", idsToFetch(top, "pepe"), ["pepe"]);
check("sin top cargado pide por id", idsToFetch(undefined, "bitcoin"), ["bitcoin"]);
check("resuelve desde el top", resolveSelectedCoin(top, "ethereum", undefined)?.id, "ethereum");
check("resuelve desde la petición", resolveSelectedCoin(top, "pepe", [fuera])?.id, "pepe");
check("aún cargando es null", resolveSelectedCoin(top, "pepe", undefined), null);
check("petición vacía es null", resolveSelectedCoin(top, "pepe", []), null);
check("sin selección es null", resolveSelectedCoin(top, null, undefined), null);
check("el top gana a la petición", resolveSelectedCoin(top, "bitcoin", [fuera])?.id, "bitcoin");
// Conservado: findCoin también casa por símbolo.
check("id igual a un símbolo del top casa", resolveSelectedCoin(top, "btc", undefined)?.id, "bitcoin");

// --- Atajo y plataforma: SearchContext.tsx:45-50, CoinSearchTrigger.tsx:12-13 ---
check("⌘K", isSearchShortcut({ key: "k", metaKey: true, ctrlKey: false }), true);
check("Ctrl+K", isSearchShortcut({ key: "k", metaKey: false, ctrlKey: true }), true);
check("K mayúscula", isSearchShortcut({ key: "K", metaKey: false, ctrlKey: true }), true);
check("k sola no", isSearchShortcut({ key: "k", metaKey: false, ctrlKey: false }), false);
check("otra tecla no", isSearchShortcut({ key: "j", metaKey: true, ctrlKey: true }), false);
check("MacIntel es Mac", isMacPlatform("MacIntel"), true);
check("Win32 no es Mac", isMacPlatform("Win32"), false);
check("Linux no es Mac", isMacPlatform("Linux x86_64"), false);
