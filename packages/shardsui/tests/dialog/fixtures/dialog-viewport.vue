<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { keepMounted = false } = defineProps<{ keepMounted?: boolean }>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Dialog.Root v-model:open="open" :modal="false">
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal :keep-mounted="keepMounted">
      <Dialog.Viewport data-testid="viewport">
        <Dialog.Popup data-testid="popup">Content</Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
</template>
