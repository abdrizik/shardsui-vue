import {
  computed,
  onWatcherCleanup,
  shallowRef,
  toValue,
  watchPostEffect,
  type ComputedRef,
  type MaybeRefOrGetter
} from 'vue'
import { clamp } from '@/internal/clamp'
import type { DrawerSnapPoint } from './drawer'

type ResolvedDrawerSnapPoint = {
  value: DrawerSnapPoint
  height: number
  offset: number
}

function resolveSnapPointValue(
  snapPoint: DrawerSnapPoint,
  viewportHeight: number,
  rootFontSize: number
): number | null {
  if (!Number.isFinite(viewportHeight) || viewportHeight <= 0) return null

  if (typeof snapPoint === 'number') {
    if (!Number.isFinite(snapPoint)) return null
    if (snapPoint <= 1) return clamp(snapPoint, 0, 1) * viewportHeight
    return snapPoint
  }

  const trimmed = snapPoint.trim()
  if (trimmed.endsWith('px')) {
    const value = Number.parseFloat(trimmed)
    return Number.isFinite(value) ? value : null
  }
  if (trimmed.endsWith('rem')) {
    const value = Number.parseFloat(trimmed)
    return Number.isFinite(value) ? value * rootFontSize : null
  }

  return null
}

/** Snap point whose offset is nearest to `offset`. `points` must not be empty. */
export function findClosestSnapPoint<T extends { offset: number }>(
  points: T[],
  offset: number
): { point: T; index: number } {
  let index = 0
  let closestDistance = Math.abs(offset - points[0]!.offset)
  for (let i = 1; i < points.length; i += 1) {
    const distance = Math.abs(offset - points[i]!.offset)
    if (distance < closestDistance) {
      closestDistance = distance
      index = i
    }
  }
  return { point: points[index]!, index }
}

type DrawerSnapPointsOptions = {
  viewportElement: MaybeRefOrGetter<HTMLElement | null>
  snapPoints: MaybeRefOrGetter<DrawerSnapPoint[] | undefined>
  activeSnapPoint: MaybeRefOrGetter<DrawerSnapPoint | null>
  popupHeight: MaybeRefOrGetter<number>
}

export type DrawerSnapPoints = {
  resolvedSnapPoints: ComputedRef<ResolvedDrawerSnapPoint[]>
  activeSnapPointOffset: ComputedRef<number | null>
}

export function useDrawerSnapPoints(options: DrawerSnapPointsOptions): DrawerSnapPoints {
  const viewportHeight = shallowRef(0)
  const rootFontSize = shallowRef(16)

  const viewportElement = computed(() => toValue(options.viewportElement))

  const resolvedSnapPoints = computed<ResolvedDrawerSnapPoint[]>(() => {
    const snapPoints = toValue(options.snapPoints)
    const popupHeight = toValue(options.popupHeight)
    const height = viewportHeight.value
    const fontSize = rootFontSize.value

    if (!snapPoints || snapPoints.length === 0 || height <= 0 || popupHeight <= 0) {
      return []
    }

    const maxHeight = Math.min(popupHeight, height)

    const resolved = snapPoints
      .map((value): ResolvedDrawerSnapPoint | null => {
        const resolvedHeight = resolveSnapPointValue(value, height, fontSize)
        if (resolvedHeight === null) return null
        const clampedHeight = clamp(resolvedHeight, 0, maxHeight)
        return {
          value,
          height: clampedHeight,
          offset: Math.max(0, popupHeight - clampedHeight)
        }
      })
      .filter((point): point is ResolvedDrawerSnapPoint => Boolean(point))

    if (resolved.length <= 1) return resolved

    const deduped: ResolvedDrawerSnapPoint[] = []
    const seenHeights: number[] = []
    for (let index = resolved.length - 1; index >= 0; index -= 1) {
      const point = resolved[index]!
      const isDuplicate = seenHeights.some((height) => Math.abs(height - point.height) <= 1)
      if (isDuplicate) continue
      seenHeights.push(point.height)
      deduped.push(point)
    }
    deduped.reverse()
    return deduped
  })

  const resolvedActiveSnapPoint = computed<ResolvedDrawerSnapPoint | undefined>(() => {
    const activeSnapPoint = toValue(options.activeSnapPoint)
    const popupHeight = toValue(options.popupHeight)
    const height = viewportHeight.value
    const fontSize = rootFontSize.value
    const points = resolvedSnapPoints.value

    if (activeSnapPoint === null || points.length === 0) return undefined

    const exactMatch = points.find((point) => Object.is(point.value, activeSnapPoint))
    if (exactMatch) return exactMatch

    const maxHeight = Math.min(popupHeight, height)
    const resolvedHeight = resolveSnapPointValue(activeSnapPoint, height, fontSize)
    if (resolvedHeight === null) return undefined
    const clampedHeight = clamp(resolvedHeight, 0, maxHeight)
    return findClosestSnapPoint(points, popupHeight - clampedHeight).point
  })

  const activeSnapPointOffset = computed(() => resolvedActiveSnapPoint.value?.offset ?? null)

  function measure(): void {
    const element = viewportElement.value
    const html = (element?.ownerDocument ?? globalThis.document).documentElement

    viewportHeight.value = element ? element.offsetHeight : html.clientHeight

    const fontSize = Number.parseFloat(getComputedStyle(html).fontSize)
    if (Number.isFinite(fontSize)) rootFontSize.value = fontSize
  }

  watchPostEffect(() => {
    const element = viewportElement.value
    measure()

    if (!element) return
    const observer = new ResizeObserver(() => measure())
    observer.observe(element)
    onWatcherCleanup(() => observer.disconnect())
  })

  return { resolvedSnapPoints, activeSnapPointOffset }
}
