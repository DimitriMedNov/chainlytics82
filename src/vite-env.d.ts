/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_PUBLISHABLE_KEY: string;
  readonly VITE_SUPABASE_PROJECT_ID: string;
  /** Opcional: base alternativa de la API de precios (proxy o plan de pago). */
  readonly VITE_COINGECKO_BASE?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
