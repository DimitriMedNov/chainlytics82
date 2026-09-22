import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

/** Forma de una moneda tal como la devuelve /coins/markets. */
interface CoinGeckoMarket {
  market_cap_rank?: number;
  name?: string;
  symbol?: string;
  current_price?: number;
  price_change_percentage_24h?: number;
  price_change_percentage_7d_in_currency?: number;
  market_cap?: number;
  total_volume?: number;
  high_24h?: number;
  low_24h?: number;
  ath?: number;
  ath_change_percentage?: number;
}

/** Contexto de mercado que se le pasa al modelo. */
interface MarketContext {
  fetchedAt: string;
  global: {
    totalMarketCapUsd?: number;
    totalVolume24hUsd?: number;
    btcDominance?: number;
    ethDominance?: number;
    marketCapChange24hPct?: number;
    activeCryptocurrencies?: number;
  } | null;
  topCoins: Array<{
    rank?: number;
    name?: string;
    symbol?: string;
    price?: number;
    change24hPct?: number;
    change7dPct?: number;
    marketCap?: number;
    volume24h?: number;
    high24h?: number;
    low24h?: number;
    ath?: number;
    athChangePct?: number;
  }>;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // --- AUTH: validar JWT y permisos ---
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: 'No autorizado: falta token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace('Bearer ', '');
    const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: 'Sesión inválida o expirada' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const userId = claimsData.claims.sub;

    // Verifica que el usuario tenga rol 'user' o 'admin'
    const { data: roles, error: rolesError } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId);

    if (rolesError) {
      console.error('Error fetching roles:', rolesError);
      return new Response(JSON.stringify({ error: 'Error verificando permisos' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const allowed = (roles ?? []).some(
      (r: { role: string }) => r.role === 'user' || r.role === 'admin',
    );
    if (!allowed) {
      return new Response(JSON.stringify({ error: 'Permisos insuficientes para usar el analista IA' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // --- INPUT VALIDATION ---
    const { messages } = await req.json();
    if (!Array.isArray(messages) || messages.length === 0 || messages.length > 50) {
      return new Response(JSON.stringify({ error: 'Mensajes inválidos' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    for (const m of messages) {
      if (
        !m || typeof m !== 'object' ||
        (m.role !== 'user' && m.role !== 'assistant') ||
        typeof m.content !== 'string' ||
        m.content.length === 0 || m.content.length > 4000
      ) {
        return new Response(JSON.stringify({ error: 'Formato de mensaje inválido' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // El proveedor de IA es configurable: cualquier gateway compatible con la
    // API de chat de OpenAI sirve. Por defecto sigue apuntando a Lovable para
    // no romper el despliegue actual.
    const AI_API_KEY = Deno.env.get('AI_API_KEY') ?? Deno.env.get('LOVABLE_API_KEY');
    const AI_BASE_URL = Deno.env.get('AI_BASE_URL') ?? 'https://ai.gateway.lovable.dev/v1';
    const AI_MODEL = Deno.env.get('AI_MODEL') ?? 'google/gemini-3-flash-preview';

    if (!AI_API_KEY) {
      throw new Error('Falta la clave del proveedor de IA (AI_API_KEY o LOVABLE_API_KEY)');
    }

    // Fetch live market data from CoinGecko (top 15 by market cap + global stats)
    let marketContext: MarketContext | null = null;
    try {
      const [marketsRes, globalRes] = await Promise.all([
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=15&page=1&sparkline=false&price_change_percentage=24h,7d'),
        fetch('https://api.coingecko.com/api/v3/global'),
      ]);
      const markets = marketsRes.ok ? await marketsRes.json() : [];
      const global = globalRes.ok ? await globalRes.json() : null;

      marketContext = {
        fetchedAt: new Date().toISOString(),
        global: global?.data ? {
          totalMarketCapUsd: global.data.total_market_cap?.usd,
          totalVolume24hUsd: global.data.total_volume?.usd,
          btcDominance: global.data.market_cap_percentage?.btc,
          ethDominance: global.data.market_cap_percentage?.eth,
          marketCapChange24hPct: global.data.market_cap_change_percentage_24h_usd,
          activeCryptocurrencies: global.data.active_cryptocurrencies,
        } : null,
        topCoins: Array.isArray(markets) ? markets.map((c: CoinGeckoMarket) => ({
          rank: c.market_cap_rank,
          name: c.name,
          symbol: c.symbol?.toUpperCase(),
          price: c.current_price,
          change24hPct: c.price_change_percentage_24h,
          change7dPct: c.price_change_percentage_7d_in_currency,
          marketCap: c.market_cap,
          volume24h: c.total_volume,
          high24h: c.high_24h,
          low24h: c.low_24h,
          ath: c.ath,
          athChangePct: c.ath_change_percentage,
        })) : [],
      };
    } catch (err) {
      console.error('Failed to fetch CoinGecko data:', err);
    }

    const systemPrompt = `Eres un analista experto en criptomonedas llamado "CryptoSense AI". Tu trabajo es ayudar a usuarios a entender el mercado crypto, identificar tendencias, riesgos y oportunidades.

Reglas:
- Responde SIEMPRE en español, de forma clara y concisa.
- Usa markdown sencillo: encabezados ##, listas con guiones y **negritas**.
- NO uses tablas markdown: el chat no las sabe dibujar y salen como texto roto
  lleno de barras. Para comparar varias monedas, usa una lista con guiones.
- Sé objetivo: explica riesgos junto con oportunidades.
- NUNCA des consejos financieros directos ("compra X"). En su lugar, ofrece análisis y educación.
- Cuando analices datos de mercado, usa SIEMPRE los datos en tiempo real provistos abajo (precios, % cambio 24h y 7d, market cap, volumen, ATH). No inventes números.
- Si el usuario pide algo cuyo dato no esté en el contexto, dilo explícitamente.
- Si el usuario pregunta algo no relacionado a crypto/finanzas, redirígelo amablemente.

Datos de mercado en TIEMPO REAL (fuente: CoinGecko):
${marketContext ? JSON.stringify(marketContext, null, 2) : 'No se pudo obtener datos en vivo. Indícalo al usuario.'}`;

    const response = await fetch(`${AI_BASE_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${AI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: AI_MODEL,
        messages: [{ role: 'system', content: systemPrompt }, ...messages],
        stream: true,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Demasiadas solicitudes, intenta en unos momentos.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Se agotaron los créditos de IA del proveedor configurado.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      const t = await response.text();
      console.error('AI gateway error:', response.status, t);
      return new Response(JSON.stringify({ error: 'Error del servicio de IA' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, 'Content-Type': 'text/event-stream' },
    });
  } catch (e) {
    console.error('ai-crypto-analyst error:', e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : 'Unknown error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});