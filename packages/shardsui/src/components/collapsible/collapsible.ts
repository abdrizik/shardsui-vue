import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { useTransitionStatus, type TransitionStatus } from '@/internal/transition-status'

export type CollapsibleState = {
  open: boolean
  disabled: boolean
  transitionStatus: TransitionStatus
}

type CollapsibleRootOptions = {
  open: MaybeRefOrGetter<boolean>
  setOpen: (open: boolean) => void
  disabled: MaybeRefOrGetter<boolean>
}

export function useCollapsibleRoot(options: CollapsibleRootOptions) {
  const open = computed(() => toValue(options.open))
  const disabled = computed(() => toValue(options.disabled))

  const transition = useTransitionStatus({
    open,
    idle: true
  })

  const panelId = shallowRef<string | undefined>(undefined)

  const state = computed<CollapsibleState>(() => ({
    open: open.value,
    disabled: disabled.value,
    transitionStatus: transition.status.value
  }))

  const stateAttrs = computed(() =>
    dataAttrs({
      open: open.value,
      closed: !open.value,
      disabled: disabled.value
    })
  )

  function setOpen(next: boolean) {
    options.setOpen(next)
  }

  function toggle() {
    setOpen(!open.value)
  }

  function setMounted(next: boolean) {
    transition.mounted.value = next
  }

  return {
    open,
    disabled,
    mounted: transition.mounted,
    transitionStatus: transition.status,
    panelId,
    state,
    stateAttrs,
    setOpen,
    toggle,
    setMounted
  }
}

export type CollapsibleRoot = ReturnType<typeof useCollapsibleRoot>
