<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()
</script>

<template>
  <AlertDialog.Root :handle="handle" open trigger-id="trigger">
    <AlertDialog.Trigger id="trigger">Open</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Popup>Dialog</AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
