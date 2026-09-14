<script setup lang="ts" generic="Payload = unknown">
import { DialogContext } from './context'
import { createDialogRoot, type DialogRoot } from './dialog'
import type { DialogHandle } from './handle'

type Props = {
  modal?: boolean | 'trap-focus'
  disablePointerDismissal?: boolean
  handle?: DialogHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const { modal = true, disablePointerDismissal = false, handle } = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const open = defineModel<boolean>('open', { default: false })
const triggerId = defineModel<string | null>('triggerId', { default: null })

defineSlots<{ default?: (props: { payload: Payload | undefined }) => any }>()

const dialog: DialogRoot<Payload> = handle ? handle.state : createDialogRoot<Payload>()

dialog.register({
  open,
  setOpen: (next) => {
    open.value = next
  },
  modal: () => modal,
  disablePointerDismissal: () => disablePointerDismissal,
  onOpenChangeComplete: () => emitOpenChangeComplete,
  triggerId,
  setTriggerId: (next) => {
    triggerId.value = next
  },
  detachedRoot: () => handle?.state as DialogRoot | undefined
})

DialogContext.set(dialog as DialogRoot)
</script>

<template>
  <slot :payload="dialog.payload.value" />
</template>
