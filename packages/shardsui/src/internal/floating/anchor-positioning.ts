import {
  autoUpdate,
  computePosition,
  flip,
  hide,
  limitShift,
  offset,
  shift,
  size,
  type Middleware,
  type MiddlewareState,
  type Padding,
  type Placement
} from '@floating-ui/dom'
import {
  clamp,
  getAlignment,
  getAlignmentAxis,
  getAxisLength,
  getPaddingObject,
  getSide,
  getSideAxis
} from '@floating-ui/utils'
import { isElement } from '@floating-ui/utils/dom'
import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watch,
  watchPostEffect,
  type MaybeRefOrGetter
} from 'vue'
import { DirectionContext } from '@/internal/direction-context'

export type Side = 'top' | 'bottom' | 'left' | 'right' | 'inline-end' | 'inline-start'
export type Align = 'start' | 'center' | 'end'
export type Boundary =
  | 'clipping-ancestors'
  | Element
  | Element[]
  | { x: number; y: number; width: number; height: number }
type PhysicalSide = 'top' | 'bottom' | 'left' | 'right'

export type OffsetFunction = (data: {
  side: Side
  align: Align
  anchor: { width: number; height: number }
  positioner: { width: number; height: number }
}) => number

type SideFlipMode = {
  side?: 'flip' | 'none'
  align?: 'flip' | 'shift' | 'none'
  fallbackAxisSide?: 'start' | 'end' | 'none'
}

type SideShiftMode = {
  side?: 'shift' | 'none'
  /** Shifting the side pins the align axis, so it cannot flip. */
  align?: 'shift' | 'none'
  fallbackAxisSide?: 'start' | 'end' | 'none'
}

export type CollisionAvoidance = SideFlipMode | SideShiftMode

export type VirtualAnchorElement = { getBoundingClientRect(): DOMRect }

export type AnchorPositioningProps = {
  anchor?: Element | VirtualAnchorElement | null
  side?: Side
  align?: Align
  sideOffset?: number | OffsetFunction
  alignOffset?: number | OffsetFunction
  collisionBoundary?: Boundary
  collisionPadding?: number | Padding
  collisionAvoidance?: CollisionAvoidance
  sticky?: boolean
  arrowPadding?: number
  disableAnchorTracking?: boolean
  positionMethod?: 'absolute' | 'fixed'
}

type AnchorPositioningOptions = {
  anchor: MaybeRefOrGetter<Element | VirtualAnchorElement | null>
  floating: MaybeRefOrGetter<HTMLElement | null>
  side?: MaybeRefOrGetter<Side | undefined>
  align?: MaybeRefOrGetter<Align | undefined>
  sideOffset?: () => number | OffsetFunction | undefined
  alignOffset?: () => number | OffsetFunction | undefined
  collisionBoundary?: MaybeRefOrGetter<Boundary | undefined>
  collisionPadding?: MaybeRefOrGetter<number | Padding | undefined>
  collisionAvoidance?: MaybeRefOrGetter<CollisionAvoidance | undefined>
  sticky?: MaybeRefOrGetter<boolean | undefined>
  arrowPadding?: MaybeRefOrGetter<number | undefined>
  disableAnchorTracking?: MaybeRefOrGetter<boolean | undefined>
  positionMethod?: MaybeRefOrGetter<'absolute' | 'fixed' | undefined>
  adaptiveOrigin?: MaybeRefOrGetter<boolean | undefined>
  lazyFlip?: MaybeRefOrGetter<boolean | undefined>
  shift?: MaybeRefOrGetter<{ crossAxis?: boolean; rootBoundary?: 'layoutViewport' } | undefined>
  inline?: MaybeRefOrGetter<Middleware | null | undefined>
}

function getDPR(element: Element | null): number {
  if (typeof window === 'undefined') return 1
  const win = element?.ownerDocument.defaultView || window
  return win.devicePixelRatio || 1
}

function getAlign(placement: Placement): Align {
  const alignment = getAlignment(placement)
  return alignment === 'start' || alignment === 'end' ? alignment : 'center'
}

function getPhysicalSide(sideParam: Side, isRtl: boolean): PhysicalSide {
  return (
    {
      top: 'top',
      bottom: 'bottom',
      left: 'left',
      right: 'right',
      'inline-end': isRtl ? 'left' : 'right',
      'inline-start': isRtl ? 'right' : 'left'
    } satisfies Record<Side, PhysicalSide>
  )[sideParam]
}

