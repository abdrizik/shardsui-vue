<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
import AlertDialogState from './alert-dialog-state.vue'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()
</script>

<template>
  <AlertDialog.Trigger :handle="handle">Open</AlertDialog.Trigger>

  <AlertDialog.Root :handle="handle">
    <AlertDialogState />
    <AlertDialog.Portal>
      <AlertDialog.Popup>Content</AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
