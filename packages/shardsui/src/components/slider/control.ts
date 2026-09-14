import { onScopeDispose, watchPostEffect } from 'vue'
import { createAnimationFrame } from '@/internal/animation-frame'
import { clamp } from '@/internal/clamp'
import { DirectionContext } from '@/internal/direction-context'
import { contains, getComputedStyle, getTarget, isElement } from '@/internal/dom'
import { safelyChangePointerCapture } from '@/internal/swipe-dismiss'
import {
  getControlOffset,
  getMidpoint,
  resolveThumbCollision,
  roundValueToStep,
  validateMinimumDistance,
  type ResolveThumbCollisionResult
} from './math'
import type { SliderRoot } from './slider'

// Pointer moves a press must survive before it counts as a drag rather than jitter during a click.
const INTENTIONAL_DRAG_COUNT_THRESHOLD = 2

type PressedThumb = { index: number; element: HTMLElement }

export function useSliderControl(slider: SliderRoot) {
  const direction = DirectionContext.get()

  let computedStyles: CSSStyleDeclaration | null = null

  let pressedThumbIndex = -1
  let pressedThumbCenterOffset = 0
  let pressedValues: readonly number[] | null = null
  let currentInteractionValue: number | number[] | null = null
  let latestValues: readonly number[] = []
  let touchId: number | null = null
  let insetThumbOffset = 0
  let moveCount = 0

  const focusFrame = createAnimationFrame()

  function fingerCoordsFromTouch(event: TouchEvent): { x: number; y: number } | null {
    if (touchId == null) return null
    for (let i = 0; i < event.changedTouches.length; i++) {
      const touch = event.changedTouches[i]
      if (touch.identifier === touchId) {
        return { x: touch.clientX, y: touch.clientY }
      }
    }
    return null
  }

  function thumbContaining(target: EventTarget | null): PressedThumb | null {
    if (!isElement(target)) return null
    const thumbs = slider.thumbElements.value
    const index = thumbs.findIndex((element) => contains(element, target))
    return index === -1 ? null : { index, element: thumbs[index] }
  }

  function measureValueAtFinger(control: HTMLElement, fingerX: number, fingerY: number): number {
    const vertical = slider.orientation.value === 'vertical'
    const { width, height, bottom, left, right } = control.getBoundingClientRect()
    const controlOffset = getControlOffset(computedStyles, vertical)
    const controlSize =
      (vertical ? height : width) - controlOffset.start - controlOffset.end - insetThumbOffset * 2
    const adjustedX = fingerX - pressedThumbCenterOffset
    const adjustedY = fingerY - pressedThumbCenterOffset

    let distanceFromStart: number
    if (vertical) distanceFromStart = bottom - adjustedY - controlOffset.end
    else if (direction.direction.value === 'rtl')
      distanceFromStart = right - adjustedX - controlOffset.start
    else distanceFromStart = adjustedX - left - controlOffset.start

    const ratio = clamp((distanceFromStart - insetThumbOffset) / controlSize, 0, 1)

    const value = roundValueToStep(
      (slider.max.value - slider.min.value) * ratio + slider.min.value,
      slider.step.value,
      slider.min.value
    )
    return clamp(value, slider.min.value, slider.max.value)
  }

  function fingerState(fingerX: number, fingerY: number): ResolveThumbCollisionResult | null {
    const control = slider.controlElement.value
    const values = slider.values.value
    if (!control || pressedThumbIndex < 0 || pressedThumbIndex >= values.length) {
      if (pressedThumbIndex >= values.length) {
        currentInteractionValue = null
      }
      return null
    }

    const nextValue = measureValueAtFinger(control, fingerX, fingerY)

    if (values.length <= 1) {
      return { value: nextValue, thumbIndex: pressedThumbIndex, didSwap: false }
    }

    return resolveThumbCollision({
      behavior: slider.thumbCollisionBehavior.value,
      values,
      currentValues: latestValues,
      initialValues: pressedValues,
      pressedIndex: pressedThumbIndex,
      nextValue,
      min: slider.min.value,
      max: slider.max.value,
      step: slider.step.value,
      minStepsBetweenValues: slider.minStepsBetweenValues.value
    })
  }

  function closestThumb(fingerX: number, fingerY: number): number {
    const vertical = slider.orientation.value === 'vertical'
    const coord = vertical ? fingerY : fingerX
    const thumbs = slider.thumbElements.value
    let minDistance: number | undefined
    let closestIndex = -1

    for (let i = 0; i < thumbs.length; i++) {
      if (slider.getThumbInput(i)?.disabled) continue

      const distance = Math.abs(coord - getMidpoint(thumbs[i], vertical))
      if (minDistance === undefined || distance <= minDistance) {
        closestIndex = i
        minDistance = distance
      }
    }

    return closestIndex
  }

  function focusThumb(index: number): void {
    slider.getThumbInput(index)?.focus({
      preventScroll: true,
      focusVisible: false
    } as FocusOptions)
  }

  function firstThumbAtMax(index: number): number {
    const values = slider.values.value
    if (values[index] !== slider.max.value) return index
    let candidate = index
    while (candidate > 0 && values[candidate - 1] === slider.max.value) candidate -= 1
    return candidate
  }

  function measureInsetThumbOffset(thumbIndex: number): number {
    const thumbElement = slider.thumbElements.value[thumbIndex]
    if (!slider.inset.value || !thumbElement) return 0
    const thumbRect = thumbElement.getBoundingClientRect()
    return (slider.orientation.value === 'vertical' ? thumbRect.height : thumbRect.width) / 2
  }

  function setPressedThumb(index: number): void {
    pressedThumbIndex = index
    if (!slider.thumbElements.value[index]) pressedThumbCenterOffset = 0
  }

  function startPressing(fingerX: number, fingerY: number): void {
    const values = slider.values.value
    pressedValues = values.length > 1 ? values : null
    currentInteractionValue = null
    latestValues = values

    setPressedThumb(
      pressedThumbIndex > -1 && pressedThumbIndex < values.length
        ? firstThumbAtMax(pressedThumbIndex)
        : closestThumb(fingerX, fingerY)
    )

    insetThumbOffset = measureInsetThumbOffset(pressedThumbIndex)
  }

  function applyFingerValue(finger: ResolveThumbCollisionResult): void {
    const applied = slider.setValue(finger.value)

    if (applied) {
      currentInteractionValue = finger.value
      latestValues = Array.isArray(finger.value) ? finger.value : [finger.value]

      if (finger.didSwap) {
        setPressedThumb(finger.thumbIndex)
        focusThumb(finger.thumbIndex)
      }
    }
  }

  function move(fingerX: number, fingerY: number): void {
    moveCount += 1

    const finger = fingerState(fingerX, fingerY)
    if (!finger) return

    if (
      validateMinimumDistance(finger.value, slider.step.value, slider.minStepsBetweenValues.value)
    ) {
      if (!slider.dragging.value && moveCount > INTENTIONAL_DRAG_COUNT_THRESHOLD) {
        slider.dragging.value = true
      }
      applyFingerValue(finger)
    }
  }

  function onPointermove(event: PointerEvent): void {
    if (event.buttons === 0) {
      endDrag(event)
      return
    }
    move(event.clientX, event.clientY)
  }

  function onTouchmove(event: TouchEvent): void {
    const coords = fingerCoordsFromTouch(event)
    if (!coords) return
    move(coords.x, coords.y)
  }

  function endDrag(event: PointerEvent | TouchEvent): void {
    const control = slider.controlElement.value
    slider.setActive(-1)
    slider.dragging.value = false
    if (
      Array.isArray(currentInteractionValue) &&
      currentInteractionValue.length !== slider.values.value.length
    ) {
      currentInteractionValue = null
    }
    if (currentInteractionValue != null) {
      slider.commitValue(currentInteractionValue)
    }
    resetPressedThumb()

    if ('pointerId' in event && control?.hasPointerCapture(event.pointerId)) {
      control.releasePointerCapture(event.pointerId)
    }
    touchId = null
    stopListening()
  }

  function stopListening(): void {
    const doc = slider.controlElement.value?.ownerDocument ?? document
    doc.removeEventListener('pointermove', onPointermove)
    doc.removeEventListener('pointerup', endDrag)
    doc.removeEventListener('touchmove', onTouchmove)
    doc.removeEventListener('touchend', endDrag)
    pressedValues = null
    currentInteractionValue = null
  }

  function resetPressedThumb(): void {
    pressedThumbIndex = -1
    pressedThumbCenterOffset = 0
  }

  function setThumbCenterOffset(thumbElement: HTMLElement, x: number, y: number): void {
    const vertical = slider.orientation.value === 'vertical'
    pressedThumbCenterOffset = (vertical ? y : x) - getMidpoint(thumbElement, vertical)
  }

  function onPointerdown(event: PointerEvent): void {
    const control = slider.controlElement.value
    const target = getTarget(event)

    if (
      !control ||
      slider.disabled.value ||
      event.defaultPrevented ||
      !isElement(target) ||
      event.button !== 0
    ) {
      return
    }

    const pressedThumb = thumbContaining(target)

    if (pressedThumb && slider.getThumbInput(pressedThumb.index)?.disabled) {
      resetPressedThumb()
      return
    }

    if (pressedThumb) {
      pressedThumbIndex = pressedThumb.index
      setThumbCenterOffset(pressedThumb.element, event.clientX, event.clientY)
    }

    startPressing(event.clientX, event.clientY)

    const finger = fingerState(event.clientX, event.clientY)
    if (!finger) return

    const focusedThumb = slider.thumbElements.value[finger.thumbIndex]
    if (contains(focusedThumb, control.ownerDocument.activeElement)) {
      event.preventDefault()
    } else {
      focusFrame.request(() => focusThumb(finger.thumbIndex))
    }

    slider.dragging.value = true

    if (!pressedThumb) {
      applyFingerValue(finger)
    }

    if (event.pointerId) {
      safelyChangePointerCapture(control, event.pointerId, 'setPointerCapture')
    }

    moveCount = 0
    const doc = control.ownerDocument
    doc.addEventListener('pointermove', onPointermove, { passive: true })
    doc.addEventListener('pointerup', endDrag, { once: true })
  }

  function onTouchstart(event: TouchEvent): void {
    if (slider.disabled.value) return

    const touchedThumb = thumbContaining(getTarget(event))
    if (touchedThumb && slider.getThumbInput(touchedThumb.index)?.disabled) {
      resetPressedThumb()
      return
    }

    const touch = event.changedTouches[0]
    if (touch == null) return

    touchId = touch.identifier

    startPressing(touch.clientX, touch.clientY)

    const finger = fingerState(touch.clientX, touch.clientY)
    if (!finger) return

    focusThumb(finger.thumbIndex)
    applyFingerValue(finger)

    moveCount = 0
    const doc = slider.controlElement.value?.ownerDocument ?? document
    doc.addEventListener('touchmove', onTouchmove, { passive: true })
    doc.addEventListener('touchend', endDrag, { passive: true })
  }

  onScopeDispose(focusFrame.cancel)

  onScopeDispose(stopListening)

  watchPostEffect(() => {
    if (slider.disabled.value) stopListening()
  })

  function publishControlElement(node: HTMLElement): () => void {
    computedStyles = getComputedStyle(node)
    slider.controlElement.value = node
    node.addEventListener('touchstart', onTouchstart, { passive: true })

    return () => {
      node.removeEventListener('touchstart', onTouchstart)
      slider.controlElement.value = null
      computedStyles = null
    }
  }

  return {
    publishControlElement,
    onPointerdown
  }
}
