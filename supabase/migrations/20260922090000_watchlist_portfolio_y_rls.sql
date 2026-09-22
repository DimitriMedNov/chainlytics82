-- Watchlist y portfolio por usuario, y endurecimiento de la política de perfiles.

-- 1. La watchlist guarda QUÉ monedas sigue el usuario, nunca precios:
--    el precio se lee siempre de la API en el momento de mostrarlo.
CREATE TABLE public.watchlist_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_id TEXT NOT NULL CHECK (char_length(coin_id) BETWEEN 1 AND 100),
  symbol TEXT NOT NULL CHECK (char_length(symbol) BETWEEN 1 AND 20),
  is_favorite BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, coin_id)
);

ALTER TABLE public.watchlist_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada usuario ve su watchlist"
  ON public.watchlist_items FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Cada usuario añade a su watchlist"
  ON public.watchlist_items FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cada usuario edita su watchlist"
  ON public.watchlist_items FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cada usuario borra de su watchlist"
  ON public.watchlist_items FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX watchlist_items_user_id_idx ON public.watchlist_items (user_id);

-- 2. Posiciones del portfolio. Igual que arriba: cantidad sí, precio no.
CREATE TABLE public.portfolio_holdings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_id TEXT NOT NULL CHECK (char_length(coin_id) BETWEEN 1 AND 100),
  symbol TEXT NOT NULL CHECK (char_length(symbol) BETWEEN 1 AND 20),
  amount NUMERIC(38, 18) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (user_id, coin_id)
);

ALTER TABLE public.portfolio_holdings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada usuario ve su portfolio"
  ON public.portfolio_holdings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Cada usuario añade a su portfolio"
  ON public.portfolio_holdings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cada usuario edita su portfolio"
  ON public.portfolio_holdings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cada usuario borra de su portfolio"
  ON public.portfolio_holdings FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX portfolio_holdings_user_id_idx ON public.portfolio_holdings (user_id);

CREATE TRIGGER update_portfolio_holdings_updated_at
  BEFORE UPDATE ON public.portfolio_holdings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- 3. Antes, cualquier usuario autenticado podía leer TODOS los perfiles.
--    Hoy solo hay display_name, pero cualquier campo privado que se añada
--    mañana quedaría expuesto sin tocar nada. Cada quien ve el suyo.
DROP POLICY IF EXISTS "Profiles are viewable by authenticated users" ON public.profiles;

CREATE POLICY "Cada usuario ve su propio perfil"
  ON public.profiles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
