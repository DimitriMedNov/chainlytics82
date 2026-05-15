import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { messages, marketContext } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) throw new Error('LOVABLE_API_KEY is not configured');

    const systemPrompt = `Eres un analista experto en criptomonedas llamado "CryptoSense AI". Tu trabajo es ayudar a usuarios a entender el mercado crypto, identificar tendencias, riesgos y oportunidades.

Reglas:
- Responde SIEMPRE en español, de forma clara y concisa.
- Usa formato markdown (encabezados ##, listas, **negritas**, tablas si aplica).
- Sé objetivo: explica riesgos junto con oportunidades.
- NUNCA des consejos financieros directos ("compra X"). En su lugar, ofrece análisis y educación.
- Cuando analices datos de mercado, menciona métricas concretas (precio, % cambio, market cap, volumen).
- Si el usuario pregunta algo no relacionado a crypto/finanzas, redirígelo amablemente.

Contexto actual del mercado del usuario:
${marketContext ? JSON.stringify(marketContext, null, 2) : 'Sin contexto específico, usa conocimiento general.'}`;

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