<script setup lang="ts" generic="Payload = unknown">
import { PopoverContext } from './context'
import type { PopoverHandle } from './handle'
import { createPopoverRoot, type PopoverRoot } from './popover'

type Props = {
  modal?: boolean | 'trap-focus'
  handle?: PopoverHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const { modal = false, handle } = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const open = defineModel<boolean>('open', { default: false })
const triggerId = defineModel<string | null>('triggerId', { default: null })

defineSlots<{ default?: (props: { payload: Payload | undefined }) => any }>()

const popover: PopoverRoot<Payload> = handle ? handle.state : createPopoverRoot<Payload>()

popover.register({
  open,
  setOpen: (next) => {
    open.value = next
  },
  modal: () => modal,
  onOpenChangeComplete: () => emitOpenChangeComplete,
  triggerId,
  setTriggerId: (next) => {
    triggerId.value = next
  }
})

PopoverContext.set(popover as PopoverRoot)
</script>

<template>
  <slot :payload="popover.payload.value" />
</template>
