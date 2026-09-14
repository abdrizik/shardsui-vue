<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle<number> }>()
</script>

<template>
  <div>
    <AlertDialog.Trigger :handle="handle" id="trigger1" :payload="1">Trigger 1</AlertDialog.Trigger>
    <AlertDialog.Trigger :handle="handle" id="trigger2" :payload="2">Trigger 2</AlertDialog.Trigger>

    <AlertDialog.Root v-slot="{ payload }" :handle="handle">
      <AlertDialog.Portal>
        <AlertDialog.Popup data-testid="alert-dialog-popup">
          <AlertDialog.Title>Confirm</AlertDialog.Title>
          <span data-testid="content">{{ payload }}</span>
          <AlertDialog.Close>Close</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
