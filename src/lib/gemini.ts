const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const MODELS = [
  'gemini-2.5-flash',
  'gemini-2.5-flash-lite',
]

function getGeminiUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
}

function getGeminiStreamUrl(model: string): string {
  return `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`
}

async function callGemini(prompt: string, responseSchema?: object): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY não configurada nas variáveis de ambiente')
  }

  const body: Record<string, unknown> = {
    contents: [{ parts: [{ text: prompt }] }],
  }

  if (responseSchema) {
    body.generationConfig = {
      response_mime_type: 'application/json',
      response_schema: responseSchema,
    }
  }

  let lastError: Error | null = null

  for (const model of MODELS) {
    try {
      const response = await fetch(getGeminiUrl(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const data = await response.json()

      if (!response.ok) {
        const msg = data.error?.message || response.statusText
        if (msg.includes('quota') || msg.includes('rate') || msg.includes('429') || response.status === 429) {
          console.warn(`Modelo ${model} com quota excedida, tentando próximo...`)
          lastError = new Error(msg)
          continue
        }
        throw new Error(`Gemini API Error: ${msg}`)
      }

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (!text) throw new Error('Resposta vazia da IA.')

      return text
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (lastError.message?.includes('quota') || lastError.message?.includes('rate')) {
        continue
      }
      throw lastError
    }
  }

  throw lastError || new Error('Todos os modelos falharam.')
}

/** Streaming version — calls onChunk with text as it arrives */
async function callGeminiStream(
  prompt: string,
  onChunk: (accumulated: string) => void,
): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error('VITE_GEMINI_API_KEY não configurada nas variáveis de ambiente')
  }

  const body = {
    contents: [{ parts: [{ text: prompt }] }],
  }

  let lastError: Error | null = null

  for (const model of MODELS) {
    try {
      const response = await fetch(getGeminiStreamUrl(model), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      if (!response.ok) {
        const errorText = await response.text()
        let msg = response.statusText
        try {
          const errJson = JSON.parse(errorText)
          msg = errJson.error?.message || msg
        } catch { /* ignore parse error */ }

        if (msg.includes('quota') || msg.includes('rate') || response.status === 429) {
          console.warn(`Modelo ${model} com quota excedida, tentando próximo...`)
          lastError = new Error(msg)
          continue
        }
        throw new Error(`Gemini API Error: ${msg}`)
      }

      const reader = response.body?.getReader()
      if (!reader) throw new Error('Stream não disponível')

      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })

        // Parse SSE events from buffer
        const lines = buffer.split('\n')
        buffer = lines.pop() || '' // keep incomplete line in buffer

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const jsonStr = line.slice(6).trim()
            if (!jsonStr || jsonStr === '[DONE]') continue
            try {
              const event = JSON.parse(jsonStr)
              const chunk = event.candidates?.[0]?.content?.parts?.[0]?.text
              if (chunk) {
                accumulated += chunk
                onChunk(accumulated)
              }
            } catch { /* skip invalid JSON */ }
          }
        }
      }

      if (!accumulated) throw new Error('Resposta vazia da IA.')
      return accumulated

    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (lastError.message?.includes('quota') || lastError.message?.includes('rate')) {
        continue
      }
      throw lastError
    }
  }

  throw lastError || new Error('Todos os modelos falharam.')
}

