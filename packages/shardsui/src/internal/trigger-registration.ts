import {
  computed,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type Ref,
  type ShallowRef
} from 'vue'
import type { PopupTriggerMap } from './popup-trigger-map'

type TriggerRegistrationHost<Bindings> = {
  open: Readonly<Ref<boolean>>
  mounted: Readonly<Ref<boolean>>
  activeTriggerId: Readonly<Ref<string | null>>
  setActiveTriggerId: (id: string | null) => void
  triggerElement: ShallowRef<HTMLElement | null>
  triggerElements: PopupTriggerMap<Bindings>
}

type TriggerRegistrationOptions<Bindings> = {
  id: MaybeRefOrGetter<string>
  ref: MaybeRefOrGetter<HTMLElement | null>
  root: TriggerRegistrationHost<Bindings>
  bindings: () => Bindings
  apply: (bindings: Bindings) => void
}

export type TriggerRegistration = {
  isTriggerActive: ComputedRef<boolean>
  isActiveOpen: ComputedRef<boolean>
  isMountedByThisTrigger: ComputedRef<boolean>
}

export function useTriggerRegistration<Bindings>(
  options: TriggerRegistrationOptions<Bindings>
): TriggerRegistration {
  const root = options.root

  const id = computed(() => toValue(options.id))
  const ref = computed(() => toValue(options.ref))

  const isTriggerActive = computed(() => root.activeTriggerId.value === id.value)
  const isActiveOpen = computed(() => root.open.value && isTriggerActive.value)
  const isMountedByThisTrigger = computed(() => isTriggerActive.value && root.mounted.value)

  watch(
    () => [ref.value, id.value] as const,
    ([element, triggerId], _previous, onCleanup) => {
      if (!element) return
      onCleanup(root.triggerElements.add(triggerId, element, options.bindings))
    },
    { immediate: true, flush: 'sync' }
  )

  watch(
    () => [ref.value, id.value, root.activeTriggerId.value, root.open.value] as const,
    ([element, triggerId, activeTriggerId, open]) => {
      if (!element) return

      if (activeTriggerId === triggerId) {
        root.triggerElement.value = element
        if (open) options.apply(options.bindings())
      } else if (activeTriggerId == null && open) {
        root.setActiveTriggerId(triggerId)
        root.triggerElement.value = element
        options.apply(options.bindings())
      }
    },
    { immediate: true, flush: 'post' }
  )

  watch(
    () => [isMountedByThisTrigger.value, ref.value, options.bindings()] as const,
    ([mountedByThisTrigger, element, bindings]) => {
      if (!mountedByThisTrigger) return
      if (element) root.triggerElement.value = element
      options.apply(bindings)
    },
    { immediate: true, flush: 'pre' }
  )

  return { isTriggerActive, isActiveOpen, isMountedByThisTrigger }
}
