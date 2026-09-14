import {
  computed,
  nextTick,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchEffect,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { cancelAnimationFrameTick, requestAnimationFrameTick } from './animation-frame'
import { createAnimationsFinished } from './animations-finished'
import { setTemporaryStyle, setTemporaryStyles } from './temporary-style'
import type { TransitionStatus } from './transition-status'

type AnimationType = 'css-transition' | 'css-animation' | 'none'

type Dimensions = {
  height: number | undefined
  width: number | undefined
}

const EMPTY_DIMENSIONS: Dimensions = {
  height: undefined,
  width: undefined
}

type PanelControllerOptions = {
  panel: MaybeRefOrGetter<HTMLElement | null>
  open: MaybeRefOrGetter<boolean>
  mounted: MaybeRefOrGetter<boolean>
  transitionStatus: MaybeRefOrGetter<TransitionStatus>
  keepMounted: MaybeRefOrGetter<boolean>
  hiddenUntilFound: MaybeRefOrGetter<boolean>
  setMounted: (next: boolean) => void
  setOpen: (open: boolean) => void
}

type LayoutResetStyle = Record<
  'justifyContent' | 'alignItems' | 'alignContent' | 'justifyItems',
  'initial !important'
>

type PanelStyle = {
  '--collapsible-panel-height': string
  '--collapsible-panel-width': string
  animationName?: 'none'
  animationDuration?: '0s'
  transitionDuration?: '0s'
} & Partial<LayoutResetStyle>

type PendingStyle = Pick<PanelStyle, 'animationDuration' | 'transitionDuration'> | null

function getDimensions(element: HTMLElement): { height: number; width: number } {
  return {
    height: element.scrollHeight,
    width: element.scrollWidth
  }
}

function getAnimationType(
  element: HTMLElement,
  hasSuppressedMountAnimation: boolean
): AnimationType {
  const win = element.ownerDocument.defaultView ?? window
  const styles = win.getComputedStyle(element)
  const hasAnimation =
    (styles.animationName
      .split(',')
      .map((n) => n.trim())
      .some((n) => n !== '' && n !== 'none') ||
      hasSuppressedMountAnimation) &&
    hasNonZeroDuration(styles.animationDuration)
  const hasTransition = hasNonZeroDuration(styles.transitionDuration)

  if (hasTransition) return 'css-transition'
  if (hasAnimation) return 'css-animation'
  return 'none'
}

function hasNonZeroDuration(value: string): boolean {
  return value
    .split(',')
    .map((part) => part.trim())
    .some((part) => part !== '' && Number.parseFloat(part) > 0)
}

const INITIAL_LAYOUT_STYLES: Record<string, string> = {
  'justify-content': 'initial',
  'align-items': 'initial',
  'align-content': 'initial',
  'justify-items': 'initial'
}

// Vue re-applies every bound inline style on each patch, so the imperative reset is mirrored here
// and folded into `style`; without it the consumer's own `style` would win back the property.
const MIRRORED_LAYOUT_STYLES: LayoutResetStyle = {
  justifyContent: 'initial !important',
  alignItems: 'initial !important',
  alignContent: 'initial !important',
  justifyItems: 'initial !important'
}

export function usePanelController(options: PanelControllerOptions) {
  const dimensions = shallowRef<Dimensions>(EMPTY_DIMENSIONS)
  const animationType = shallowRef<AnimationType>('none')
  const forcePanelIdle = shallowRef(false)
  const lastMeasuredDimensions = shallowRef<Dimensions>(EMPTY_DIMENSIONS)
  const shouldPreventMountAnimation = shallowRef(toValue(options.open))
  const pendingStyle = shallowRef<PendingStyle>(null)
  const layoutResetStyle = shallowRef<LayoutResetStyle | null>(null)
  let restorePendingStyle: (() => void) | null = null
  // `beforematch` must reveal the matched content immediately, so the next open skips
  // author-defined motion once.
  let shouldSkipNextOpen = false

  const panel = computed(() => toValue(options.panel))
  const open = computed(() => toValue(options.open))
  const mounted = computed(() => toValue(options.mounted))
  const transitionStatus = computed(() => toValue(options.transitionStatus))
  const keepMounted = computed(() => toValue(options.keepMounted))
  const hiddenUntilFound = computed(() => toValue(options.hiddenUntilFound))

  const hidden = computed(() => !open.value && !mounted.value)

  const hiddenAttr = computed<true | 'until-found' | undefined>(() =>
    hidden.value ? (hiddenUntilFound.value ? 'until-found' : true) : undefined
  )

  const status = computed<TransitionStatus>(() =>
    forcePanelIdle.value ? 'idle' : transitionStatus.value
  )

  const shouldPreventOpenAnimation = computed(() => open.value && shouldPreventMountAnimation.value)

  const shouldPersistHiddenTransitionStyles = computed(
    () => hiddenUntilFound.value && hidden.value && animationType.value !== 'css-animation'
  )

  const renderedDimensions = computed<Dimensions>(() =>
    !open.value &&
    mounted.value &&
    animationType.value === 'css-animation' &&
    dimensions.value.height === undefined &&
    dimensions.value.width === undefined
      ? lastMeasuredDimensions.value
      : dimensions.value
  )

  const shouldRender = computed(
    () => keepMounted.value || hiddenUntilFound.value || mounted.value || open.value
  )

  const heightPx = computed(() =>
    renderedDimensions.value.height === undefined ? 'auto' : `${renderedDimensions.value.height}px`
  )

  const widthPx = computed(() =>
    renderedDimensions.value.width === undefined ? 'auto' : `${renderedDimensions.value.width}px`
  )

  const style = computed<PanelStyle>(() => ({
    '--collapsible-panel-height': heightPx.value,
    '--collapsible-panel-width': widthPx.value,
    ...(shouldPreventOpenAnimation.value ? { animationName: 'none' } : undefined),
    ...pendingStyle.value,
    ...layoutResetStyle.value
  }))

  function resetLayoutStyles(element: HTMLElement): () => void {
    const restore = setTemporaryStyles(element, INITIAL_LAYOUT_STYLES, 'important')
    layoutResetStyle.value = MIRRORED_LAYOUT_STYLES

    function clear(): void {
      restore()
      layoutResetStyle.value = null
    }

    const frame = requestAnimationFrameTick(clear)

    return () => {
      cancelAnimationFrameTick(frame)
      clear()
    }
  }

  function clearPendingStyle(): void {
    const restore = restorePendingStyle
    restorePendingStyle = null
    restore?.()
    pendingStyle.value = null
  }

  function setPendingStyle(
    element: HTMLElement,
    property: 'transition-duration' | 'animation-duration'
  ): void {
    clearPendingStyle()
    restorePendingStyle = setTemporaryStyle(element, property, '0s')
    pendingStyle.value =
      property === 'transition-duration'
        ? { transitionDuration: '0s' }
        : { animationDuration: '0s' }
  }

  function setDimensions(next: Dimensions, shouldCacheMeasurement = true): void {
    if (shouldCacheMeasurement) {
      lastMeasuredDimensions.value = next
    }
    dimensions.value = next
  }

  const openIdleAnimationsFinished = createAnimationsFinished({
    element: panel,
    waitForStartingStyleRemoved: true
  })

  const closeAnimationsFinished = createAnimationsFinished({
    element: panel
  })

  watchEffect(() => {
    if (!forcePanelIdle.value || transitionStatus.value === 'starting') return
    forcePanelIdle.value = false
  })

  watchPostEffect(() => {
    const element = panel.value
    const isOpen = open.value
    const isMounted = mounted.value
    const currentStatus = transitionStatus.value
    if (!element) return

    if (!isOpen && restorePendingStyle) {
      clearPendingStyle()
    }

    const animType = getAnimationType(element, shouldPreventOpenAnimation.value)
    animationType.value = animType

    if (
      isOpen &&
      currentStatus === 'idle' &&
      shouldPreventMountAnimation.value &&
      animType === 'css-animation'
    ) {
      lastMeasuredDimensions.value = getDimensions(element)
      return
    }

    if (isOpen && currentStatus === 'starting') {
      const skipNextOpen = shouldSkipNextOpen
      shouldSkipNextOpen = false

      if (animType === 'none') {
        setDimensions(getDimensions(element))
        forcePanelIdle.value = true
        return
      }

      if (animType === 'css-transition') {
        onWatcherCleanup(resetLayoutStyles(element))
        setDimensions(getDimensions(element))

        if (!skipNextOpen) return

        setPendingStyle(element, 'transition-duration')
        forcePanelIdle.value = true
        return
      }

      setDimensions(getDimensions(element))

      const restoreAnimationName = setTemporaryStyle(element, 'animation-name', 'none')

      if (!skipNextOpen) {
        restoreAnimationName()
        return
      }

      restoreAnimationName()
      setPendingStyle(element, 'animation-duration')
      forcePanelIdle.value = true
      return
    }

    if (!isOpen && isMounted && (currentStatus === 'idle' || currentStatus === 'starting')) {
      shouldPreventMountAnimation.value = false

      if (animType === 'none') {
        setDimensions(EMPTY_DIMENSIONS, false)
        options.setMounted(false)
        return
      }

      setDimensions(getDimensions(element))
      return
    }

    if (currentStatus !== 'ending') return

    if (animType === 'none') {
      options.setMounted(false)
      return
    }

    const next = getDimensions(element)
    if (next.height === 0 && next.width === 0) {
      options.setMounted(false)
      return
    }

    setDimensions(next)
  })

  watchPostEffect(() => {
    const element = panel.value
    if (!open.value || !mounted.value || status.value !== 'idle' || !element) return

    const abortController = new AbortController()
    openIdleAnimationsFinished.run(() => {
      if (abortController.signal.aborted) return
      if (!open.value) return
      setDimensions(EMPTY_DIMENSIONS, false)
    }, abortController.signal)

    onWatcherCleanup(() => abortController.abort())
  })

  // Chrome can register the exit transition a frame after `[data-ending-style]` lands when an
  // Accordion closes one item while opening another, so wait one frame before watching.
  watchPostEffect(() => {
    const element = panel.value
    if (open.value || !mounted.value || status.value !== 'ending' || !element) return

    const abortController = new AbortController()

    const endingStyleFrame = requestAnimationFrameTick(() => {
      if (abortController.signal.aborted) return
      closeAnimationsFinished.run(() => {
        if (abortController.signal.aborted) return
        if (open.value) return
        options.setMounted(false)
        setDimensions(EMPTY_DIMENSIONS, false)
      }, abortController.signal)
    })

    onWatcherCleanup(() => {
      cancelAnimationFrameTick(endingStyleFrame)
      abortController.abort()
    })
  })

  watchPostEffect(() => {
    const element = panel.value
    if (!element) return

    const onbeforematch = () => {
      shouldSkipNextOpen = true
      options.setOpen(true)
      nextTick(() => {
        if (!open.value) shouldSkipNextOpen = false
      })
    }

    element.addEventListener('beforematch', onbeforematch)
    onWatcherCleanup(() => element.removeEventListener('beforematch', onbeforematch))
  })

  return {
    hiddenAttr,
    status,
    shouldPreventOpenAnimation,
    shouldPersistHiddenTransitionStyles,
    shouldRender,
    heightPx,
    widthPx,
    style
  }
}
