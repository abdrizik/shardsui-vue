import { onWatcherCleanup, shallowRef, watchPostEffect, type ShallowRef } from 'vue'
import { createContext } from '../context'
import { createEventEmitter, type EventEmitter } from './event-emitter'

type FloatingNode = {
  id: string
  parentId: string | null
  dismissBubbles?: { escapeKey: boolean; outsidePress: boolean }
  floating?: HTMLElement | null
  open?: boolean
}

export type FloatingTreeEvents = {
  'floating.closed': MouseEvent
}

export type FloatingTree<E extends FloatingTreeEvents = FloatingTreeEvents> = {
  // Deliberately non-reactive — dependents track `version` instead. Making this reactive makes
  // every reader track every node's `open` getter.
  nodes: FloatingNode[]
  events: EventEmitter<E>
  version: ShallowRef<number>
  addNode(node: FloatingNode): void
  removeNode(node: FloatingNode): void
}

export function createFloatingTree<
  E extends FloatingTreeEvents = FloatingTreeEvents
>(): FloatingTree<E> {
  const nodes: FloatingNode[] = []
  const version = shallowRef(0)
  let revision = 0

  return {
    nodes,
    events: createEventEmitter<E>(),
    version,

    addNode(node) {
      nodes.push(node)
      revision += 1
      version.value = revision
    },

    removeNode(node) {
      const i = nodes.indexOf(node)
      if (i !== -1) {
        nodes.splice(i, 1)
        revision += 1
        version.value = revision
      }
    }
  }
}

export type FloatingNodeContextValue = { readonly id: string }

export const FloatingTreeContext = createContext<FloatingTree>('FloatingTree')
export const FloatingNodeContext = createContext<FloatingNodeContextValue>('FloatingNode')

let nextId = 0
export function nextFloatingId(): string {
  nextId += 1
  return `floating-${nextId}`
}

export function registerFloatingNode<E extends FloatingTreeEvents = FloatingTreeEvents>(options: {
  tree: () => FloatingTree<E>
  id: () => string
  parentId: () => string | null
  open: () => boolean
  floating?: (() => HTMLElement | null) | undefined
}): void {
  watchPostEffect(() => {
    const tree = options.tree()
    const node: FloatingNode = {
      id: options.id(),
      parentId: options.parentId(),
      get open() {
        return options.open()
      },
      get floating() {
        return options.floating?.() ?? null
      }
    }
    tree.addNode(node)
    onWatcherCleanup(() => tree.removeNode(node))
  })
}

export function attachFloatingNode<E extends FloatingTreeEvents = FloatingTreeEvents>(options: {
  open: () => boolean
  floating?: (() => HTMLElement | null) | undefined
}): { tree: FloatingTree<E>; nodeId: string; parentNodeId: string | null } {
  const inherited = FloatingTreeContext.getOr()
  const tree = (inherited as FloatingTree<E> | undefined) ?? createFloatingTree<E>()
  if (!inherited) FloatingTreeContext.set(tree as FloatingTree)
  const nodeId = nextFloatingId()
  const parentNodeId = FloatingNodeContext.getOr()?.id ?? null
  registerFloatingNode<E>({
    tree: () => tree,
    id: () => nodeId,
    parentId: () => parentNodeId,
    open: options.open,
    floating: options.floating
  })
  FloatingNodeContext.set({ id: nodeId })
  return { tree, nodeId, parentNodeId }
}

export function getNodeChildren(
  nodes: FloatingNode[],
  parentId: string,
  onlyOpenChildren = true
): FloatingNode[] {
  const directChildren = nodes.filter((n) => n.parentId === parentId)
  return directChildren.flatMap((child) => [
    ...(!onlyOpenChildren || child.open ? [child] : []),
    ...getNodeChildren(nodes, child.id, onlyOpenChildren)
  ])
}

export function getNodeAncestors(nodes: FloatingNode[], nodeId: string): FloatingNode[] {
  const out: FloatingNode[] = []
  let current = nodes.find((n) => n.id === nodeId)?.parentId ?? null
  while (current) {
    const node = nodes.find((n) => n.id === current)
    if (!node) break
    out.push(node)
    current = node.parentId
  }
  return out
}
