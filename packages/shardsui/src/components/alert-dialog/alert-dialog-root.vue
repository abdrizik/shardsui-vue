<script setup lang="ts" generic="Payload = unknown">
import { DialogContext } from '@/components/dialog/context'
import { createDialogRoot, type DialogRoot } from '@/components/dialog/dialog'
import type { AlertDialogHandle } from './handle'

type Props = {
  handle?: AlertDialogHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const { handle } = defineProps<Props>()

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
  modal: true,
  disablePointerDismissal: true,
  role: 'alertdialog',
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
