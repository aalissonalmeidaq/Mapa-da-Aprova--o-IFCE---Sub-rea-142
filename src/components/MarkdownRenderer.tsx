/**
 * Lightweight Markdown → JSX renderer.
 * Handles: headings (h1-h4), bold, italic, inline code, code blocks,
 * unordered lists, ordered lists, blockquotes, horizontal rules,
 * tables, paragraphs.
 * Content is from our own trusted Gemini API — safe to render.
 */

interface MarkdownRendererProps {
  content: string
  className?: string
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function renderInline(text: string): string {
  return escapeHtml(text)
    // Bold + italic
    .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/__(.*?)__/g,     '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g,   '<em>$1</em>')
    .replace(/_(.*?)_/g,     '<em>$1</em>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
}

function renderLines(lines: string[]): string {
  const html: string[] = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Code block
    if (line.startsWith('```')) {
      const lang = line.slice(3).trim()
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(escapeHtml(lines[i]))
        i++
      }
      html.push(`<pre data-lang="${lang}"><code>${codeLines.join('\n')}</code></pre>`)
      i++
      continue
    }

    // Headings
    const hMatch = line.match(/^(#{1,4})\s+(.+)$/)
    if (hMatch) {
      const level = hMatch[1].length
      html.push(`<h${level}>${renderInline(hMatch[2])}</h${level}>`)
      i++
      continue
    }

    // Horizontal rule
    if (/^[-*_]{3,}$/.test(line.trim())) {
      html.push('<hr />')
      i++
      continue
    }

    // Table — detect by pipe characters on header + separator rows
    if (line.includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+[-|\s:]*$/.test(lines[i + 1])) {
      const headerCells = line.split('|').map(c => c.trim()).filter(c => c.length > 0)
      const alignRow = lines[i + 1]
      const aligns = alignRow.split('|').map(c => c.trim()).filter(c => c.length > 0).map(c => {
        if (c.startsWith(':') && c.endsWith(':')) return 'center'
        if (c.endsWith(':')) return 'right'
        return 'left'
      })

      let tableHtml = '<table><thead><tr>'
      headerCells.forEach((cell, ci) => {
        const align = aligns[ci] || 'left'
        tableHtml += `<th style="text-align:${align}">${renderInline(cell)}</th>`
      })
      tableHtml += '</tr></thead><tbody>'

      i += 2 // skip header + separator

      while (i < lines.length && lines[i].includes('|') && lines[i].trim() !== '') {
        const cells = lines[i].split('|').map(c => c.trim()).filter(c => c.length > 0)
        tableHtml += '<tr>'
        cells.forEach((cell, ci) => {
          const align = aligns[ci] || 'left'
          tableHtml += `<td style="text-align:${align}">${renderInline(cell)}</td>`
        })
        tableHtml += '</tr>'
        i++
      }

      tableHtml += '</tbody></table>'
      // Wrapper com scroll horizontal — necessário para tabelas largas no mobile
      html.push(`<div class="table-wrapper">${tableHtml}</div>`)
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteLines: string[] = []
      while (i < lines.length && lines[i].startsWith('> ')) {
        quoteLines.push(renderInline(lines[i].slice(2)))
        i++
      }
      html.push(`<blockquote><p>${quoteLines.join('<br />')}</p></blockquote>`)
      continue
    }

    // Unordered list
    if (/^[-*+]\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^[-*+]\s/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^[-*+]\s/, ''))}</li>`)
        i++
      }
      html.push(`<ul>${items.join('')}</ul>`)
      continue
    }

    // Ordered list
    if (/^\d+\.\s/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\d+\.\s/.test(lines[i])) {
        items.push(`<li>${renderInline(lines[i].replace(/^\d+\.\s/, ''))}</li>`)
        i++
      }
      html.push(`<ol>${items.join('')}</ol>`)
      continue
    }

    // Empty line — paragraph break
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph — collect consecutive non-empty, non-special lines
    const paraLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('> ') &&
      !/^[-*+]\s/.test(lines[i]) &&
      !/^\d+\.\s/.test(lines[i]) &&
      !/^[-*_]{3,}$/.test(lines[i].trim()) &&
      !(lines[i].includes('|') && i + 1 < lines.length && /^\|?\s*[-:]+[-|\s:]*$/.test(lines[i + 1]))
    ) {
      paraLines.push(renderInline(lines[i]))
      i++
    }
    if (paraLines.length) {
      html.push(`<p>${paraLines.join('<br />')}</p>`)
    }
  }

  return html.join('\n')
}

export function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const lines = content.split('\n')
  const html  = renderLines(lines)

  return (
    <div
      className={`quest-content ${className}`}
      // Content from our own trusted Gemini API
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
