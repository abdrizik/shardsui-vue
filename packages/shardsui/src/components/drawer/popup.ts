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
import type { DialogRoot } from '@/components/dialog/dialog'
import { useDialogInteractions } from '@/components/dialog/interactions'
import { useFocusManager, type FocusTarget } from '@/internal/floating/focus-manager'
import { warn } from '@/internal/log'
import { openChangeComplete } from '@/internal/open-change-complete'
import { REASONS } from '@/internal/reasons'
import {
  DRAWER_SNAP_POINT_OFFSET_VAR,
  DRAWER_SWIPE_MOVEMENT_X_VAR,
  DRAWER_SWIPE_MOVEMENT_Y_VAR,
  DRAWER_SWIPE_PROGRESS_VAR,
  DRAWER_SWIPE_STRENGTH_VAR
} from './constants'
import type { DrawerRoot } from './drawer'
import { useDrawerSnapPoints } from './snap-points'
import type { DrawerSwipe } from './swipe'

const SWIPE_PROPERTIES: PropertyDefinition[] = [
  { name: DRAWER_SWIPE_MOVEMENT_X_VAR, syntax: '<length>', inherits: false, initialValue: '0px' },
  { name: DRAWER_SWIPE_MOVEMENT_Y_VAR, syntax: '<length>', inherits: false, initialValue: '0px' },
  {
    name: DRAWER_SNAP_POINT_OFFSET_VAR,
    syntax: '<length>',
    inherits: false,
    initialValue: '0px'
  },
  { name: DRAWER_SWIPE_PROGRESS_VAR, syntax: '<number>', inherits: false, initialValue: '0' },
  { name: DRAWER_SWIPE_STRENGTH_VAR, syntax: '<number>', inherits: false, initialValue: '1' }
]

let swipePropertiesRegistered = false

function registerSwipeProperties() {
  if (swipePropertiesRegistered) return
  swipePropertiesRegistered = true
  if (typeof CSS === 'undefined') return

  for (const property of SWIPE_PROPERTIES) {
    try {
      CSS.registerProperty(property)
    } catch {}
  }
}

type DrawerPopupOptions = {
  element: MaybeRefOrGetter<HTMLElement | null>
  id: MaybeRefOrGetter<string>
  initialFocus: () => FocusTarget | undefined
  finalFocus: () => FocusTarget | undefined
  keepMounted: MaybeRefOrGetter<boolean>
}

export type DrawerPopup = {
  nestedDrawerOpen: ComputedRef<boolean>
  expanded: ComputedRef<boolean>
  swiping: ComputedRef<boolean>
  releasing: ComputedRef<boolean>
  shouldRender: ComputedRef<boolean>
  nestedSwipeProgress: ComputedRef<string>
  snapPointOffset: ComputedRef<number>
  dragMovementX: ComputedRef<string>
  dragMovementY: ComputedRef<string>
  dragTransform: ComputedRef<string | undefined>
  dragTransition: ComputedRef<string | undefined>
  popupHeightVar: ComputedRef<string | undefined>
  frontmostHeightVar: ComputedRef<string | undefined>
  swipeStrengthVar: ComputedRef<string>
}

