import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    // Fetch live market data from CoinGecko (top 15 by market cap + global stats)
    let marketContext: any = null;
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
        topCoins: Array.isArray(markets) ? markets.map((c: any) => ({
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
- Usa formato markdown (encabezados ##, listas, **negritas**, tablas si aplica).
- Sé objetivo: explica riesgos junto con oportunidades.
- NUNCA des consejos financieros directos ("compra X"). En su lugar, ofrece análisis y educación.
- Cuando analices datos de mercado, usa SIEMPRE los datos en tiempo real provistos abajo (precios, % cambio 24h y 7d, market cap, volumen, ATH). No inventes números.
- Si el usuario pide algo cuyo dato no esté en el contexto, dilo explícitamente.
- Si el usuario pregunta algo no relacionado a crypto/finanzas, redirígelo amablemente.

Datos de mercado en TIEMPO REAL (fuente: CoinGecko):
${marketContext ? JSON.stringify(marketContext, null, 2) : 'No se pudo obtener datos en vivo. Indícalo al usuario.'}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-3-flash-preview',
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
        return new Response(JSON.stringify({ error: 'Se agotaron los créditos de IA. Agrega fondos en Settings → Workspace → Usage.' }), {
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