export async function generateQuestContent(
  topic: string,
  type: string,
  onChunk: (accumulated: string) => void = () => {},
): Promise<string> {
  const isReview = type === 'Principal' && topic.toLowerCase().includes('revisão')
  const isPortugues = type === 'Secundaria_PT'
  const isLegislacao = type === 'Secundaria_Legis'
  const isDidatica = type === 'Secundaria_Didatica'

  let specificInstructions = ''

  if (isPortugues) {
    specificInstructions = `
INSTRUÇÕES ESPECÍFICAS PARA LÍNGUA PORTUGUESA:
- Apresente as regras gramaticais com exemplos práticos de frases
- Inclua uma seção "⚠️ Pegadinhas Clássicas da AOCP" com pelo menos 3 exemplos de como a banca cobra esse assunto
- Use tabelas comparativas quando possível (ex: uso correto vs incorreto)
- Inclua exercícios de fixação com gabarito comentado ao final`
  } else if (isLegislacao) {
    specificInstructions = `
INSTRUÇÕES ESPECÍFICAS PARA LEGISLAÇÃO:
- Cite os artigos e incisos mais cobrados pela banca AOCP
- Use quadros-resumo com as informações-chave de cada artigo
- Destaque prazos, exceções e regras especiais em negrito
- Inclua uma seção "🔍 Como a AOCP cobra isso" com exemplos de enunciados típicos
- Faça comparações entre conceitos similares que a banca gosta de confundir`
  } else if (isDidatica) {
    specificInstructions = `
INSTRUÇÕES ESPECÍFICAS PARA DOCÊNCIA E DIDÁTICA:
- Apresente os autores e teóricos mais cobrados com suas ideias centrais
- Use tabelas comparativas entre diferentes abordagens pedagógicas
- Relacione teoria com a prática no contexto do IFCE e da EPT
- Inclua uma seção "📚 Autores e Obras-Chave" com lista organizada
- Destaque termos técnicos que a banca costuma usar nos enunciados`
  } else if (isReview) {
    specificInstructions = `
INSTRUÇÕES ESPECÍFICAS PARA REVISÃO:
- Crie um resumo ultra-condensado dos pontos mais importantes
- Use listas de verificação (checklists) para cada subtema
- Inclua um "Mapa Mental em Texto" com as conexões entre os conceitos
- Foque nos 20% do conteúdo que respondem 80% das questões da AOCP`
  } else {
    specificInstructions = `
INSTRUÇÕES ESPECÍFICAS PARA CONHECIMENTOS ESPECÍFICOS:
- Explique cada conceito de forma aprofundada com definições formais e intuitivas
- Inclua pseudocódigo ou exemplos de código quando aplicável
- Use diagramas em texto (ASCII art simples) para ilustrar estruturas
- Compare abordagens diferentes (ex: vantagens vs desvantagens em tabela)
- Inclua complexidade de tempo e espaço quando relevante (Big-O)`
  }

  const prompt = `Você é um **Tutor de Elite para Concursos do IFCE**, especialista na banca **AOCP**.

## MISSÃO
Gere um material de estudo COMPLETO e DETALHADO sobre o tópico abaixo. O material deve ser tão bom que substitua um livro-texto para esse assunto específico.

**Tópico:** "${topic}"
**Tipo de Missão:** ${type}

## ESTRUTURA OBRIGATÓRIA DO MATERIAL

O conteúdo DEVE seguir esta estrutura em Markdown:

### 1. INTRODUÇÃO E CONTEXTO
- Breve parágrafo explicando a importância do tema no edital do IFCE
- Por que esse assunto cai na prova e com que frequência

### 2. FUNDAMENTAÇÃO TEÓRICA
- Explicação detalhada e aprofundada de cada conceito
- Use **negrito** para termos-chave e *itálico* para observações
- Subdivida em seções claras com cabeçalhos hierárquicos (##, ###)
- Mínimo de 3 parágrafos substanciais por conceito principal

### 3. EXEMPLOS PRÁTICOS
- Pelo menos 2 exemplos detalhados com explicação passo a passo
- Use blocos de código quando aplicável
- Inclua contraexemplos (o que NÃO fazer)

### 4. TABELAS E COMPARATIVOS
- Pelo menos 1 tabela comparativa relevante ao tema
- Use formato Markdown: | Coluna 1 | Coluna 2 |

### 5. ARMADILHAS E PEGADINHAS DA BANCA AOCP
- Liste pelo menos 3 pegadinhas típicas com explicação
- Use blockquotes (>) para destacar dicas importantes
- Formato: "> ⚠️ **ATENÇÃO:** ..."

### 6. RESUMO ESTRATÉGICO
- Lista com os pontos mais importantes para memorizar
- Use bullet points concisos e diretos
- Destaque palavras-chave em negrito

${specificInstructions}

## REGRAS
- Use Markdown rico: cabeçalhos (##, ###), **negrito**, *itálico*, \`código\`, tabelas, listas, blockquotes
- Use emojis para scanning visual: 📌 pontos-chave, ⚠️ atenção, 💡 dicas, ✅ correto, ❌ incorreto
- O conteúdo deve ter entre 800 e 1200 palavras (conciso mas substancial)
- Linguagem clara e acadêmica, sem frases genéricas

## IMPORTANTE
- Retorne APENAS o conteúdo em Markdown, sem introduções como "Aqui está o material" ou finalizações como "Espero que ajude"
- Comece diretamente com o primeiro cabeçalho do conteúdo`

  return callGeminiStream(prompt, onChunk)
}

/** Non-streaming version for backward compatibility */
export async function generateQuestContentBlocking(topic: string, type: string): Promise<string> {
  return generateQuestContent(topic, type, () => {})
}

export interface QuizQuestion {
  id: string
  text: string
  options: string[]
  correctIndex: number
  explanation: string
}

export async function generateQuiz(topic: string, content: string): Promise<QuizQuestion[]> {
  const prompt = `Você é a Banca AOCP formulando questões difíceis de concurso.
Com base no tópico "${topic}" e no seguinte conteúdo estudado, crie 5 questões de múltipla escolha (A, B, C, D, E).
O aluno precisa de pelo menos 80% (4/5) para passar. Foque em detalhes e "pegadinhas" típicas da banca.

Conteúdo base:
${content}
`

  const responseSchema = {
    type: 'ARRAY',
    items: {
      type: 'OBJECT',
      properties: {
        id: { type: 'STRING' },
        text: { type: 'STRING' },
        options: { type: 'ARRAY', items: { type: 'STRING' }, description: 'Exatamente 5 opções claras' },
        correctIndex: { type: 'INTEGER', description: 'O índice (0 a 4) da alternativa correta' },
        explanation: { type: 'STRING', description: 'Gabarito comentado detalhando o porquê da resposta' },
      },
      required: ['id', 'text', 'options', 'correctIndex', 'explanation'],
    },
  }

  const jsonStr = await callGemini(prompt, responseSchema)
  return JSON.parse(jsonStr)
}
