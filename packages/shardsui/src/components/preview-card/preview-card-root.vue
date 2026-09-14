<script setup lang="ts" generic="Payload = unknown">
import { PreviewCardContext } from './context'
import type { PreviewCardHandle } from './handle'
import { createPreviewCardRoot, type PreviewCardRoot } from './preview-card'

type Props = {
  handle?: PreviewCardHandle<Payload>
}

defineOptions({ inheritAttrs: false })

const { handle } = defineProps<Props>()

const emit = defineEmits<{ openChangeComplete: [open: boolean] }>()

const emitOpenChangeComplete = (open: boolean): void => emit('openChangeComplete', open)

const open = defineModel<boolean>('open', { default: false })
const triggerId = defineModel<string | null>('triggerId', { default: null })

defineSlots<{ default?: (props: { payload: Payload | undefined }) => any }>()

const previewCard: PreviewCardRoot<Payload> = handle
  ? handle.state
  : createPreviewCardRoot<Payload>()

previewCard.register({
  open,
  setOpen: (next) => {
    open.value = next
  },
  onOpenChangeComplete: () => emitOpenChangeComplete,
  triggerId,
  setTriggerId: (next) => {
    triggerId.value = next
  }
})

PreviewCardContext.set(previewCard as PreviewCardRoot)
</script>

<template>
  <slot :payload="previewCard.payload.value" />
</template>
