<script setup lang="ts" generic="Payload = unknown">
import { useId } from 'vue'
import { TooltipContext } from './context'
import type { TooltipHandle } from './handle'
import { createTooltipRoot, type TooltipRoot } from './tooltip'

type Props = {
  disabled?: boolean
  disableHoverablePopup?: boolean
  trackCursorAxis?: 'none' | 'x' | 'y' | 'both'
  handle?: TooltipHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  disableHoverablePopup = false,
  trackCursorAxis = 'none',
  handle
} = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const open = defineModel<boolean>('open', { default: false })
const triggerId = defineModel<string | null>('triggerId', { default: null })

defineSlots<{ default?: (props: { payload: Payload | undefined }) => any }>()

const uid = useId()

const tooltip: TooltipRoot<Payload> = handle ? handle.state : createTooltipRoot<Payload>()

tooltip.register({
  open,
  setOpen: (next) => {
    open.value = next
  },
  disabled: () => disabled,
  disableHoverablePopup: () => disableHoverablePopup,
  trackCursorAxis: () => trackCursorAxis,
  onOpenChangeComplete: () => emitOpenChangeComplete,
  triggerId,
  setTriggerId: (next) => {
    triggerId.value = next
  },
  floatingId: uid
})

TooltipContext.set(tooltip as TooltipRoot)
</script>

<template>
  <slot :payload="tooltip.payload.value" />
</template>
