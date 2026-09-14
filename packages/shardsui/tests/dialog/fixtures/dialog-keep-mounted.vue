<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const { keepMounted = false, open = false } = defineProps<{
  keepMounted?: boolean
  open?: boolean
}>()
</script>

<template>
  <Dialog.Root :open="open" :modal="false">
    <Dialog.Portal :keep-mounted="keepMounted">
      <Dialog.Popup data-testid="popup">Content</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
