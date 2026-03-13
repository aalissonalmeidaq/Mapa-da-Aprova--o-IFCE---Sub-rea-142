import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { topic, type } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const prompt = `Você é um Tutor de Concurso rigoroso do IFCE.
O aluno está estudando a missão do tipo "${type}" com o tópico: "${topic}".
Crie um conteúdo markdown de alto nível (focado em aprovação), com leitura de 5 a 10 minutos.
Estruture bem com cabeçalhos claros, dicas e conceitos-chave.
Use um tom encorajador mas extremamente focado nos assuntos que mais caem em provas da banca AOCP.
Retorne apenas o Markdown do conteúdo, sem nenhuma outra fala.`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${data.error?.message || response.statusText}`);
    }
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text || "Erro na geração do conteúdo.";

    return new Response(
      JSON.stringify({ content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
