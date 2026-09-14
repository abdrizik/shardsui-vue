import {
  computed,
  shallowRef,
  toValue,
  watchPostEffect,
  onWatcherCleanup,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import type { MenuOpenChangeEvent, MenuTreeEvents } from '@/components/menu/context'
import { useCompositeRoot, type CompositeRoot } from '@/internal/floating/composite'
import {
  FloatingNodeContext,
  FloatingTreeContext,
  createFloatingTree,
  nextFloatingId,
  registerFloatingNode,
  type FloatingTree
} from '@/internal/floating/floating-tree'
import { REASONS } from '@/internal/reasons'
import type { Orientation } from '@/internal/types'

type MenubarRootOptions = {
  id: MaybeRefOrGetter<string>
  modal: MaybeRefOrGetter<boolean>
  disabled: MaybeRefOrGetter<boolean>
  orientation: MaybeRefOrGetter<Orientation>
  loopFocus: MaybeRefOrGetter<boolean>
  ref: MaybeRefOrGetter<HTMLElement | null>
}

export type MenubarRoot = {
  composite: CompositeRoot
  tree: FloatingTree<MenuTreeEvents>
  hasSubmenuOpen: ShallowRef<boolean>
  allowMouseUpTrigger: ShallowRef<boolean>
  rootId: ComputedRef<string>
  modal: ComputedRef<boolean>
  disabled: ComputedRef<boolean>
  orientation: ComputedRef<Orientation>
  ref: ComputedRef<HTMLElement | null>
}

export function useMenubarRoot(options: MenubarRootOptions): MenubarRoot {
  const hasSubmenuOpen = shallowRef(false)
  const allowMouseUpTrigger = shallowRef(false)

  const rootId = computed(() => toValue(options.id))
  const modal = computed(() => toValue(options.modal))
  const disabled = computed(() => toValue(options.disabled))
  const orientation = computed(() => toValue(options.orientation))
  const ref = computed(() => toValue(options.ref))

  const tree = createFloatingTree<MenuTreeEvents>()
  FloatingTreeContext.set(tree as FloatingTree)
  const nodeId = nextFloatingId()
  registerFloatingNode<MenuTreeEvents>({
    tree: () => tree,
    id: () => nodeId,
    parentId: () => null,
    open: () => hasSubmenuOpen.value
  })
  FloatingNodeContext.set({ id: nodeId })

  const composite = useCompositeRoot({
    orientation,
    loopFocus: () => toValue(options.loopFocus),
    enableHomeAndEnd: true,
    highlightItemOnHover: hasSubmenuOpen,
    ref
  })

  function onMenuOpenChange(details: MenuOpenChangeEvent) {
    if (details.parentNodeId !== nodeId) return
    if (details.open) {
      hasSubmenuOpen.value = true
      return
    }
    if (details.reason === REASONS.siblingOpen || details.reason === REASONS.listNavigation) return
    hasSubmenuOpen.value = false
  }

  watchPostEffect(() => {
    onWatcherCleanup(tree.events.on('menuopenchange', onMenuOpenChange))
  })

  return {
    composite,
    tree,
    hasSubmenuOpen,
    allowMouseUpTrigger,
    rootId,
    modal,
    disabled,
    orientation,
    ref
  }
}
