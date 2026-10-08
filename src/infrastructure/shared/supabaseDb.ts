import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/integrations/supabase/types";

/** El cliente de Supabase del proyecto. Los adaptadores lo reciben; no lo crean. */
export type SupabaseDb = SupabaseClient<Database>;
