<script setup lang="ts">
import { shallowRef } from 'vue'
import { AlertDialog } from '@/components/alert-dialog'
import { Dialog } from '@/components/dialog'

const open = shallowRef(false)
const confirmationOpen = shallowRef(false)
const value = shallowRef('')

function requestOpenChange(next: boolean) {
  if (!next && value.value) {
    confirmationOpen.value = true
    return
  }
  open.value = next
}
</script>

<template>
  <Dialog.Root :open="open" @update:open="requestOpenChange">
    <Dialog.Trigger data-testid="trigger">Tweet</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop data-testid="backdrop" />
      <Dialog.Popup>
        <textarea v-model="value" data-testid="textarea"></textarea>
      </Dialog.Popup>
    </Dialog.Portal>

    <AlertDialog.Root v-model:open="confirmationOpen">
      <AlertDialog.Portal>
        <AlertDialog.Popup>
          <AlertDialog.Close data-testid="go-back">Go back</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </Dialog.Root>
</template>
