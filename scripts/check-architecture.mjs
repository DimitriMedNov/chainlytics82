#!/usr/bin/env node
/**
 * Comprueba la regla de dependencias entre capas (ver ARCHITECTURE.md).
 * Node puro, sin dependencias. Sale con código 1 si hay alguna violación.
 *
 *   node scripts/check-architecture.mjs
 *
 * Qué mira, archivo por archivo, en las capas nuevas:
 *   1. A qué capa apunta cada import (resolviendo el alias `@/` y las rutas
 *      relativas) y si esa capa puede importar de ahí.
 *   2. Qué paquetes externos usa cada capa.
 *   3. Que `fetch`, `localStorage`, `sessionStorage` e `import.meta.env` solo
 *      aparezcan en `infrastructure` y en el composition root (`src/app`).
 *   4. Que no haya ninguna URL escrita a mano (`http://` o `https://`) en
 *      `domain` ni en `application`: las direcciones van en `infrastructure`
 *      o en el composition root. No cuentan los comentarios ni las pruebas.
 */
import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, posix, relative, sep } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src");

// --- Qué es "lo viejo" (la interfaz anterior, congelada hasta que se retire) ---
const LIB_VIEJO = ["analystStream", "backendStatus", "coingecko", "compareMath", "format", "portfolioMath"];
const HOOKS_VIEJOS = [
  "useAnalystChat", "useChartColors", "useCompareSelection", "useComparison", "useConvertibles",
  "useDebounced", "useLocalDataSync", "useMarketData", "useMarketFilters", "usePortfolio",
  "useResolvedTheme", "useTransactionForm", "useWatchlist", "useWatchlistSorting",
  "useWatchlistView", "use-toast",
];

/** Capa de una ruta relativa a `src` (con `/`). */
function layerOf(path) {
  const [first, second = ""] = path.split("/");
  const name = second.replace(/\.(ts|tsx)$/, "");
  if (["domain", "application", "infrastructure", "ui", "app", "integrations"].includes(first)) {
    return first;
  }
  if (["types", "contexts", "components", "pages"].includes(first)) return "viejo";
  if (["App", "main", "App.tsx", "main.tsx"].includes(first)) return "viejo";
  if (first === "lib") {
    if (path.includes("/__pruebas__/")) return "viejo";
    return LIB_VIEJO.includes(name) ? "viejo" : "utilidades";
  }
  if (first === "hooks") {
    // Los hooks nuevos van en subcarpetas por funcionalidad; los planos son
    // de la interfaz anterior o utilidades que instalan las fuentes de UI.
    if (path.split("/").length > 2) return "hooks";
    return HOOKS_VIEJOS.includes(name) ? "viejo" : "utilidades";
  }
  return "otro";
}

// --- La regla: qué capas y qué paquetes puede importar cada capa ---
const RULES = {
  domain: {
    layers: ["domain"],
    packages: () => false,
    why: "domain es puro: no importa React, librerías ni otras capas",
  },
  application: {
    layers: ["domain", "application"],
    packages: (name) => name === "zod",
    why: "application solo importa de domain (y zod para validar entradas)",
  },
  infrastructure: {
    layers: ["domain", "application", "infrastructure", "integrations"],
    packages: (name) => !["react", "react-dom", "@tanstack/react-query"].includes(name),
    why: "infrastructure importa de application y domain; no conoce React ni la interfaz",
  },
  hooks: {
    layers: ["domain", "application", "hooks", "app", "utilidades"],
    packages: (name) => name !== "@supabase/supabase-js",
    why: "los hooks llegan a los datos por el composition root (useDeps), no por los adaptadores",
  },
  ui: {
    layers: ["domain", "application", "hooks", "app", "ui", "utilidades"],
    packages: (name) => name !== "@supabase/supabase-js",
    why: "la interfaz usa hooks de src/hooks/<funcionalidad>/; no importa adaptadores ni lo viejo",
  },
  app: {
    layers: ["domain", "application", "infrastructure", "integrations", "hooks", "app", "ui", "utilidades"],
    packages: () => true,
    why: "el composition root no importa nada de la interfaz anterior",
  },
};

