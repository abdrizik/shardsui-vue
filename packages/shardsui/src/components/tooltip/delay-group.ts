import {
  computed,
  onScopeDispose,
  shallowRef,
  toValue,
  watch,
  type ComputedRef,
  type MaybeRefOrGetter,
  type ShallowRef
} from 'vue'
import { getDelay, type Delay } from '@/internal/floating/hover/predicates'
import type { HoverContext } from '@/internal/floating/types'
import { REASONS } from '@/internal/reasons'
import { useTimeout, type Timeout } from '@/internal/timeout'

type CurrentContext = {
  onOpenChange: (open: boolean, reason?: string, event?: Event) => void
  setIsInstantPhase: (value: boolean) => void
}

type DelayGroupOptions = {
  delay: MaybeRefOrGetter<Delay>
  timeoutMs: MaybeRefOrGetter<number>
}

export type DelayGroup = {
  delay: ShallowRef<Delay>
  initialDelay: Delay
  currentId: string | null
  currentContext: CurrentContext | null
  timeout: Timeout
  timeoutMs: ComputedRef<number>
}

export function useDelayGroup(options: DelayGroupOptions): DelayGroup {
  const initial = toValue(options.delay)

  const group: DelayGroup = {
    delay: shallowRef<Delay>(initial),
    initialDelay: initial,
    currentId: null,
    currentContext: null,
    timeout: useTimeout(),
    timeoutMs: computed(() => toValue(options.timeoutMs))
  }

  watch(
    () => toValue(options.delay),
    (delay) => {
      group.initialDelay = delay
      if (group.currentId == null) {
        group.delay.value = delay
        return
      }
      group.delay.value = {
        open: getDelay(group.delay.value, 'open'),
        close: getDelay(delay, 'close')
      }
    },
    { flush: 'pre' }
  )

  return group
}

type DelayGroupMemberOptions = {
  open: MaybeRefOrGetter<boolean>
  floatingId: MaybeRefOrGetter<string | undefined>
}

export function useDelayGroupMember(
  group: DelayGroup,
  tooltip: HoverContext,
  options: DelayGroupMemberOptions
) {
  const isInstantPhase = shallowRef(false)

  const open = computed(() => toValue(options.open))
  const floatingId = computed(() => toValue(options.floatingId))

  let latestOpen = false

  watch(
    () => [open.value, floatingId.value ?? null] as const,
    ([isOpen, currentId], _previous, onCleanup) => {
      latestOpen = isOpen

      if (!group.currentId || isOpen || group.currentId !== currentId) return

      const unset = () => {
        isInstantPhase.value = false
        group.currentContext?.setIsInstantPhase(false)
        group.currentId = null
        group.currentContext = null
        group.delay.value = group.initialDelay
        group.timeout.clear()
      }

      isInstantPhase.value = false

      if (!group.timeoutMs.value) {
        unset()
        return
      }

      group.timeout.start(group.timeoutMs.value, () => {
        if (tooltip.open.value || (group.currentId && group.currentId !== currentId)) {
          return
        }
        unset()
      })

      onCleanup(() => {
        if (group.currentId !== currentId) {
          group.timeout.clear()
        }
      })
    },
    { immediate: true, flush: 'post' }
  )

  watch(
    () => [open.value, floatingId.value ?? null] as const,
    ([isOpen, currentId]) => {
      if (!isOpen) return

      const prevContext = group.currentContext
      const prevId = group.currentId

      group.timeout.clear()
      group.currentContext = {
        onOpenChange: (openValue, reason, event) => tooltip.setOpen(openValue, reason, event),
        setIsInstantPhase: (value) => {
          isInstantPhase.value = value
        }
      }
      group.currentId = currentId
      group.delay.value = {
        open: 0,
        close: getDelay(group.initialDelay, 'close') ?? 0
      }

      const tookOverFromAnotherTrigger = prevId !== null && prevId !== currentId
      isInstantPhase.value = tookOverFromAnotherTrigger
      prevContext?.setIsInstantPhase(tookOverFromAnotherTrigger)
      if (tookOverFromAnotherTrigger) {
        prevContext?.onOpenChange(false, REASONS.none)
      }
    },
    { immediate: true, flush: 'post' }
  )

  onScopeDispose(() => {
    const closingId = floatingId.value ?? null
    if (group.currentId !== closingId) return

    group.currentContext = null
    if (!latestOpen) return

    group.currentId = null
    group.delay.value = group.initialDelay
    group.timeout.clear()
  })

  return { isInstantPhase }
}
