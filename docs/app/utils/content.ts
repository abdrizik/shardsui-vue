const pages = import.meta.glob<string>('../../content/*.md', { query: '?raw', import: 'default' })

export function loadContent(slug: string): Promise<string> | undefined {
  return pages[`../../content/${slug}.md`]?.()
}
