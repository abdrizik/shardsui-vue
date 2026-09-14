import { DEV } from 'esm-env'
import type { Ref } from 'vue'
import { createAnimationFrame, type AnimationFrame } from './animation-frame'
import { warn } from './log'
import type { PopupTriggerMap } from './popup-trigger-map'
import { REASONS } from './reasons'

export type TriggerMapState = {
  open: Readonly<Ref<boolean>>
  attached: Readonly<Ref<boolean>>
  triggerElements: PopupTriggerMap
  setOpen: (
    open: boolean,
    reason: typeof REASONS.imperativeAction,
    event?: Event,
    trigger?: HTMLElement | null
  ) => unknown
}

export type MenuLikeState = TriggerMapState & {
  triggerElement: Ref<HTMLElement | null>
}

export type RootRegistrations<Registration> = {
  add: (registration: Registration) => () => void
}

export function createRootRegistrations<Registration>(
  componentName: string,
  onActiveChange: (registration: Registration | null) => void
): RootRegistrations<Registration> {
  const entries: Registration[] = []
  let overlapFrame: AnimationFrame | undefined

  return {
    add(registration) {
      entries.push(registration)

      if (DEV && entries.length > 1) {
        overlapFrame ??= createAnimationFrame()
        overlapFrame.request(() => {
          if (entries.length > 1) {
            warn(
              `A ${componentName} handle is attached to more than one mounted root at the same time.`,
              'The most recently mounted root takes over and the previous one stops being controlled by the handle.',
              'A handle should be used by a single root that stays mounted for the lifetime of the handle.'
            )
          }
        })
      }

      return () => {
        const index = entries.lastIndexOf(registration)
        if (index === -1) return
        entries.splice(index, 1)
        if (entries.length <= 1) overlapFrame?.cancel()
        onActiveChange(entries[entries.length - 1] ?? null)
      }
    }
  }
}

export type DetachedHandle<
  State extends TriggerMapState,
  TriggerId extends string | null = string
> = {
  readonly state: State
  readonly isOpen: boolean
  open: (triggerId: TriggerId) => void
  close: () => void
}

export type DetachedHandleOptions<State extends TriggerMapState> = {
  state: () => State
  componentName: string
  throwOnMissingTrigger?: boolean
}

function createDetachedHandleCore<State extends TriggerMapState>(
  options: DetachedHandleOptions<State> & {
    openWithTrigger: (state: State, trigger: HTMLElement | null) => void
  }
) {
  const { state, componentName, openWithTrigger, throwOnMissingTrigger = true } = options

  const open = (triggerId: string | null | undefined): void => {
    const current = state()
    if (!current.attached.value) {
      warn(
        `${componentName}Handle.open() was called while no root using this handle is mounted.`,
        'The call was ignored; mount a root with this handle before opening it imperatively.'
      )
      return
    }

    const trigger = triggerId ? (current.triggerElements.getById(triggerId) ?? null) : null

    if (triggerId && !trigger) {
      if (throwOnMissingTrigger) {
        throw new Error(
          `ShardsUI: ${componentName}Handle.open: No trigger found with id "${triggerId}". ` +
            'An anchored popup cannot open without a trigger to anchor to. Pass the id of a mounted ' +
            `${componentName}.Trigger that has this handle set on its "handle" prop.`
        )
      }
      warn(
        `${componentName}Handle.open: No trigger found with id "${triggerId}".`,
        'The popup will open, but the trigger will not be associated with it.'
      )
    }

    openWithTrigger(current, trigger)
  }

  const close = (): void => {
    const current = state()
    if (!current.attached.value) {
      warn(
        `${componentName}Handle.close() was called while no root using this handle is mounted.`,
        'The call was ignored.'
      )
      return
    }
    current.setOpen(false, REASONS.imperativeAction)
  }

  return { open, close }
}

export function createTriggerMapHandle<State extends TriggerMapState>(
  options: DetachedHandleOptions<State>
): DetachedHandle<State> {
  const { state } = options
  const { open, close } = createDetachedHandleCore({
    ...options,
    openWithTrigger(current, trigger) {
      current.setOpen(true, REASONS.imperativeAction, undefined, trigger)
    }
  })

  return {
    get state() {
      return state()
    },
    get isOpen() {
      return state().open.value
    },
    open,
    close
  }
}

export function createMenuLikeHandle<
  State extends MenuLikeState,
  TriggerId extends string | null = string
>(options: DetachedHandleOptions<State>): DetachedHandle<State, TriggerId> {
  const { state } = options
  const { open, close } = createDetachedHandleCore({
    ...options,
    openWithTrigger(current, trigger) {
      current.triggerElement.value = trigger
      current.setOpen(true, REASONS.imperativeAction)
    }
  })

  return {
    get state() {
      return state()
    },
    get isOpen() {
      return state().open.value
    },
    open,
    close
  }
}
