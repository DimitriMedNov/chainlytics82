-- El portfolio pasa de guardar "cuánto tengo" a guardar los movimientos que
-- lo produjeron, para poder calcular coste y ganancia real.

CREATE TYPE public.transaction_kind AS ENUM ('compra', 'venta');

CREATE TABLE public.portfolio_transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  coin_id TEXT NOT NULL CHECK (char_length(coin_id) BETWEEN 1 AND 100),
  symbol TEXT NOT NULL CHECK (char_length(symbol) BETWEEN 1 AND 20),
  kind public.transaction_kind NOT NULL,
  amount NUMERIC(38, 18) NOT NULL CHECK (amount > 0),
  -- Precio pagado o cobrado por unidad, en dólares. NULL significa "no lo
  -- recuerdo": preferimos no saber el coste a inventárnoslo.
  unit_price NUMERIC(38, 18) CHECK (unit_price IS NULL OR unit_price >= 0),
  happened_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.portfolio_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Cada usuario ve sus movimientos"
  ON public.portfolio_transactions FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Cada usuario registra sus movimientos"
  ON public.portfolio_transactions FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cada usuario edita sus movimientos"
  ON public.portfolio_transactions FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Cada usuario borra sus movimientos"
  ON public.portfolio_transactions FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

CREATE INDEX portfolio_transactions_user_coin_idx
  ON public.portfolio_transactions (user_id, coin_id, happened_at);

-- Las posiciones que ya existían se convierten en una compra sin precio:
-- la cantidad se conserva, el coste queda marcado como desconocido.
INSERT INTO public.portfolio_transactions (user_id, coin_id, symbol, kind, amount, unit_price, happened_at)
SELECT user_id, coin_id, symbol, 'compra', amount, NULL, created_at
FROM public.portfolio_holdings;

DROP TABLE public.portfolio_holdings;
