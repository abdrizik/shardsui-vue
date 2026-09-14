import { onWatcherCleanup, watchPostEffect } from 'vue'
import { isIOS } from '@/internal/detect-browser'
import { createTimeout } from '@/internal/timeout'

// Word Joiner is invisible and zero-width, so it forces a text mutation without shifting layout.
const LIVE_REGION_MARKER = '⁠'
// Safari VoiceOver needed roughly 200ms to reliably notice the initial polite live-region change.
const INITIAL_LIVE_REGION_TEXT_MUTATION_RESET_DELAY = 200

function findLastTextNode(root: Element): Text | null {
  const walker = root.ownerDocument.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  let lastTextNode: Text | null = null

  while (walker.nextNode()) {
    const textNode = walker.currentNode as Text
    if (textNode.data !== '') {
      lastTextNode = textNode
    }
  }

  return lastTextNode
}

/** Marks the live region's text once so assistive tech announces its initial content. */
export function initialLiveRegionTextMutation(node: Element): (() => void) | undefined {
  if (isIOS) {
    return undefined
  }

  const textNode = findLastTextNode(node)
  if (textNode == null) {
    return undefined
  }

  const originalValue = textNode.data
  const markedValue = `${originalValue}${LIVE_REGION_MARKER}`
  textNode.data = markedValue

  const timeout = createTimeout()
  timeout.start(INITIAL_LIVE_REGION_TEXT_MUTATION_RESET_DELAY, () => {
    if (textNode.data === markedValue) {
      textNode.data = originalValue
    }
  })

  return () => {
    timeout.clear()
    if (textNode.data === markedValue) {
      textNode.data = originalValue
    }
  }
}

export function useInitialLiveRegionTextMutation(element: () => HTMLElement | null): void {
  watchPostEffect(() => {
    const node = element()
    if (!node) return
    const cleanup = initialLiveRegionTextMutation(node)
    if (cleanup) onWatcherCleanup(cleanup)
  })
}
