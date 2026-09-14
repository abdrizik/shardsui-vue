<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()
</script>

<template>
  <div>
    <AlertDialog.Trigger :handle="handle">Trigger 1</AlertDialog.Trigger>
    <AlertDialog.Trigger :handle="handle">Trigger 2</AlertDialog.Trigger>
    <AlertDialog.Trigger :handle="handle">Trigger 3</AlertDialog.Trigger>

    <AlertDialog.Root :handle="handle">
      <AlertDialog.Portal>
        <AlertDialog.Popup>
          <AlertDialog.Title>Alert dialog content</AlertDialog.Title>
          <AlertDialog.Close>Close</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
