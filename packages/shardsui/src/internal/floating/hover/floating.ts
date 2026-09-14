import {
  computed,
  onScopeDispose,
  onWatcherCleanup,
  toValue,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { contains, getTarget, isElement, listen } from '../../dom'
import { REASONS } from '../../reasons'
import { useTimeout } from '../../timeout'
import {
  FloatingNodeContext,
  FloatingTreeContext,
  getNodeChildren,
  type FloatingTree
} from '../floating-tree'
import type { HoverContext } from '../types'
import {
  applySafePolygonPointerEventsMutation,
  clearSafePolygonPointerEventsMutation,
  getHoverInteraction,
  type HoverInteraction
} from './interaction'
import {
  isClickLikeOpenEvent,
  isHoverOpenEvent,
  isInsideEnabledTrigger,
  isInteractiveElement
} from './predicates'

type HoverFloatingInteractionOptions = {
  enabled?: MaybeRefOrGetter<boolean | undefined>
  closeDelay?: MaybeRefOrGetter<number | undefined>
  nodeId?: MaybeRefOrGetter<string | undefined>
  tree?: MaybeRefOrGetter<FloatingTree | null | undefined>
  parentId?: MaybeRefOrGetter<string | null | undefined>
}

export function hoverFloatingInteraction(
  root: HoverContext,
  options: HoverFloatingInteractionOptions
): void {
  const childClosedTimeout = useTimeout()

  const floatingTree = FloatingTreeContext.getOr() ?? null
  const floatingNode = FloatingNodeContext.getOr()

  const enabled = computed(() => toValue(options.enabled) ?? true)
  const closeDelay = computed(() => toValue(options.closeDelay) ?? 0)
  const nodeId = computed(() => toValue(options.nodeId))
  const tree = computed(() => toValue(options.tree) ?? floatingTree)
  const parentId = computed(() => toValue(options.parentId) ?? floatingNode?.id ?? null)

  const instance: HoverInteraction = getHoverInteraction(root.data)

  function isHoverOpen(): boolean {
    return isHoverOpenEvent(root.data.openEvent?.type)
  }

  watchPostEffect(() => {
    if (!root.open.value) {
      instance.pointerType = undefined
      instance.restTimeoutPending = false
      instance.interactedInside = false
      clearSafePolygonPointerEventsMutation(instance)
    }
  })

  onScopeDispose(() => clearSafePolygonPointerEventsMutation(instance))

  watchPostEffect(() => {
    if (!enabled.value) return

    const open = root.open.value
    const floatingForScope = root.floatingElement.value
    const domReference = root.domReferenceElement.value
    const currentTree = tree.value
    const currentParentId = parentId.value

    if (
      open &&
      instance.closeGuardOptions?.().blockPointerEvents &&
      isHoverOpen() &&
      isElement(domReference) &&
      floatingForScope
    ) {
      const referenceElement = domReference as HTMLElement | SVGSVGElement

      const parentFloating =
        currentTree?.nodes.find((node) => node.id === currentParentId)?.floating ?? null

      if (parentFloating) {
        parentFloating.style.pointerEvents = ''
      }

      const cachedScopeElement =
        instance.pointerEventsScopeElement !== floatingForScope
          ? instance.pointerEventsScopeElement
          : null
      const parentScopeElement = parentFloating !== floatingForScope ? parentFloating : null
      const scopeElement =
        instance.closeGuardOptions?.().getScope?.() ??
        cachedScopeElement ??
        parentScopeElement ??
        referenceElement.closest('[data-rootownerid]') ??
        floatingForScope.ownerDocument.body
      applySafePolygonPointerEventsMutation(instance, {
        scopeElement,
        referenceElement,
        floatingElement: floatingForScope
      })
      onWatcherCleanup(() => clearSafePolygonPointerEventsMutation(instance))
    }
  })

  watchPostEffect(() => {
    if (!enabled.value) return

    const floating = root.floatingElement.value
    if (!floating) return

    const hasParentChildren = (): boolean =>
      !!(
        tree.value &&
        parentId.value &&
        getNodeChildren(tree.value.nodes, parentId.value).length > 0
      )

    const onpointerdown = (event: PointerEvent): void => {
      const target = getTarget(event)
      if (!isElement(target) || !isInteractiveElement(target)) {
        instance.interactedInside = false
        return
      }
      instance.interactedInside = target.closest('[aria-haspopup]') != null
    }

    const onmouseenter = (): void => {
      instance.openChangeTimeout.clear()
      childClosedTimeout.clear()
      tree.value?.events.off('floating.closed', onNodeClosed)
      clearSafePolygonPointerEventsMutation(instance)
    }

    const onmouseleave = (event: MouseEvent): void => {
      const currentTree = tree.value
      if (hasParentChildren() && currentTree) {
        currentTree.events.on('floating.closed', onNodeClosed)
        return
      }

      if (isInsideEnabledTrigger(event.relatedTarget, root.triggerElements)) {
        return
      }

      const currentNodeId = root.data.closeGuardContext?.nodeId ?? nodeId.value
      const relatedTarget = event.relatedTarget
      const isMovingIntoDescendantFloating =
        !!currentTree &&
        !!currentNodeId &&
        isElement(relatedTarget) &&
        getNodeChildren(currentTree.nodes, currentNodeId, false).some((node) =>
          contains(node.floating, relatedTarget)
        )

      if (isMovingIntoDescendantFloating) {
        return
      }

      const mouseMoveHandler = instance.mouseMoveHandler
      if (mouseMoveHandler) {
        mouseMoveHandler(event)
        return
      }

      clearSafePolygonPointerEventsMutation(instance)
      if (
        isHoverOpen() &&
        !isClickLikeOpenEvent(root.data.openEvent?.type, instance.interactedInside)
      ) {
        instance.closeAfterDelay(root, currentTree, closeDelay.value, event)
      }
    }

    const onNodeClosed = (event: MouseEvent): void => {
      const currentTree = tree.value
      if (!currentTree || !parentId.value || hasParentChildren()) {
        return
      }
      childClosedTimeout.start(0, () => {
        currentTree.events.off('floating.closed', onNodeClosed)
        root.setOpen(false, REASONS.triggerHover, event)
        currentTree.events.emit('floating.closed', event)
      })
    }

    const offMouseEnter = listen(floating, 'mouseenter', onmouseenter)
    const offMouseLeave = listen(floating, 'mouseleave', onmouseleave)
    const offPointerDown = listen(floating, 'pointerdown', onpointerdown, { capture: true })

    onWatcherCleanup(() => {
      offMouseEnter()
      offMouseLeave()
      offPointerDown()
      tree.value?.events.off('floating.closed', onNodeClosed)
    })
  })
}
