import type { ElementNode, MarkdownDocument, Node } from 'comark'
import { textContent, visit } from 'comark/utils'

export type ReferenceRow = { summary: string[]; detail: { label: string; html: string }[] }

const byTag = (node: ElementNode | undefined, ...tags: string[]): ElementNode[] =>
  node
    ? node
        .slice(2)
        .filter(
          (n): n is ElementNode =>
            Array.isArray(n) && typeof n[0] === 'string' && tags.includes(n[0])
        )
    : []

const first = (node: ElementNode | undefined, tag: string) => byTag(node, tag)[0]

const children = (node: ElementNode | undefined): Node[] => (node?.slice(2) ?? []) as Node[]

const INLINE_TAGS = new Set(['code', 'em', 'strong', 'a', 'del', 'br'])

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function renderInline(nodes: Node[]): string {
  let html = ''
  for (const node of nodes) {
    if (typeof node === 'string') {
      html += escapeHtml(node)
      continue
    }
    if (!Array.isArray(node) || typeof node[0] !== 'string') continue
    const [tag, attrs] = node
    const inner = renderInline(children(node))
    if (tag === 'br') {
      html += '<br>'
    } else if (tag === 'a' && typeof attrs.href === 'string') {
      html += `<a href="${escapeHtml(attrs.href)}">${inner}</a>`
    } else if (INLINE_TAGS.has(tag)) {
      html += `<${tag}>${inner}</${tag}>`
    } else {
      html += inner
    }
  }
  return html.trim()
}

/**
 * A table marked with `::table{columns="Prop,Type,Default"}` keeps the listed
 * columns visible in the summary row; clicking a row expands a panel with every
 * column (Prop, Type, Default, Description, …), not just the collapsed ones.
 */
export function transformReferenceTables(tree: MarkdownDocument): MarkdownDocument {
  visit(
    tree,
    (node) => Array.isArray(node) && node[0] === 'table' && typeof node[1].columns === 'string',
    (node) => {
      if (!Array.isArray(node) || typeof node[0] !== 'string') return
      const columns = node[1].columns
      if (typeof columns !== 'string') return

      const headerRow = first(first(node, 'thead'), 'tr')
      if (!headerRow) return

      const labels = byTag(headerRow, 'th', 'td').map((c) => textContent(c))
      const shown = columns.split(',').map((c) => c.trim())
      const summary = labels.map((_, i) => i).filter((i) => shown.includes(labels[i]!))

      const rows: ReferenceRow[] = byTag(first(node, 'tbody'), 'tr').map((row) => {
        const cells = byTag(row, 'td', 'th')
        return {
          summary: summary.map((i) => renderInline(children(cells[i]))),
          detail: labels.map((label, i) => ({ label, html: renderInline(children(cells[i])) }))
        }
      })

      return ['table', { columns: summary.map((i) => labels[i]!), rows }]
    }
  )

  return tree
}
