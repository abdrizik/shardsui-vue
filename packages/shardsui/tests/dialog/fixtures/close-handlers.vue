<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import { useOpen } from './use-open'

type Props = {
  open?: boolean
  keepMounted?: boolean
  onOpenChange?: (open: boolean) => void
  onClick?: (event: MouseEvent) => void
  preventCloseHandler?: boolean
}

const {
  open: openProp = undefined,
  keepMounted = false,
  onOpenChange,
  onClick,
  preventCloseHandler = false
} = defineProps<Props>()

const open = useOpen(() => openProp)

function handleClick(event: MouseEvent & { preventShardsUIHandler?(): void }) {
  onClick?.(event)
  if (preventCloseHandler) event.preventShardsUIHandler!()
}
</script>

<template>
  <Dialog.Root v-model:open="open" :modal="false" @update:open="(next) => onOpenChange?.(next)">
    <Dialog.Portal :keep-mounted="keepMounted">
      <Dialog.Popup>
        <Dialog.Close @click="handleClick">Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
