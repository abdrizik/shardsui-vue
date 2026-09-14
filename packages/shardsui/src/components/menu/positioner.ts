import {
  computed,
  onWatcherCleanup,
  toValue,
  watch,
  watchEffect,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'
import { createAnimationsFinished } from '@/internal/animations-finished'
import { DROPDOWN_COLLISION_AVOIDANCE, POPUP_COLLISION_AVOIDANCE } from '@/internal/constants'
import {
  useAnchorPositioning,
  type Align,
  type AnchorPositioning,
  type AnchorPositioningProps,
  type CollisionAvoidance,
  type OffsetFunction,
  type Side
} from '@/internal/floating/anchor-positioning'
import { useAnchoredPopupScrollLock } from '@/internal/floating/anchored-popup-scroll-lock'
import { REASONS } from '@/internal/reasons'
import { useTimeout } from '@/internal/timeout'
import type { MenuItemHoverEvent, MenuOpenChangeEvent } from './context'
import type { MenuRoot } from './menu'

type MenuPositionerOptions = {
  ref: MaybeRefOrGetter<HTMLElement | null>
  anchor: MaybeRefOrGetter<AnchorPositioningProps['anchor']>
  side: MaybeRefOrGetter<Side | undefined>
  align: MaybeRefOrGetter<Align | undefined>
  sideOffset: () => number | OffsetFunction | undefined
  alignOffset: () => number | OffsetFunction | undefined
  collisionBoundary: MaybeRefOrGetter<AnchorPositioningProps['collisionBoundary']>
  collisionPadding: MaybeRefOrGetter<AnchorPositioningProps['collisionPadding']>
  collisionAvoidance: MaybeRefOrGetter<CollisionAvoidance | undefined>
  sticky: MaybeRefOrGetter<boolean | undefined>
  arrowPadding: MaybeRefOrGetter<number | undefined>
  disableAnchorTracking: MaybeRefOrGetter<boolean | undefined>
  positionMethod: MaybeRefOrGetter<'absolute' | 'fixed' | undefined>
}

export type MenuPositioner = {
  positioning: AnchorPositioning
  shouldRenderBackdrop: ComputedRef<boolean>
  backdropCutout: ComputedRef<Element | null>
}

export function useMenuPositioner(menu: MenuRoot, options: MenuPositionerOptions): MenuPositioner {
  let prevAnchor: Element | { getBoundingClientRect(): DOMRect } | null = null
  const closeTimeout = useTimeout()

  const isContextMenu = computed(() => menu.parentType.value === 'context-menu')
  const menubarModal = computed(() => !!menu.menubar.value?.modal.value)
  const popupModal = computed(
    () => menu.modal.value && menu.openChangeReason.value !== REASONS.triggerHover
  )

  const side = computed<Side>(() => {
    const sideProp = toValue(options.side)
    if (sideProp != null) return sideProp
    if (menu.parentType.value === 'menu') return 'inline-end'
    if (
      menu.parentType.value === 'menubar' &&
      menu.menubar.value?.orientation.value === 'vertical'
    ) {
      return 'inline-end'
    }
    return 'bottom'
  })

  const align = computed<Align | undefined>(
    () => toValue(options.align) ?? (menu.parentType.value !== undefined ? 'start' : undefined)
  )

  const collisionAvoidance = computed<CollisionAvoidance>(
    () =>
      toValue(options.collisionAvoidance) ??
      (menu.parentType.value === 'menu' ? POPUP_COLLISION_AVOIDANCE : DROPDOWN_COLLISION_AVOIDANCE)
  )

  const anchorElement = computed(
    () => toValue(options.anchor) ?? menu.contextMenu?.anchor.value ?? menu.triggerElement.value
  )

  const isCursorAnchored = computed(
    () => isContextMenu.value && toValue(options.side) == null && align.value !== 'center'
  )

  const shouldRenderBackdrop = computed(
    () => menu.mounted.value && (popupModal.value || menubarModal.value)
  )

  const backdropCutout = computed<Element | null>(() => {
    if (menu.parentType.value === 'menubar') return menu.menubar.value?.ref.value ?? null
    if (menu.parentType.value === undefined) return menu.triggerElement.value
    return null
  })

  useAnchoredPopupScrollLock({
    enabled: () => menu.open.value && (menubarModal.value || popupModal.value),
    touchOpen: () => menu.openMethod.value === 'touch',
    positionerElement: () => toValue(options.ref),
    referenceElement: menu.triggerElement
  })

  const positioning = useAnchorPositioning({
    anchor: () => (menu.mounted.value ? anchorElement.value : null),
    floating: () => (menu.mounted.value ? toValue(options.ref) : null),
    side,
    align,
    sideOffset: () => options.sideOffset() ?? (isCursorAnchored.value ? -5 : 0),
    alignOffset: () => options.alignOffset() ?? (isCursorAnchored.value ? 2 : 0),
    positionMethod: () => (menu.insideContextMenu ? 'fixed' : toValue(options.positionMethod)),
    collisionBoundary: () => toValue(options.collisionBoundary),
    collisionPadding: () => toValue(options.collisionPadding),
    collisionAvoidance,
    sticky: () => toValue(options.sticky),
    arrowPadding: () => (isContextMenu.value ? 0 : toValue(options.arrowPadding)),
    shift: () =>
      isContextMenu.value
        ? {
            crossAxis: collisionAvoidance.value.side !== 'flip',
            rootBoundary: 'layoutViewport'
          }
        : undefined,
    disableAnchorTracking: () => toValue(options.disableAnchorTracking),
    adaptiveOrigin: menu.hasViewport
  })

  const animationsFinished = createAnimationsFinished({
    element: options.ref
  })

  watchEffect(() => {
    const currentAnchor = anchorElement.value
    const prev = prevAnchor
    if (currentAnchor) prevAnchor = currentAnchor

    if (!currentAnchor || !prev || currentAnchor === prev) return

    menu.instantType.value = undefined
    const ac = new AbortController()
    animationsFinished.run(() => {
      menu.instantType.value = 'trigger-change'
    }, ac.signal)
    onWatcherCleanup(() => ac.abort())
  })

  watchPostEffect(() => {
    function onMenuOpenChange(event: MenuOpenChangeEvent) {
      const nodeId = menu.nodeId.value
      const parentNodeId = menu.parentNodeId.value
      if (event.open) {
        if (event.parentNodeId === nodeId) {
          menu.hoverEnabled.value = false
        }
        if (event.nodeId !== nodeId && event.parentNodeId === parentNodeId) {
          menu.setOpen(false, REASONS.siblingOpen)
        }
      } else {
        if (event.nodeId === parentNodeId) {
          menu.setOpen(false, event.reason ?? REASONS.siblingOpen)
        }
      }
    }

    onWatcherCleanup(menu.tree.value.events.on('menuopenchange', onMenuOpenChange))
  })

  watch(
    () =>
      [
        menu.open.value,
        menu.mounted.value,
        menu.nodeId.value,
        menu.parentNodeId.value,
        menu.tree.value
      ] as const,
    ([open, mounted, nodeId, parentNodeId, tree], previous) => {
      if (!open && !mounted && !previous?.[0] && !previous?.[1]) return

      tree.events.emit('menuopenchange', {
        open,
        nodeId,
        parentNodeId,
        reason: menu.openChangeReason.value
      } satisfies MenuOpenChangeEvent)
    },
    { immediate: true, flush: 'post' }
  )

  watchPostEffect(() => {
    if (!menu.open.value) {
      closeTimeout.clear()
    }
  })

  watchPostEffect(() => {
    const onItemHover = (event: MenuItemHoverEvent) => {
      if (!menu.open.value || event.nodeId !== menu.parentNodeId.value) return

      if (!menu.triggerElement.value || menu.triggerElement.value === event.target) {
        closeTimeout.clear()
        return
      }

      const delay = menu.hoverCloseDelay.value
      if (delay <= 0) {
        menu.setOpen(false, REASONS.siblingOpen)
        return
      }
      if (closeTimeout.isStarted()) return
      closeTimeout.start(delay, () => {
        menu.setOpen(false, REASONS.siblingOpen)
      })
    }

    onWatcherCleanup(menu.tree.value.events.on('itemhover', onItemHover))
  })

  return { positioning, shouldRenderBackdrop, backdropCutout }
}
