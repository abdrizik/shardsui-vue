<script setup lang="ts">
import { shallowRef } from 'vue'
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()

const open = shallowRef(false)

function requestOpenChange(next: boolean) {
  if (next) open.value = true
}
</script>

<template>
  <AlertDialog.Root :handle="handle" :open="open" @update:open="requestOpenChange">
    <AlertDialog.Trigger>Open</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Popup>
        <AlertDialog.Title>Confirm</AlertDialog.Title>
        <AlertDialog.Close>Cancel</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
