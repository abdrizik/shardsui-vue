function getWindow(node: Node): typeof window {
  return node.ownerDocument?.defaultView ?? window
}

export function isNode(value: unknown): value is Node {
  if (!value || typeof value !== 'object') return false
  return value instanceof Node || value instanceof getWindow(value as Node).Node
}

export function isElement(value: unknown): value is Element {
  if (!isNode(value)) return false
  return value instanceof Element || value instanceof getWindow(value).Element
}

export function isHTMLElement(value: unknown): value is HTMLElement {
  if (!isNode(value)) return false
  return value instanceof HTMLElement || value instanceof getWindow(value).HTMLElement
}

export function getNodeName(node: Node | Window): string {
  return isNode(node) ? (node.nodeName || '').toLowerCase() : '#document'
}

export function getComputedStyle(element: Element): CSSStyleDeclaration {
  return getWindow(element).getComputedStyle(element)
}

export function getParentNode(node: Node): Node {
  if (getNodeName(node) === 'html') return node
  const result =
    (node as Element).assignedSlot ||
    node.parentNode ||
    (node instanceof getWindow(node).ShadowRoot ? node.host : null) ||
    node.ownerDocument?.documentElement ||
    node
  return result instanceof getWindow(node).ShadowRoot ? result.host : result
}

export function isLastTraversableNode(node: Node): boolean {
  return ['html', 'body', '#document'].includes(getNodeName(node))
}

export function isOverflowElement(element: Element): boolean {
  const { overflow, overflowX, overflowY, display } = getComputedStyle(element)
  return (
    /auto|scroll|overlay|hidden|clip/.test(overflow + overflowY + overflowX) &&
    !['inline', 'contents'].includes(display)
  )
}

export function contains(
  parent: Element | null | undefined,
  child: EventTarget | null | undefined
): boolean {
  if (!parent || !isNode(child)) return false
  return parent.contains(child)
}

export function getTarget(event: Event): EventTarget | null {
  return event.composedPath()[0] ?? null
}

export function listen<K extends keyof DocumentEventMap>(
  target: EventTarget,
  type: K | string,
  handler: (event: never) => void,
  options?: boolean | AddEventListenerOptions
): () => void {
  target.addEventListener(type, handler as EventListener, options)
  return () => target.removeEventListener(type, handler as EventListener, options)
}
