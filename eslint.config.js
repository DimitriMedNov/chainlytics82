import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import tseslint from "typescript-eslint";

/**
 * Regla de dependencias entre capas (ver ARCHITECTURE.md). Las dependencias
 * apuntan hacia dentro: domain <- application <- infrastructure, y la interfaz
 * solo llega a la infraestructura a través del composition root (src/app).
 * `scripts/check-architecture.mjs` comprueba lo mismo sin depender de ESLint.
 */
const VIEJO = "lib|types|contexts|components|pages";

/**
 * Prohíbe importar esas carpetas de `src`, por alias (`@/x`) o subiendo con
 * ruta relativa (`../../x`). El script resuelve las rutas relativas de verdad;
 * aquí basta con cazar las que suben dos niveles o más.
 */
const carpetas = (nombres, message) => ({
  regex: `^(@/|(\\.\\./){2,})(${nombres})(/|$)`,
  message,
});

/**
 * Lo viejo visto desde la interfaz nueva. `src/lib` y `src/hooks` no se pueden
 * vetar enteros: ahí viven también utilidades del front nuevo (`@/lib/utils`,
 * `@/lib/get-strict-context`, `@/hooks/use-controlled-state`...), así que se
 * nombran uno a uno los archivos de la interfaz anterior.
 */
const LIB_VIEJO = "analystStream|backendStatus|coingecko|compareMath|format|portfolioMath";
const HOOKS_VIEJOS =
  "useAnalystChat|useChartColors|useCompareSelection|useComparison|useConvertibles|useDebounced|" +
  "useLocalDataSync|useMarketData|useMarketFilters|usePortfolio|useResolvedTheme|" +
  "useTransactionForm|useWatchlist|useWatchlistSorting|useWatchlistView|use-toast";
const viejoDesdeLaInterfaz = (message) => ({
  regex:
    `^@/((types|contexts|components|pages)(/|$)` +
    `|lib/(${LIB_VIEJO})(\\.tsx?)?$|hooks/(${HOOKS_VIEJOS})(\\.tsx?)?$)`,
  message,
});

const paquetes = (nombres, message) => nombres.map((name) => ({ name, message }));

const SOLO_DOMINIO = "El dominio es puro: no importa React, librerías ni otras capas.";
const SOLO_HACIA_DENTRO = "Las dependencias apuntan hacia dentro (ver ARCHITECTURE.md).";
const NADA_VIEJO = "El front nuevo no importa nada de la interfaz anterior (CONTRACT §12).";

const limitesDeCapas = [
  {
    files: ["src/domain/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: paquetes(
          ["react", "react-dom", "@tanstack/react-query", "@supabase/supabase-js", "zod"],
          SOLO_DOMINIO,
        ),
        patterns: [
          carpetas(`application|infrastructure|hooks|ui|app|integrations|${VIEJO}`, SOLO_DOMINIO),
        ],
      }],
    },
  },
  {
    // `zod` sí se permite aquí: valida lo que escribe el usuario en un caso de uso.
    files: ["src/application/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: paquetes(
          ["react", "react-dom", "@tanstack/react-query", "@supabase/supabase-js"],
          "application solo importa de domain (y zod para validar entradas).",
        ),
        patterns: [
          carpetas(`infrastructure|hooks|ui|app|integrations|${VIEJO}`, SOLO_HACIA_DENTRO),
        ],
      }],
    },
  },
  {
    files: ["src/infrastructure/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: paquetes(["react", "react-dom", "@tanstack/react-query"], SOLO_HACIA_DENTRO),
        patterns: [carpetas(`hooks|ui|app|${VIEJO}`, SOLO_HACIA_DENTRO)],
      }],
    },
  },
  {
    // Hooks nuevos (en subcarpetas; los planos de src/hooks son de la interfaz anterior) e interfaz nueva.
    files: ["src/hooks/*/**/*.{ts,tsx}", "src/ui/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", {
        paths: paquetes(
          ["@supabase/supabase-js"],
          "La interfaz no habla con Supabase: usa un hook de src/hooks/<funcionalidad>/.",
        ),
        patterns: [
          carpetas(
            "infrastructure|integrations",
            "La interfaz no importa adaptadores: usa un hook de src/hooks/<funcionalidad>/.",
          ),
          viejoDesdeLaInterfaz(NADA_VIEJO),
        ],
      }],
    },
  },
  {
    files: ["src/app/**/*.{ts,tsx}"],
    rules: {
      "no-restricted-imports": ["error", { patterns: [viejoDesdeLaInterfaz(NADA_VIEJO)] }],
    },
  },
];

export default tseslint.config(
  { ignores: ["dist"] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ["**/*.{ts,tsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      "react-refresh/only-export-components": [
        "warn",
        { allowConstantExport: true },
      ],
      "@typescript-eslint/no-unused-vars": "off",
    },
  },
  ...limitesDeCapas
);
