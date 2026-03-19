const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim()
const DEEPSEEK_API_KEY = import.meta.env.VITE_DEEPSEEK_API_KEY?.trim()
import { getPromptForQuest } from '../data/prompts'

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash-001']

/** Unified call to chosen AI (DeepSeek or Gemini) */
async function callAI(prompt: string, jsonMode: boolean = false): Promise<string> {
  const preferred = (localStorage.getItem('preferred_ai') as 'gemini' | 'deepseek') || 'deepseek'
  
  if (preferred === 'deepseek') {
    if (DEEPSEEK_API_KEY) {
      try { return await callDeepSeek(prompt, jsonMode) } catch { /* fallback */ }
    }
    if (GEMINI_API_KEY) return await callGemini(prompt, jsonMode)
  } else {
    if (GEMINI_API_KEY) {
      try { return await callGemini(prompt, jsonMode) } catch { /* fallback */ }
    }
    if (DEEPSEEK_API_KEY) return await callDeepSeek(prompt, jsonMode)
  }

  throw new Error(`Nenhuma IA configurada ou disponível para esta operação.`)
}

async function callDeepSeek(prompt: string, jsonMode: boolean = false): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 60_000)

  try {
    const response = await fetch('/api/deepseek/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        response_format: jsonMode ? { type: 'json_object' } : undefined,
        stream: false
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      let errorMsg = response.statusText
      try {
        const errorJson = await response.json()
        errorMsg = errorJson.error?.message || errorJson.message || response.statusText
      } catch {
        errorMsg = await response.text() || response.statusText
      }
      throw new Error(`DeepSeek (${response.status}): ${errorMsg.slice(0, 120)}`)
    }

    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('DeepSeek: tempo limite de 60s excedido')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

async function callGemini(prompt: string, jsonMode: boolean = false): Promise<string> {
  const body: any = {
    contents: [{ parts: [{ text: prompt }] }],
    generationConfig: jsonMode ? { response_mime_type: 'application/json' } : undefined
  }

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 60_000)
    try {
      const url = `/api/gemini/v1beta/models/${model}:generateContent?key=${GEMINI_API_KEY}`
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.error?.message || response.statusText)

      const text = data.candidates?.[0]?.content?.parts?.[0]?.text
      if (text) return text
    } catch (err: any) {
      if (err.name === 'AbortError') continue // tenta próximo modelo
      console.warn(`Gemini (${model}) falhou:`, err.message)
      continue
    } finally {
      clearTimeout(timeout)
    }
  }
  throw new Error('Gemini: todos os modelos falharam')
}

/** Streaming implementation — with auto-fallback racing */
async function callAIStream(
  prompt: string,
  onChunk: (accumulated: string) => void,
): Promise<string> {
  const preferred = (localStorage.getItem('preferred_ai') as 'gemini' | 'deepseek') || 'deepseek'

  // Se preferencial é DeepSeek e temos a chave, tentamos DeepSeek primeiro
  if (preferred === 'deepseek') {
    if (DEEPSEEK_API_KEY) {
      try {
        return await callDeepSeekStream(prompt, onChunk)
      } catch (err) {
        console.warn('DeepSeek failed, falling back to Gemini:', err)
        if (GEMINI_API_KEY) return await callGeminiStream(prompt, onChunk)
        throw err // Re-throw if Gemini is also not available or fails
      }
    } else if (GEMINI_API_KEY) { // DeepSeek preferred but no key, try Gemini
      return await callGeminiStream(prompt, onChunk)
    }
  }
  // Se preferencial é Gemini
  else if (preferred === 'gemini') {
    if (GEMINI_API_KEY) {
      try {
        return await callGeminiStream(prompt, onChunk)
      } catch (err) {
        console.warn('Gemini failed, falling back to DeepSeek:', err)
        if (DEEPSEEK_API_KEY) return await callDeepSeekStream(prompt, onChunk)
        throw err // Re-throw if DeepSeek is also not available or fails
      }
    } else if (DEEPSEEK_API_KEY) { // Gemini preferred but no key, try DeepSeek
      return await callDeepSeekStream(prompt, onChunk)
    }
  }

  // Se nenhuma preferência foi definida ou a preferida não tem chave,
  // e ainda não retornamos, tentamos a que tiver chave.
  if (DEEPSEEK_API_KEY) {
    return await callDeepSeekStream(prompt, onChunk)
  }
  if (GEMINI_API_KEY) {
    return await callGeminiStream(prompt, onChunk)
  }

  throw new Error('Nenhuma IA configurada ou disponível. Verifique suas chaves de API no arquivo .env.local')
}

async function callDeepSeekStream(prompt: string, onChunk: (acc: string) => void): Promise<string> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 120_000) // 2min para geração longa

  try {
    const response = await fetch('/api/deepseek/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DEEPSEEK_API_KEY}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: prompt }],
        stream: true,
        max_tokens: 4096
      }),
      signal: controller.signal,
    })

    if (!response.ok) {
      const errorBody = await response.text()
      throw new Error(`DeepSeek (${response.status}): ${errorBody.slice(0, 120)}`)
    }

    const reader = response.body?.getReader()
    if (!reader) throw new Error('Stream reader indisponível')

    const decoder = new TextDecoder()
    let accumulated = ''
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const dataStr = line.slice(6).trim()
        if (dataStr === '[DONE]') continue
        try {
          const data = JSON.parse(dataStr)
          const content = data.choices?.[0]?.delta?.content || ''
          if (content) {
            accumulated += content
            onChunk(accumulated)
          }
        } catch { /* skip JSON inválido */ }
      }
    }

    if (accumulated.length === 0) throw new Error('DeepSeek retornou conteúdo vazio')
    return accumulated
  } catch (err: any) {
    if (err.name === 'AbortError') throw new Error('DeepSeek: tempo limite de 2min excedido')
    throw err
  } finally {
    clearTimeout(timeout)
  }
}

