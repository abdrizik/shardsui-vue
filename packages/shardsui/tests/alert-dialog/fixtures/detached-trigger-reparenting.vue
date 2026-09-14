<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { handle, nesting = 0 } = defineProps<{
  handle: AlertDialog.Handle
  nesting?: 0 | 1 | 2 | 3
}>()
</script>

<template>
  <AlertDialog.Trigger v-if="nesting === 0" :handle="handle">Trigger</AlertDialog.Trigger>
  <div v-else-if="nesting === 1">
    <AlertDialog.Trigger :handle="handle">Trigger</AlertDialog.Trigger>
  </div>
  <div v-else-if="nesting === 2">
    <div><AlertDialog.Trigger :handle="handle">Trigger</AlertDialog.Trigger></div>
  </div>
  <div v-else>
    <div>
      <div><AlertDialog.Trigger :handle="handle">Trigger</AlertDialog.Trigger></div>
    </div>
  </div>

  <AlertDialog.Root :handle="handle">
    <AlertDialog.Portal>
      <AlertDialog.Popup>
        <AlertDialog.Title>Alert dialog content</AlertDialog.Title>
        <AlertDialog.Close>Close</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