/** Focus, dismissal, height measurement and drag styling for `Drawer.Popup`. */
export function useDrawerPopup(
  dialog: DialogRoot,
  drawer: DrawerRoot,
  swipe: DrawerSwipe | undefined,
  options: DrawerPopupOptions
): DrawerPopup {
  let lastMeasuredHeight = 0

  const snapPoints = useDrawerSnapPoints({
    viewportElement: dialog.viewportElement,
    snapPoints: drawer.snapPoints,
    activeSnapPoint: drawer.activeSnapPoint,
    popupHeight: drawer.popupHeight
  })

  const nestedDrawerOpen = computed(() => dialog.nestedOpenDrawerCount.value > 0)

  const expanded = computed(() => drawer.activeSnapPoint.value === 1)

  const swiping = computed(() => swipe?.swiping.value ?? false)

  const releasing = computed(() => swipe?.releasing.value ?? false)

  const shouldRender = computed(() => dialog.mounted.value || toValue(options.keepMounted))

  const nestedSwipeProgress = computed(() =>
    drawer.nestedSwipeProgress.value > 0 ? `${drawer.nestedSwipeProgress.value}` : '0'
  )

  const applySnapPoints = computed(() => {
    const points = drawer.snapPoints.value
    const direction = drawer.swipeDirection.value
    return !!points && points.length > 0 && (direction === 'up' || direction === 'down')
  })

  const activeSnapPointOffset = snapPoints.activeSnapPointOffset

  const snapPointOffset = computed(() => {
    const offset = activeSnapPointOffset.value
    if (!applySnapPoints.value || offset === null) return 0
    return drawer.swipeDirection.value === 'up' ? -offset : offset
  })

  const dragStyles = computed<Record<string, string | undefined>>(() => {
    const styles: Record<string, string | undefined> = swipe?.dragStyles.value ?? {}
    if (!applySnapPoints.value || drawer.swipeDirection.value !== 'down') return styles

    const baseOffset = activeSnapPointOffset.value ?? 0
    const movement = Number.parseFloat(styles[DRAWER_SWIPE_MOVEMENT_Y_VAR] ?? '')
    const nextOffset = baseOffset + (Number.isFinite(movement) ? movement : 0)
    if (!swiping.value || !(nextOffset < 0)) return { ...styles, transform: undefined }

    return {
      ...styles,
      transform: undefined,
      [DRAWER_SWIPE_MOVEMENT_Y_VAR]: `${-Math.sqrt(-nextOffset) - baseOffset}px`
    }
  })

  const dragMovementX = computed(
    () =>
      drawer.swipeAreaMovement.value?.x ?? dragStyles.value[DRAWER_SWIPE_MOVEMENT_X_VAR] ?? '0px'
  )
  const dragMovementY = computed(
    () =>
      drawer.swipeAreaMovement.value?.y ?? dragStyles.value[DRAWER_SWIPE_MOVEMENT_Y_VAR] ?? '0px'
  )
  const dragTransform = computed(() => dragStyles.value.transform ?? undefined)
  const dragTransition = computed(() =>
    drawer.swipeAreaMovement.value ? 'none' : (dragStyles.value.transition ?? undefined)
  )

  const popupHeightVar = computed(() => {
    const shouldPinHeight =
      drawer.hasNestedDrawer.value || dialog.transitionStatus.value === 'ending'
    return drawer.popupHeight.value && shouldPinHeight ? `${drawer.popupHeight.value}px` : undefined
  })

  const frontmostHeightVar = computed(() =>
    drawer.frontmostHeight.value ? `${drawer.frontmostHeight.value}px` : undefined
  )

  const swipeStrengthVar = computed(() => {
    const strength = swipe?.swipeStrength.value ?? null
    return typeof strength === 'number' && Number.isFinite(strength) && strength > 0
      ? `${strength}`
      : '1'
  })

  if (!swipe) {
    warn(
      '<Drawer.Popup> expected to be rendered within <Drawer.Viewport>. Omitting the',
      'viewport disables drawer swipe handling and touch scroll locking. Wrap',
      '<Drawer.Popup> in <Drawer.Viewport>.'
    )
  }

  watchEffect(() => {
    dialog.popupId.value = toValue(options.id)
    onWatcherCleanup(() => {
      dialog.popupId.value = undefined
    })
  })

  watch(
    () => [dialog.mounted.value, toValue(options.element), nestedDrawerOpen.value] as const,
    ([mounted, element]) => {
      if (!mounted) {
        lastMeasuredHeight = 0
        drawer.onPopupHeightChange(0)
        return
      }

      if (!element) return

      registerSwipeProperties()

      const measure = () => {
        const offsetHeight = element.offsetHeight
        const frontmost = drawer.frontmostHeight.value
        const hasNested = drawer.hasNestedDrawer.value

        if (
          lastMeasuredHeight > 0 &&
          frontmost > lastMeasuredHeight &&
          offsetHeight > lastMeasuredHeight
        ) {
          return
        }

        if (lastMeasuredHeight > 0 && hasNested) {
          drawer.onPopupHeightChange(lastMeasuredHeight)
          return
        }

        if (offsetHeight === lastMeasuredHeight) return

        lastMeasuredHeight = offsetHeight
        drawer.onPopupHeightChange(offsetHeight)
      }

      measure()
      const observer = new ResizeObserver(measure)
      observer.observe(element)
      onWatcherCleanup(() => observer.disconnect())
    },
    { immediate: true, flush: 'post' }
  )

  watchPostEffect(() => {
    const parent = drawer.parent.value
    if (!parent) return
    const present = dialog.open.value || dialog.transitionStatus.value === 'ending'
    parent.hasNestedDrawer.value = present
    onWatcherCleanup(() => {
      parent.hasNestedDrawer.value = false
    })
  })

  watchPostEffect(() => {
    const parent = drawer.parent.value
    if (!parent || !dialog.open.value) return
    parent.onNestedFrontmostHeightChange(drawer.frontmostHeight.value)
    onWatcherCleanup(() => parent.onNestedFrontmostHeightChange(0))
  })

  openChangeComplete({
    open: dialog.open,
    element: options.element,
    onComplete: () => {
      if (dialog.open.value) dialog.onOpenChangeComplete.value?.(true)
    }
  })

  useDialogInteractions({
    dialog,
    popupElement: options.element
  })

  useFocusManager({
    open: dialog.open,
    modal: () => dialog.modal.value !== false,
    enabled: dialog.mounted,
    popupElement: () => toValue(options.element),
    triggerElement: dialog.activeTrigger,
    openMethod: dialog.openMethod,
    initialFocus: () => options.initialFocus() ?? toValue(options.element) ?? true,
    finalFocus: () => options.finalFocus(),
    closeOnFocusOut: () => !dialog.disablePointerDismissal.value,
    onFocusOut: () => (event) => {
      dialog.setOpen(false, REASONS.focusOut, event)
    },
    restoreFocus: 'popup',
    closeEvent: dialog.lastCloseEvent,
    closeReason: dialog.openChangeReason
  })

  return {
    nestedDrawerOpen,
    expanded,
    swiping,
    releasing,
    shouldRender,
    nestedSwipeProgress,
    snapPointOffset,
    dragMovementX,
    dragMovementY,
    dragTransform,
    dragTransition,
    popupHeightVar,
    frontmostHeightVar,
    swipeStrengthVar
  }
}