/** Fuera de infrastructure y app no se toca la red, el almacenamiento ni el entorno. */
const FORBIDDEN_TOKENS = [
  [/\bfetch\s*\(/, "fetch("],
  [/\blocalStorage\b/, "localStorage"],
  [/\bsessionStorage\b/, "sessionStorage"],
  [/\bimport\.meta\.env\b/, "import.meta.env"],
];
const TOKEN_LAYERS = ["domain", "application", "hooks", "ui"];

/** El núcleo (domain y application) no conoce direcciones de ningún servicio. */
const URL_LITERAL = /\bhttps?:\/\//i;
const URL_LAYERS = ["domain", "application"];

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return walk(path);
    return /\.(ts|tsx)$/.test(entry.name) && !entry.name.endsWith(".d.ts") ? [path] : [];
  });
}

/** Quita comentarios conservando los saltos de línea, para que cuadren los números de línea. */
function stripComments(code) {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, (block) => block.replace(/[^\n]/g, " "))
    .replace(/(^|[^:'"`\\])\/\/[^\n]*/g, "$1");
}

const IMPORT_PATTERNS = [
  /\b(?:import|export)\s+(?:type\s+)?[^'"`;]*?\bfrom\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]\s*\)/g,
];

function importsOf(code) {
  const found = [];
  for (const pattern of IMPORT_PATTERNS) {
    for (const match of code.matchAll(pattern)) {
      const line = code.slice(0, match.index).split("\n").length;
      found.push({ specifier: match[1], line });
    }
  }
  return found;
}

/** Ruta relativa a `src` a la que apunta el import, o null si es un paquete. */
function resolve(specifier, fromFile) {
  if (specifier.startsWith("@/")) return specifier.slice(2);
  if (specifier.startsWith(".")) {
    const fromDir = posix.dirname(fromFile);
    return posix.normalize(posix.join(fromDir, specifier));
  }
  return null;
}

function packageName(specifier) {
  const parts = specifier.split("/");
  return specifier.startsWith("@") ? parts.slice(0, 2).join("/") : parts[0];
}

const violations = [];
let checked = 0;

for (const absolute of walk(src)) {
  const file = relative(src, absolute).split(sep).join("/");
  const layer = layerOf(file);
  const rule = RULES[layer];
  if (!rule) continue; // lo viejo y las utilidades no se comprueban
  checked++;

  const code = stripComments(readFileSync(absolute, "utf8"));
  const isTest = file.includes("/__pruebas__/");

  for (const { specifier, line } of importsOf(code)) {
    const target = resolve(specifier, file);
    if (target === null) {
      if (specifier.startsWith("node:") && isTest) continue;
      if (!rule.packages(packageName(specifier))) {
        violations.push(`src/${file}:${line}  importa el paquete "${specifier}" — ${rule.why}`);
      }
      continue;
    }
    const targetLayer = target.startsWith("..") ? "otro" : layerOf(target);
    if (!rule.layers.includes(targetLayer)) {
      violations.push(`src/${file}:${line}  importa "${specifier}" (${targetLayer}) — ${rule.why}`);
    }
  }

  if (TOKEN_LAYERS.includes(layer) && !isTest) {
    code.split("\n").forEach((text, index) => {
      for (const [pattern, name] of FORBIDDEN_TOKENS) {
        if (pattern.test(text)) {
          violations.push(
            `src/${file}:${index + 1}  usa ${name} — solo se permite en infrastructure y en src/app`,
          );
        }
      }
    });
  }

  if (URL_LAYERS.includes(layer) && !isTest) {
    code.split("\n").forEach((text, index) => {
      if (URL_LITERAL.test(text)) {
        violations.push(
          `src/${file}:${index + 1}  contiene una URL literal — las URLs solo van en infrastructure y en src/app`,
        );
      }
    });
  }
}

if (violations.length > 0) {
  console.error(`Arquitectura: ${violations.length} violaciones en ${checked} archivos revisados.\n`);
  violations.sort().forEach((violation) => console.error(`  ${violation}`));
  process.exit(1);
}
console.log(`Arquitectura: OK. ${checked} archivos revisados, 0 violaciones.`);