function getLogicalSide(sideParam: Side, renderedSide: PhysicalSide, isRtl: boolean): Side {
  const isLogicalSideParam = sideParam === 'inline-start' || sideParam === 'inline-end'
  const logicalRight = isRtl ? 'inline-start' : 'inline-end'
  const logicalLeft = isRtl ? 'inline-end' : 'inline-start'
  return (
    {
      top: 'top',
      right: isLogicalSideParam ? logicalRight : 'right',
      bottom: 'bottom',
      left: isLogicalSideParam ? logicalLeft : 'left'
    } satisfies Record<PhysicalSide, Side>
  )[renderedSide]
}

function getOffsetData(state: MiddlewareState, sideParam: Side, isRtl: boolean) {
  const { rects, placement } = state
  return {
    side: getLogicalSide(sideParam, getSide(placement), isRtl),
    align: getAlign(placement),
    anchor: { width: rects.reference.width, height: rects.reference.height },
    positioner: { width: rects.floating.width, height: rects.floating.height }
  }
}

function arrowMiddleware(options: { element: Element; padding?: Padding }): Middleware {
  return {
    name: 'arrow',
    options,
    async fn(state) {
      const { x, y, placement, rects, platform, elements, middlewareData } = state
      const { element, padding = 0 } = options

      const paddingObject = getPaddingObject(padding)
      const coords = { x, y }
      const axis = getAlignmentAxis(placement)
      const length = getAxisLength(axis)
      const arrowDimensions = await platform.getDimensions(element)
      const isYAxis = axis === 'y'
      const minProp = isYAxis ? 'top' : 'left'
      const maxProp = isYAxis ? 'bottom' : 'right'
      const clientProp = isYAxis ? 'clientHeight' : 'clientWidth'

      const endDiff =
        rects.reference[length] + rects.reference[axis] - coords[axis] - rects.floating[length]
      const startDiff = coords[axis] - rects.reference[axis]

      const clientSize = elements.floating[clientProp] || rects.floating[length]

      const centerToReference = endDiff / 2 - startDiff / 2

      const largestPossiblePadding = clientSize / 2 - arrowDimensions[length] / 2 - 1
      const minPadding = Math.min(paddingObject[minProp], largestPossiblePadding)
      const maxPadding = Math.min(paddingObject[maxProp], largestPossiblePadding)

      const max = clientSize - arrowDimensions[length] - maxPadding
      const center = clientSize / 2 - arrowDimensions[length] / 2 + centerToReference
      const offsetVal = clamp(minPadding, center, max)

      const shouldAddOffset =
        !middlewareData.arrow &&
        getAlignment(placement) != null &&
        center !== offsetVal &&
        rects.reference[length] / 2 -
          (center < minPadding ? minPadding : maxPadding) -
          arrowDimensions[length] / 2 <
          0
      const alignmentOffset = shouldAddOffset
        ? center < minPadding
          ? center - minPadding
          : center - max
        : 0

      return {
        [axis]: coords[axis] + alignmentOffset,
        data: {
          [axis]: offsetVal,
          centerOffset: center - offsetVal - alignmentOffset,
          ...(shouldAddOffset && { alignmentOffset })
        },
        reset: shouldAddOffset
      }
    }
  }
}

type AdaptiveOriginData = { sideX: 'left' | 'right'; sideY: 'top' | 'bottom' }

const DEFAULT_ADAPTIVE_ORIGIN: AdaptiveOriginData = { sideX: 'left', sideY: 'top' }

function transformOriginMiddleware(options: {
  arrowElement: Element | null | undefined
  crossAxisShiftEnabled: boolean
  getSideOffset: (state: MiddlewareState) => number
}): Middleware {
  const { arrowElement, crossAxisShiftEnabled, getSideOffset } = options
  return {
    name: 'transformOrigin',
    fn(state) {
      const renderedSide = getSide(state.placement)
      const arrowData = state.middlewareData.arrow
      const arrowCenterX = (arrowData?.x || 0) + (arrowElement?.clientWidth || 0) / 2
      const arrowCenterY = (arrowData?.y || 0) + (arrowElement?.clientHeight || 0) / 2
      const sideOffset = getSideOffset(state)

      const adjacentOrigin = (
        {
          top: `${arrowCenterX}px calc(100% + ${sideOffset}px)`,
          bottom: `${arrowCenterX}px ${-sideOffset}px`,
          left: `calc(100% + ${sideOffset}px) ${arrowCenterY}px`,
          right: `${-sideOffset}px ${arrowCenterY}px`
        } satisfies Record<PhysicalSide, string>
      )[renderedSide]

      const isOverlappingAnchor = Math.abs(state.middlewareData.shift?.y || 0) > sideOffset
      const anchorCenterY = state.rects.reference.y + state.rects.reference.height / 2 - state.y
      const shouldUseOverlapOrigin =
        crossAxisShiftEnabled && getSideAxis(state.placement) === 'y' && isOverlappingAnchor

      state.elements.floating.style.setProperty(
        '--transform-origin',
        shouldUseOverlapOrigin ? `${arrowCenterX}px ${anchorCenterY}px` : adjacentOrigin
      )
      return {}
    }
  }
}