async function callGeminiStream(prompt: string, onChunk: (acc: string) => void): Promise<string> {
  const body = { contents: [{ parts: [{ text: prompt }] }] }

  for (const model of GEMINI_MODELS) {
    const controller = new AbortController()
    const timeout = setTimeout(() => controller.abort(), 120_000)

    try {
      const url = `/api/gemini/v1beta/models/${model}:streamGenerateContent?alt=sse&key=${GEMINI_API_KEY}`

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errText = await response.text().catch(() => response.statusText)
        console.warn(`Gemini stream (${model}) ${response.status}:`, errText.slice(0, 100))
        continue
      }

      const reader = response.body?.getReader()
      if (!reader) continue

      const decoder = new TextDecoder()
      let accumulated = ''
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          try {
            const event = JSON.parse(line.slice(6))
            const text = event.candidates?.[0]?.content?.parts?.[0]?.text
            if (text) {
              accumulated += text
              onChunk(accumulated)
            }
          } catch { /* skip JSON inválido */ }
        }
      }

      if (accumulated.length > 0) return accumulated
      console.warn(`Gemini stream (${model}): acumulado vazio, tentando próximo modelo`)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        console.warn(`Gemini stream (${model}): timeout`)
        continue
      }
      console.error(`Gemini stream (${model}):`, err.message)
      continue
    } finally {
      clearTimeout(timeout)
    }
  }
  throw new Error('Gemini: não foi possível gerar o conteúdo. Verifique a chave de API ou troque o motor para DeepSeek.')
}

export async function generateQuestContent(
  questId: string,
  topic: string,
  type: string,
  onChunk: (accumulated: string) => void = () => {},
): Promise<string> {
  const prdPrompt = getPromptForQuest(questId)
  const instructions = getSpecificInstructions(type)
  
  // Base prompt that defines the persona and quality standards
  let systemPrompt = `Você é um **Tutor de Elite para Concursos do IFCE**, especialista na banca **AOCP**.
  Material de Estudo Profissional para o tópico: "${topic}" (${type})
  `

  let missionPrompt = ''
  
  if (prdPrompt) {
    // If we have a PRD prompt, use it as the core mission but wrap it with our persona/formatting
    missionPrompt = `## MISSÃO ESPECÍFICA (PRD)
    ${prdPrompt}
    
    ## REQUISITOS DE FORMATAÇÃO
    - Use Markdown rico (negrito, tabelas, blocos de código).
    - Mínimo 800 palavras de conteúdo técnico denso.
    - Siga a estrutura: 1. Aprofundamento Teórico, 2. Tabelas/Resumos, 3. Pegadinhas AOCP, 4. Exercícios com Gabarito.`
  } else {
    // Fallback to default structure
    missionPrompt = `## MISSÃO
    Gere um material de estudo COMPLETO sobre: "${topic}"
    
    ## ESTRUTURA OBRIGATÓRIA
    1. INTRODUÇÃO (Importância no edital IFCE)
    2. FUNDAMENTAÇÃO TEÓRICA (Aprofundado, use negrito para conceitos chave)
    3. EXEMPLOS PRÁTICOS E APLICAÇÕES
    4. TABELAS COMPARATIVAS (Essencial para memorização)
    5. ARMADILHAS DA BANCA AOCP (Foco total no estilo da banca)
    6. RESUMO ESTRATÉGICO
    7. EXERCÍCIOS DE FIXAÇÃO (5 questões com gabarito comentado)
    
    ${instructions}
    
    ## REQUISITOS
    Mínimo 800 palavras. Markdown rico. Comece direto no título (H2).`
  }

  const finalPrompt = `${systemPrompt}\n\n${missionPrompt}`
  return callAIStream(finalPrompt, onChunk)
}

function getSpecificInstructions(type: string) {
  if (type === 'Secundaria_PT') return 'Foque em gramática aplicada e pegadinhas da AOCP sobre concordância e regência.'
  if (type === 'Secundaria_Legis') return 'Cite artigos específicos e prazos legislativos críticos.'
  if (type === 'Secundaria_Didatica') return 'Aborde teóricos como Libâneo e Saviani aplicados ao IFCE.'
  return 'Aprofunde em conceitos técnicos, implementações e arquitetura.'
}

export async function generateQuiz(topic: string, content: string): Promise<any[]> {
  const prompt = `Gere 5 questões de múltipla escolha (A-E) sobre "${topic}" baseadas neste conteúdo: ${content}.
  Responda APENAS em JSON no formato:
  [{"id": "...", "text": "...", "options": ["...", "...", "...", "...", "..."], "correctIndex": 0, "explanation": "..."}]`

  const json = await callAI(prompt, true)
  const cleanJson = json.replace(/```json/g, '').replace(/```/g, '').trim()
  return JSON.parse(cleanJson)
}
