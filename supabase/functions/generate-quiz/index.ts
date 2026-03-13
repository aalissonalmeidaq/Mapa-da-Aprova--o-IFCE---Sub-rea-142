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
    const { topic, content } = await req.json();
    const apiKey = Deno.env.get('GEMINI_API_KEY');
    if (!apiKey) throw new Error('GEMINI_API_KEY not set');

    const prompt = `Você é a Banca AOCP formulando questões difíceis de concurso.
Com base no tópico "${topic}" e no seguinte conteúdo estudado, crie 5 questões de múltipla escolha (A, B, C, D, E).
O aluno precisa de pelo menos 80% (4/5) para passar. Foque em detalhes e "pegadinhas" típicas da banca.

Conteúdo base:
${content}
`;

    const responseSchema = {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          id: { type: "STRING" },
          text: { type: "STRING" },
          options: { type: "ARRAY", items: { type: "STRING" }, description: "Exatamente 5 opções claras" },
          correctIndex: { type: "INTEGER", description: "O índice (0 a 4) da alternativa correta" },
          explanation: { type: "STRING", description: "Gabarito comentado detalhando o porquê da resposta" }
        },
        required: ["id", "text", "options", "correctIndex", "explanation"]
      }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          response_schema: responseSchema
        }
      })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(`Gemini API Error: ${data.error?.message || response.statusText}`);
    }
    const jsonStr = data.candidates?.[0]?.content?.parts?.[0]?.text || "[]";
    const questions = JSON.parse(jsonStr);

    return new Response(
      JSON.stringify({ questions }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