const baseHide = hide()

const hideMiddleware: Middleware = {
  name: 'hide',
  async fn(state) {
    const { width, height, x, y } = state.rects.reference
    const isCollapsedAtOrigin = width === 0 && height === 0 && x === 0 && y === 0
    const hideResult = await baseHide.fn(state)
    return {
      data: { referenceHidden: hideResult.data?.referenceHidden || isCollapsedAtOrigin }
    }
  }
}

const adaptiveOriginMiddleware: Middleware = {
  name: 'adaptiveOrigin',
  async fn(state) {
    const {
      x,
      y,
      rects: { floating: floatingRect },
      elements: { floating },
      platform,
      strategy,
      placement
    } = state

    const win = floating.ownerDocument.defaultView ?? window
    const { transitionDuration } = win.getComputedStyle(floating)
    if (transitionDuration === '0s' || transitionDuration === '') {
      return { x, y, data: DEFAULT_ADAPTIVE_ORIGIN }
    }

    const offsetParent = await platform.getOffsetParent?.(floating)
    let offsetDimensions = { width: 0, height: 0 }

    if (strategy === 'fixed' && win.visualViewport) {
      offsetDimensions = { width: win.visualViewport.width, height: win.visualViewport.height }
    } else if (offsetParent === win) {
      const { documentElement } = floating.ownerDocument
      offsetDimensions = {
        width: documentElement.clientWidth,
        height: documentElement.clientHeight
      }
    } else if (await platform.isElement?.(offsetParent)) {
      offsetDimensions = await platform.getDimensions(offsetParent)
    }

    const side = getSide(placement)
    return {
      x: side === 'left' ? offsetDimensions.width - (x + floatingRect.width) : x,
      y: side === 'top' ? offsetDimensions.height - (y + floatingRect.height) : y,
      data: {
        sideX: side === 'left' ? ('right' as const) : ('left' as const),
        sideY: side === 'top' ? ('bottom' as const) : ('top' as const)
      }
    }
  }
}

