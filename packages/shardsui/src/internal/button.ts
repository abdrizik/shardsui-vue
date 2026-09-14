import { computed, toValue, type ComputedRef, type MaybeRefOrGetter } from 'vue'
import { dispatchClickWithModifiers } from './dispatch-click-with-modifiers'
import { makeEventPreventable } from './event-preventable'

type Handler<E extends Event> = { handle(event: E): void }['handle']

export type ButtonOptions = {
  disabled?: MaybeRefOrGetter<boolean | undefined>
  focusableWhenDisabled?: MaybeRefOrGetter<boolean | undefined>
  composite?: MaybeRefOrGetter<boolean | undefined>
  as?: MaybeRefOrGetter<keyof HTMLElementTagNameMap | undefined>
  tabindex?: MaybeRefOrGetter<number | null | undefined>
  onClick?: () => Handler<MouseEvent> | null | undefined
  onMousedown?: () => Handler<MouseEvent> | null | undefined
  onKeydown?: () => Handler<KeyboardEvent> | null | undefined
  onKeyup?: () => Handler<KeyboardEvent> | null | undefined
  onPointerdown?: () => Handler<PointerEvent> | null | undefined
}

export type ButtonAttrs = {
  type?: 'button' | undefined
  role?: 'button' | undefined
  tabindex?: number | undefined
  'aria-disabled'?: 'true' | 'false' | undefined
  disabled?: true | undefined
  onClick: (event: MouseEvent) => void
  onMousedown: (event: MouseEvent) => void
  onKeydown: (event: KeyboardEvent) => void
  onKeyup: (event: KeyboardEvent) => void
  onPointerdown: (event: PointerEvent) => void
}

export function useButton(options: ButtonOptions): { attrs: ComputedRef<ButtonAttrs> } {
  const disabled = computed(() => toValue(options.disabled) ?? false)
  const focusableWhenDisabled = computed(() => toValue(options.focusableWhenDisabled))
  const composite = computed(() => toValue(options.composite) ?? false)
  const native = computed(() => (toValue(options.as) ?? 'button') === 'button')

  const onClick = (event: MouseEvent) => {
    if (disabled.value) {
      event.preventDefault()
      return
    }
    options.onClick?.()?.(event)
  }

  const onMousedown = (event: MouseEvent) => {
    if (disabled.value) return
    options.onMousedown?.()?.(event)
  }

  const onKeydown = (nativeEvent: KeyboardEvent) => {
    const el = nativeEvent.currentTarget as HTMLElement

    if (disabled.value) {
      if (focusableWhenDisabled.value && nativeEvent.key !== 'Tab') {
        nativeEvent.preventDefault()
      }
      return
    }

    const event = makeEventPreventable(nativeEvent)
    options.onKeydown?.()?.(event)
    if (event.shardsUIHandlerPrevented) return

    const isCurrentTarget = event.target === el
    const isLink = el instanceof HTMLAnchorElement && Boolean(el.href)
    const isEnterKey = event.key === 'Enter'
    const isSpaceKey = event.key === ' '

    if (isCurrentTarget && composite.value && isSpaceKey) {
      const role = el.getAttribute('role')
      const isTextNavigationRole =
        role?.startsWith('menuitem') || role === 'option' || role === 'gridcell'
      if (event.defaultPrevented && isTextNavigationRole) return
      event.preventDefault()
      event.preventShardsUIHandler()
      dispatchClickWithModifiers(el, event)
      return
    }

    if (!native.value && isCurrentTarget && !isLink) {
      if (event.defaultPrevented) return
      if (isSpaceKey || isEnterKey) {
        event.preventDefault()
      }
      if (isEnterKey) {
        event.preventShardsUIHandler()
        dispatchClickWithModifiers(el, event)
      }
      return
    }
    if (isCurrentTarget && isLink && isSpaceKey) {
      event.preventDefault()
    }
  }

  const onKeyup = (nativeEvent: KeyboardEvent) => {
    const el = nativeEvent.currentTarget as HTMLElement

    if (disabled.value) return

    const event = makeEventPreventable(nativeEvent)
    options.onKeyup?.()?.(event)

    if (event.target === el && native.value && composite.value && event.key === ' ') {
      event.preventDefault()
      return
    }

    if (event.shardsUIHandlerPrevented) return

    if (
      event.target === el &&
      !native.value &&
      !composite.value &&
      !event.defaultPrevented &&
      event.key === ' '
    ) {
      event.preventShardsUIHandler()
      dispatchClickWithModifiers(el, event)
    }
  }

  const onPointerdown = (event: PointerEvent) => {
    if (disabled.value) {
      event.preventDefault()
      return
    }
    options.onPointerdown?.()?.(event)
  }

  const attrs = computed<ButtonAttrs>(() => {
    const exposesAriaDisabled = native.value
      ? (focusableWhenDisabled.value ?? composite.value)
      : disabled.value
    const exposesDisabled = native.value && !focusableWhenDisabled.value

    let tabindex: number | undefined
    if (!composite.value) {
      const requested = toValue(options.tabindex)
      if (requested === undefined) {
        const untabbable = !native.value && disabled.value && !focusableWhenDisabled.value
        tabindex = untabbable ? -1 : 0
      } else if (requested !== null) {
        tabindex = requested
      }
    }

    return {
      type: native.value ? 'button' : undefined,
      role: native.value ? undefined : 'button',
      tabindex,
      'aria-disabled': exposesAriaDisabled ? (disabled.value ? 'true' : 'false') : undefined,
      disabled: exposesDisabled && disabled.value ? true : undefined,
      onClick,
      onMousedown,
      onKeydown,
      onKeyup,
      onPointerdown
    }
  })

  return { attrs }
}
