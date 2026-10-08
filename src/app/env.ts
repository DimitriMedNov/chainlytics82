/**
 * Único sitio del front nuevo donde se leen las variables de entorno. Todo lo
 * demás recibe estos valores ya leídos.
 */
export interface AppEnv {
  /**
   * Base de la API de precios. Se puede apuntar a un proxy propio o al dominio
   * de pago (`https://pro-api.coingecko.com/api/v3`) con VITE_COINGECKO_BASE.
   */
  coingeckoBase: string;
  supabaseUrl: string;
  supabaseKey: string;
}

export function readEnv(): AppEnv {
  return {
    coingeckoBase: import.meta.env.VITE_COINGECKO_BASE ?? "https://api.coingecko.com/api/v3",
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
    supabaseKey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
  };
}
