<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, triggerId } = defineProps<{
  open?: boolean
  triggerId?: string | null
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <AlertDialog.Root v-slot="{ payload }" v-model:open="open" :trigger-id="triggerId">
    <AlertDialog.Trigger id="trigger-1" :payload="1" data-testid="trigger-1"
      >Trigger 1</AlertDialog.Trigger
    >
    <AlertDialog.Trigger id="trigger-2" :payload="2" data-testid="trigger-2"
      >Trigger 2</AlertDialog.Trigger
    >

    <AlertDialog.Portal>
      <AlertDialog.Popup data-testid="alert-dialog-popup">
        <AlertDialog.Title>Confirm</AlertDialog.Title>
        <span data-testid="content">{{ payload }}</span>
        <AlertDialog.Close>Close</AlertDialog.Close>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
