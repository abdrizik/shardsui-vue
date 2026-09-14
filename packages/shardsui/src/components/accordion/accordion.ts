import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { useCollapsibleRoot } from '@/components/collapsible/collapsible'
import { dataAttrs } from '@/internal/data-attrs'
import type { TransitionStatus } from '@/internal/transition-status'

export type AccordionRootState<Value = unknown> = {
  value: Value[]
  disabled: boolean
}

export type AccordionItemState<Value = unknown> = AccordionRootState<Value> & {
  hidden: boolean
  open: boolean
}

export type AccordionPanelState = AccordionItemState & {
  transitionStatus: TransitionStatus
}

type AccordionRootOptions<Value = unknown> = {
  value: MaybeRefOrGetter<Value[]>
  setValue: (value: Value[]) => void
  disabled: MaybeRefOrGetter<boolean>
  hiddenUntilFound: MaybeRefOrGetter<boolean>
  keepMounted: MaybeRefOrGetter<boolean>
  multiple: MaybeRefOrGetter<boolean>
}

export function useAccordionRoot<Value = unknown>(options: AccordionRootOptions<Value>) {
  const value = computed(() => toValue(options.value))
  const disabled = computed(() => toValue(options.disabled))
  const hiddenUntilFound = computed(() => toValue(options.hiddenUntilFound))
  const keepMounted = computed(() => toValue(options.keepMounted))

  const state = computed<AccordionRootState<Value>>(() => ({
    value: value.value,
    disabled: disabled.value
  }))

  function setItemOpen(itemValue: Value, nextOpen: boolean) {
    const current = toValue(options.value)

    let next: Value[]
    if (!toValue(options.multiple)) {
      next = current[0] === itemValue ? [] : [itemValue]
    } else if (nextOpen) {
      next = [...current, itemValue]
    } else {
      next = current.filter((existing) => existing !== itemValue)
    }

    options.setValue(next)
  }

  return { value, disabled, hiddenUntilFound, keepMounted, state, setItemOpen }
}

export type AccordionRoot<Value = unknown> = ReturnType<typeof useAccordionRoot<Value>>

type AccordionItemOptions = {
  uid: MaybeRefOrGetter<string>
  accordion: AccordionRoot
  value: MaybeRefOrGetter<unknown>
  disabled: MaybeRefOrGetter<boolean>
  onOpenChange?: (open: boolean) => void
}

export function useAccordionItem(options: AccordionItemOptions) {
  const triggerId = shallowRef<string | undefined>(undefined)

  const value = computed(() => toValue(options.value) ?? toValue(options.uid))
  const disabled = computed(() => toValue(options.disabled) || options.accordion.disabled.value)
  const open = computed(() => options.accordion.value.value.includes(value.value))

  const collapsible = useCollapsibleRoot({
    open,
    setOpen: (next) => {
      options.onOpenChange?.(next)
      options.accordion.setItemOpen(value.value, next)
    },
    disabled
  })

  const hidden = computed(() => !open.value && !collapsible.mounted.value)

  const state = computed<AccordionItemState>(() => ({
    value: options.accordion.value.value,
    disabled: disabled.value,
    hidden: hidden.value,
    open: open.value
  }))

  const stateAttrs = computed(() =>
    dataAttrs({
      disabled: disabled.value,
      open: open.value,
      closed: !open.value,
      hidden: hidden.value
    })
  )

  return { collapsible, triggerId, value, disabled, open, hidden, state, stateAttrs }
}

export type AccordionItem = ReturnType<typeof useAccordionItem>
