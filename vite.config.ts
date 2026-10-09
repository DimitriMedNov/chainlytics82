import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        // Librerías que cambian poco, en chunks propios: al desplegar un cambio de
        // la app el navegador solo vuelve a bajar nuestro código, no todo React ni Supabase.
        manualChunks(id: string) {
          // Ayudantes compartidos de Rollup/Vite (interop de CommonJS, precarga de
          // chunks dinámicos, módulos virtuales "\0"): al trozo base `react`, que la
          // entrada ya carga siempre. Si caen en `graficas`/`recharts`, el trozo base
          // los importa y arrastra las gráficas a todas las rutas.
          if (id.includes("commonjsHelpers") || id.includes("vite/preload-helper") || id.includes("vite/modulepreload-polyfill"))
            return "react";
          if (id.startsWith("\0") && !id.includes("node_modules")) return "react";
          if (!id.includes("node_modules")) return undefined;
          const en = (...paquetes: string[]) =>
            paquetes.some((p) => id.includes(`/node_modules/${p}/`));
          if (en("react", "react-dom", "react-router", "react-router-dom", "scheduler"))
            return "react";
          if (en("motion", "motion-dom", "motion-utils", "framer-motion")) return "motion";
          if (id.includes("/node_modules/@radix-ui/") || en("radix-ui")) return "radix";
          if (id.includes("/node_modules/@visx/") || id.includes("/node_modules/d3-") || en("internmap", "delaunator"))
            return "graficas";
          if (en("recharts", "recharts-scale", "victory-vendor", "lodash", "react-smooth")) return "recharts";
          if (id.includes("/node_modules/@supabase/")) return "supabase";
          if (en("@tanstack/react-query", "@tanstack/query-core")) return "query";
          if (
            en("react-markdown", "unified", "remark-parse", "remark-rehype", "mdast-util-to-hast", "micromark", "hast-util-to-jsx-runtime") ||
            /\/node_modules\/(micromark|mdast|hast|unist|remark|rehype|vfile|property-information|space-separated-tokens|comma-separated-tokens|decode-named-character-reference|character-entities|trough|bail|devlop|estree-util|is-plain-obj|html-url-attributes|ccount|zwitch|trim-lines|longest-streak|markdown-table)/.test(id)
          )
            return "markdown";
          if (en("animejs")) return "animejs";
          return undefined;
        },
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
