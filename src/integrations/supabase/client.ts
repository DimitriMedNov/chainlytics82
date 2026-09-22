import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL;
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

/**
 * Si faltan las variables, `createClient` lanza al importar y la app entera se
 * queda en blanco. Preferimos arrancar en modo local y esconder lo que
 * necesita cuenta, así que comprobamos antes y usamos un destino de relleno
 * que nunca se llega a usar.
 */
export const isSupabaseConfigured =
  typeof SUPABASE_URL === "string" &&
  SUPABASE_URL.startsWith("http") &&
  typeof SUPABASE_PUBLISHABLE_KEY === "string" &&
  SUPABASE_PUBLISHABLE_KEY.length > 0;

export const supabase = createClient<Database>(
  isSupabaseConfigured ? SUPABASE_URL : "https://sin-configurar.invalid",
  isSupabaseConfigured ? SUPABASE_PUBLISHABLE_KEY : "sin-configurar",
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
