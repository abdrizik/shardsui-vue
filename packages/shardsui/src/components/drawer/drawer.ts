import {
  computed,
  shallowRef,
  toValue,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import type { SwipeDirection } from '@/internal/swipe-dismiss'

export type DrawerSwipeDirection = SwipeDirection
export type DrawerSnapPoint = number | string

type DrawerRootOptions = {
  parent: MaybeRefOrGetter<DrawerRoot | undefined>
  swipeDirection: MaybeRefOrGetter<DrawerSwipeDirection>
  snapPoints: MaybeRefOrGetter<DrawerSnapPoint[] | undefined>
  snapPoint: MaybeRefOrGetter<DrawerSnapPoint | null>
  snapToSequentialPoints: MaybeRefOrGetter<boolean>
  setSnapPoint: (snapPoint: DrawerSnapPoint | null) => void
}

export type DrawerSwipeAreaMovement = { x: string; y: string }

export type DrawerRoot = {
  popupHeight: ShallowRef<number>
  frontmostHeight: ShallowRef<number>
  hasNestedDrawer: ShallowRef<boolean>
  nestedSwiping: ShallowRef<boolean>
  nestedSwipeProgress: ShallowRef<number>
  swipeAreaActive: ShallowRef<boolean>
  swipeAreaMovement: ShallowRef<DrawerSwipeAreaMovement | null>
  swipeDismissed: ShallowRef<boolean>
  parent: ComputedRef<DrawerRoot | undefined>
  swipeDirection: ComputedRef<DrawerSwipeDirection>
  snapPoints: ComputedRef<DrawerSnapPoint[] | undefined>
  snapToSequentialPoints: ComputedRef<boolean>
  activeSnapPoint: ComputedRef<DrawerSnapPoint | null>
  setActiveSnapPoint: (next: DrawerSnapPoint | null) => void
  onPopupHeightChange: (height: number) => void
  onNestedFrontmostHeightChange: (height: number) => void
  onNestedSwipingChange: (swiping: boolean) => void
  onNestedSwipeProgressChange: (progress: number) => void
}

export function useDrawerRoot(options: DrawerRootOptions): DrawerRoot {
  const popupHeight = shallowRef(0)
  const frontmostHeight = shallowRef(0)
  const hasNestedDrawer = shallowRef(false)
  const nestedSwiping = shallowRef(false)
  const nestedSwipeProgress = shallowRef(0)

  const swipeAreaActive = shallowRef(false)
  const swipeAreaMovement = shallowRef<DrawerSwipeAreaMovement | null>(null)
  const swipeDismissed = shallowRef(false)

  let isNestedDrawerOpen = false

  const parent = computed(() => toValue(options.parent))
  const swipeDirection = computed(() => toValue(options.swipeDirection))
  const snapPoints = computed(() => toValue(options.snapPoints))
  const snapToSequentialPoints = computed(() => toValue(options.snapToSequentialPoints))
  const activeSnapPoint = computed(() => toValue(options.snapPoint))

  function setActiveSnapPoint(next: DrawerSnapPoint | null): void {
    options.setSnapPoint(next)
  }

  function onPopupHeightChange(height: number): void {
    popupHeight.value = height
    if (!isNestedDrawerOpen && height > 0) {
      frontmostHeight.value = height
    }
  }

  function onNestedFrontmostHeightChange(height: number): void {
    if (height > 0) {
      isNestedDrawerOpen = true
      frontmostHeight.value = height
      return
    }
    isNestedDrawerOpen = false
    if (popupHeight.value > 0) {
      frontmostHeight.value = popupHeight.value
    }
  }

  function onNestedSwipingChange(swiping: boolean): void {
    nestedSwiping.value = swiping
    parent.value?.onNestedSwipingChange(swiping)
  }

  function onNestedSwipeProgressChange(progress: number): void {
    nestedSwipeProgress.value = Number.isFinite(progress) ? progress : 0
    parent.value?.onNestedSwipeProgressChange(progress)
  }

  return {
    popupHeight,
    frontmostHeight,
    hasNestedDrawer,
    nestedSwiping,
    nestedSwipeProgress,
    swipeAreaActive,
    swipeAreaMovement,
    swipeDismissed,
    parent,
    swipeDirection,
    snapPoints,
    snapToSequentialPoints,
    activeSnapPoint,
    setActiveSnapPoint,
    onPopupHeightChange,
    onNestedFrontmostHeightChange,
    onNestedSwipingChange,
    onNestedSwipeProgressChange
  }
}
