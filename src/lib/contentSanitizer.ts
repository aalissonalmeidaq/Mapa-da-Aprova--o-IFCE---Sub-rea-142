/**
 * contentSanitizer.ts
 *
 * Normaliza o conteúdo Markdown gerado pela IA antes de renderizar.
 * Corrige artefatos comuns do Gemini que quebram o MarkdownRenderer
 * ou prejudicam a leitura.
 *
 * Aplicado após o streaming completo e antes de salvar no cache,
 * garantindo que tanto visualizações novas quanto do cache sejam limpas.
 */

/**
 * Detecta e remove/substitui tabelas Markdown malformadas.
 * Uma tabela é considerada malformada se tiver > 7 colunas e mais de
 * 55% dos cabeçalhos tiverem ≤ 2 caracteres úteis — indica que o LLM
 * tentou formatar algo que não é uma tabela real (pseudo-código, comparações inline).
 */
function fixMalformedTables(text: string): string {
  const lines = text.split('\n')
  const result: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]
    const nextLine = lines[i + 1] ?? ''

    // Detecta início de tabela Markdown
    const isTableHeader =
      line.includes('|') &&
      /^\|?\s*[-:]+[-|\s:]*$/.test(nextLine)

    if (isTableHeader) {
      const cells = line.split('|').map(c => c.trim()).filter(c => c.length > 0)
      const shortCells = cells.filter(
        c => c.replace(/[\*_`\s]/g, '').length <= 2,
      )
      const isMalformed =
        cells.length > 7 && shortCells.length / cells.length > 0.55

      if (isMalformed) {
        // Pula header + separador + todas as linhas de dados
        i += 2 // header + separator
        while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
          i++
        }
        // Substitui por um aviso visual discreto em vez de quebrar o layout
        result.push('> ⚠️ *Tabela comparativa com formatação complexa — consulte o material de referência para visualização completa.*')
        continue
      }
    }

    result.push(line)
    i++
  }

  return result.join('\n')
}

/**
 * Limpa e normaliza Markdown gerado por LLM.
 * @param raw     Texto cru vindo da API Gemini
 * @param topic   Tópico da missão (usado para remover título duplicado)
 */
export function sanitizeMarkdown(raw: string, topic: string): string {
  if (!raw?.trim()) return raw

  let text = raw

  // ── 1. Normalizar quebras de linha ──────────────────────────────
  text = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // ── 2. Remover BOM e caracteres invisíveis ──────────────────────
  text = text.replace(/^\uFEFF/, '').replace(/[\u200B\u200C\u200D\uFEFF]/g, '')

  // ── 3. Remover preâmbulo antes do primeiro heading ──────────────
  // O Gemini às vezes ignora "Retorne APENAS o conteúdo" e adiciona
  // frases como "Aqui está o material..." antes do primeiro #.
  const firstHeadingIdx = text.search(/^#{1,4}\s/m)
  if (firstHeadingIdx > 0) {
    const before = text.slice(0, firstHeadingIdx).trim()
    // Só remove se for uma frase curta de introdução (< 200 chars)
    if (before.length < 200) {
      text = text.slice(firstHeadingIdx)
    }
  }

  // ── 4. Remover comentários finais ───────────────────────────────
  // Remove linhas de fechamento geradas pelo modelo após o conteúdo.
  text = text.replace(
    /\n+(espero que (isso |este material |o material )?(ajude|seja útil|facilite)[^]*$)/im,
    '',
  )
  text = text.replace(/\n+(bons estudos!?|sucesso!?|boa sorte!?)[\s]*$/im, '')

  // ── 5. Remover título duplicado (igual ao tópico da missão) ─────
  // Evita mostrar o mesmo título duas vezes (QuestPlayer já exibe o tópico).
  const topicNorm = topic.toLowerCase().trim()
  text = text.replace(/^(#{1,2})\s+(.+)\n?/, (match, _hashes, title) => {
    const titleNorm = title.toLowerCase().trim()
    // Remove se o título do heading é igual ou contido no tópico
    const isDuplicate =
      titleNorm === topicNorm ||
      (topicNorm.length > 10 && titleNorm.includes(topicNorm.slice(0, 20))) ||
      (titleNorm.length > 10 && topicNorm.includes(titleNorm.slice(0, 20)))
    return isDuplicate ? '' : match
  })

  // ── 6. Normalizar nível de headings ────────────────────────────
  // Se o conteúdo usa # (h1) como heading principal, sobe tudo um nível
  // para evitar conflito com o h1 do QuestPlayer header.
  const hasH1 = /^#\s/m.test(text)
  const hasH2 = /^##\s/m.test(text)
  if (hasH1 && !hasH2) {
    // Todo o conteúdo usa H1 como raiz — converter: #→##, ##→###, ###→####
    text = text.replace(/^(#{1,3})(\s)/gm, (_, hashes, space) =>
      '#'.repeat(Math.min(hashes.length + 1, 4)) + space,
    )
  } else if (hasH1 && hasH2) {
    // Mistura H1 e H2 — converter apenas H1 isolados para H2
    text = text.replace(/^#(\s)/gm, '##$1')
  }

  // ── 7. Corrigir bold/italic com espaços internos ────────────────
  // ** texto ** → **texto**  (regex do renderer não aceita espaços)
  text = text.replace(/\*\*\s+([^*]+?)\s+\*\*/g, '**$1**')
  text = text.replace(/\*\*\s+([^*]+?)\*\*/g,   '**$1**')
  text = text.replace(/\*\*([^*]+?)\s+\*\*/g,   '**$1**')
  // * texto * → *texto*
  text = text.replace(/(?<!\*)\*\s+([^*]+?)\s+\*(?!\*)/g, '*$1*')

  // ── 8. Corrigir blockquotes sem espaço após > ───────────────────
  // ">texto" → "> texto"
  text = text.replace(/^>([^\s>])/gm, '> $1')

  // ── 9. Normalizar marcadores de lista ───────────────────────────
  // Converte * e + para - em listas não-ordenadas (consistência)
  text = text.replace(/^(\s*)[*+](\s+)/gm, '$1-$2')

  // ── 10. Garantir linha em branco antes de headings ──────────────
  text = text.replace(/([^\n])\n(#{1,4}\s)/g, '$1\n\n$2')

  // ── 11. Garantir linha em branco antes/depois de blocos de código
  text = text.replace(/([^\n])\n(```)/g, '$1\n\n$2')
  text = text.replace(/(```)\n([^\n`])/g, '$1\n\n$2')

  // ── 12. Garantir linha em branco antes de blockquotes ──────────
  text = text.replace(/([^\n>])\n(>\s)/g, '$1\n\n$2')

  // ── 13. Remover tabelas malformadas com muitas colunas de char único ──
  // O Gemini às vezes gera tabelas comparativas com 10+ colunas onde
  // cada header tem 1-2 caracteres (ex: "A | B | C | D | ...").
  // Essas tabelas são ilegíveis — são convertidas em blockquote de aviso.
  text = fixMalformedTables(text)

  // ── 14. Colapsar 3+ linhas em branco consecutivas → 2 ──────────
  text = text.replace(/\n{3,}/g, '\n\n')

  // ── 14. Remover espaços no final de cada linha ──────────────────
  text = text
    .split('\n')
    .map(line => line.trimEnd())
    .join('\n')

  // ── 15. Trim global ─────────────────────────────────────────────
  return text.trim()
}