export function useAnchorPositioning(options: AnchorPositioningOptions) {
  const x = shallowRef(0)
  const y = shallowRef(0)
  let generation = 0
  const placement = shallowRef<Placement | null>(null)
  const anchorHidden = shallowRef(false)
  const isPositioned = shallowRef(false)
  const arrowX = shallowRef<number | undefined>(undefined)
  const arrowY = shallowRef<number | undefined>(undefined)
  const arrowUncentered = shallowRef(false)
  const arrowElement = shallowRef<Element | null>(null)

  const mountSide = shallowRef<PhysicalSide | null>(null)
  const adaptiveSideData = shallowRef<AdaptiveOriginData>(DEFAULT_ADAPTIVE_ORIGIN)

  const direction = DirectionContext.get().direction

  const disableAnchorTracking = computed(() => toValue(options.disableAnchorTracking))

  const isRtl = computed(() => direction.value === 'rtl')

  const sideParam = computed(() => toValue(options.side) ?? 'bottom')

  const preferredPhysicalSide = computed(
    () => mountSide.value ?? getPhysicalSide(sideParam.value, isRtl.value)
  )

  const requestedPlacement = computed<Placement>(() => {
    const align = toValue(options.align) ?? 'center'
    return align === 'center'
      ? preferredPhysicalSide.value
      : `${preferredPhysicalSide.value}-${align}`
  })

  const renderedSide = computed(() => getSide(placement.value ?? requestedPlacement.value))

  const side = computed(() => getLogicalSide(sideParam.value, renderedSide.value, isRtl.value))

  const align = computed(() => getAlign(placement.value ?? requestedPlacement.value))

  const activeAnchor = computed(() => {
    const a = toValue(options.anchor)
    if (isElement(a) && !a.isConnected) return null
    return a ?? null
  })

  const activeFloating = computed(() => toValue(options.floating))

  const positionerStyles = computed((): Record<string, string> => {
    if (!isPositioned.value) {
      return { position: 'fixed', top: '0', left: '0', opacity: '0' }
    }
    const styles: Record<string, string> = {
      position: toValue(options.positionMethod) ?? 'absolute'
    }
    if (toValue(options.adaptiveOrigin)) {
      styles[adaptiveSideData.value.sideY] = `${y.value}px`
      styles[adaptiveSideData.value.sideX] = `${x.value}px`
    } else {
      const dpr = getDPR(toValue(options.floating))
      const round = (value: number) => Math.round(value * dpr) / dpr
      styles.top = '0'
      styles.left = '0'
      styles.transform = `translate(${round(x.value)}px,${round(y.value)}px)`
      if (dpr >= 1.5) {
        styles['will-change'] = 'transform'
      }
    }
    return styles
  })

  const update = (): void => {
    const anchor = toValue(options.anchor)
    const floating = toValue(options.floating)
    if (!anchor || !floating) return

    const sideParamValue = toValue(options.side) ?? 'bottom'
    const alignParam = toValue(options.align) ?? 'center'
    const sideOffsetValue = options.sideOffset?.() ?? 0
    const alignOffsetValue = options.alignOffset?.() ?? 0
    const positionMethod = toValue(options.positionMethod) ?? 'absolute'
    const collisionAvoidance = toValue(options.collisionAvoidance) ?? {}
    const sticky = toValue(options.sticky) ?? false
    const arrowPadding = toValue(options.arrowPadding) ?? 5
    const shiftOptions = toValue(options.shift)
    const shiftCrossAxis = shiftOptions?.crossAxis ?? false
    const shiftRootBoundary = shiftOptions?.rootBoundary
    const inlineMiddleware = toValue(options.inline) ?? null
    const adaptiveOriginEnabled = toValue(options.adaptiveOrigin)
    const lazyFlip = toValue(options.lazyFlip)

    const rtl = isRtl.value
    const placementValue = requestedPlacement.value

    // Biases the preferred side by a single pixel: on iOS, an open software keyboard centres the
    // input exactly in the viewport, and without the bias a tie flips the popup to the other side.
    const bias = 1
    const biasTop = sideParamValue === 'bottom' ? bias : 0
    const biasRight = sideParamValue === 'left' ? bias : 0
    const biasBottom = sideParamValue === 'top' ? bias : 0
    const biasLeft = sideParamValue === 'right' ? bias : 0
    const collisionPadding = getPaddingObject(toValue(options.collisionPadding) ?? 5)

    const collisionBoundary = toValue(options.collisionBoundary) ?? 'clipping-ancestors'
    const boundary =
      collisionBoundary === 'clipping-ancestors'
        ? ('clippingAncestors' as const)
        : collisionBoundary
    const commonCollisionProps = { boundary, padding: collisionPadding }
    const avoidSide = collisionAvoidance.side || 'flip'
    const avoidAlign = collisionAvoidance.align || 'flip'
    const fallbackAxisSide = collisionAvoidance.fallbackAxisSide || 'end'
    const arrow = arrowElement.value

    const middleware: (Middleware | null)[] = [
      inlineMiddleware,
      offset((state) => {
        const data = getOffsetData(state, sideParamValue, rtl)
        const mainAxis =
          sideOffsetValue instanceof Function ? sideOffsetValue(data) : sideOffsetValue
        const crossAxis =
          alignOffsetValue instanceof Function ? alignOffsetValue(data) : alignOffsetValue
        return { mainAxis, crossAxis, alignmentAxis: crossAxis }
      })
    ]

    const flipMw =
      avoidSide === 'none'
        ? null
        : flip({
            ...commonCollisionProps,
            padding: {
              top: collisionPadding.top + bias + biasTop,
              right: collisionPadding.right + bias + biasRight,
              bottom: collisionPadding.bottom + bias + biasBottom,
              left: collisionPadding.left + bias + biasLeft
            },
            mainAxis: !shiftCrossAxis && avoidSide === 'flip',
            crossAxis: avoidAlign === 'flip' ? 'alignment' : false,
            fallbackAxisSideDirection: fallbackAxisSide
          })

    const shiftDisabled = avoidAlign === 'none' && avoidSide !== 'shift'
    const crossAxisShiftEnabled =
      !shiftDisabled && (sticky || shiftCrossAxis || avoidSide === 'shift')

    const shiftMw = shiftDisabled
      ? null
      : shift({
          ...commonCollisionProps,
          rootBoundary: shiftRootBoundary,
          mainAxis: avoidAlign !== 'none',
          crossAxis: crossAxisShiftEnabled,
          limiter:
            sticky || shiftCrossAxis
              ? undefined
              : limitShift((limitData) => {
                  if (!arrow) return {}
                  const { width, height } = arrow.getBoundingClientRect()
                  const sAxis = getSideAxis(limitData.placement)
                  const arrowSize = sAxis === 'y' ? width : height
                  const offsetAmount =
                    sAxis === 'y'
                      ? collisionPadding.left + collisionPadding.right
                      : collisionPadding.top + collisionPadding.bottom
                  return { offset: arrowSize / 2 + offsetAmount / 2 }
                })
        })

    if (avoidSide === 'shift' || avoidAlign === 'shift' || alignParam === 'center') {
      middleware.push(shiftMw, flipMw)
    } else {
      middleware.push(flipMw, shiftMw)
    }

    middleware.push(
      size({
        ...commonCollisionProps,
        apply({ elements: { floating: applyFloating }, availableWidth, availableHeight, rects }) {
          const floatingStyle = applyFloating.style
          floatingStyle.setProperty('--available-width', `${availableWidth}px`)
          floatingStyle.setProperty('--available-height', `${availableHeight}px`)

          const dpr = getDPR(applyFloating)
          const { x: rx, y: ry, width: rw, height: rh } = rects.reference
          const anchorWidth = (Math.round((rx + rw) * dpr) - Math.round(rx * dpr)) / dpr
          const anchorHeight = (Math.round((ry + rh) * dpr) - Math.round(ry * dpr)) / dpr
          floatingStyle.setProperty('--anchor-width', `${anchorWidth}px`)
          floatingStyle.setProperty('--anchor-height', `${anchorHeight}px`)
        }
      })
    )

    middleware.push(
      arrowMiddleware({
        element: arrow || floating.ownerDocument.createElement('div'),
        padding: arrowPadding
      })
    )

    middleware.push(
      transformOriginMiddleware({
        arrowElement: arrow,
        crossAxisShiftEnabled,
        getSideOffset: (state) =>
          sideOffsetValue instanceof Function
            ? sideOffsetValue(getOffsetData(state, sideParamValue, rtl))
            : sideOffsetValue
      }),
      hideMiddleware
    )

    if (adaptiveOriginEnabled) {
      middleware.push(adaptiveOriginMiddleware)
    }

    const currentGeneration = generation
    computePosition(anchor, floating, {
      placement: placementValue,
      strategy: positionMethod,
      middleware: middleware.filter((entry) => entry !== null)
    }).then((result) => {
      if (currentGeneration !== generation) return

      x.value = result.x
      y.value = result.y
      placement.value = result.placement
      anchorHidden.value = Boolean(result.middlewareData.hide?.referenceHidden)

      const adaptiveOrigin: AdaptiveOriginData | undefined = result.middlewareData.adaptiveOrigin
      adaptiveSideData.value = adaptiveOrigin ?? DEFAULT_ADAPTIVE_ORIGIN

      isPositioned.value = true

      if (lazyFlip) {
        mountSide.value = getSide(result.placement)
      }

      if (result.middlewareData.arrow) {
        arrowX.value = result.middlewareData.arrow.x
        arrowY.value = result.middlewareData.arrow.y
        arrowUncentered.value = result.middlewareData.arrow.centerOffset !== 0
      }
    })
  }

  watchPostEffect(() => {
    if (!activeAnchor.value || !activeFloating.value) return
    update()
  })

  watch(
    [activeAnchor, activeFloating, disableAnchorTracking],
    ([anchor, floating, disableTracking]) => {
      if (!anchor || !floating) {
        generation += 1
        isPositioned.value = false
        mountSide.value = null
        return
      }

      const autoUpdateOptions = {
        elementResize: !disableTracking,
        // jsdom has no IntersectionObserver, which autoUpdate's layoutShift tracking requires.
        layoutShift: !disableTracking && typeof IntersectionObserver !== 'undefined'
      }

      onWatcherCleanup(autoUpdate(anchor, floating, update, autoUpdateOptions))
    },
    { immediate: true, flush: 'post' }
  )

  return {
    anchorHidden,
    arrowX,
    arrowY,
    arrowUncentered,
    arrowElement,
    renderedSide,
    side,
    align,
    activeAnchor,
    activeFloating,
    positionerStyles,
    update
  }
}

export type AnchorPositioning = ReturnType<typeof useAnchorPositioning>
