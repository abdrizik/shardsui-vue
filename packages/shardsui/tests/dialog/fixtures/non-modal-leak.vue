<script setup lang="ts">
import { shallowRef } from 'vue'
import { AlertDialog } from '@/components/alert-dialog'
import { Dialog } from '@/components/dialog'

const confirmationOpen = shallowRef(false)
</script>

<template>
  <div>
    <div
      data-testid="surface"
      style="width: 100px; height: 100px"
      role="presentation"
      @click="confirmationOpen = true"
    >
      surface
    </div>

    <Dialog.Root open :modal="false">
      <Dialog.Portal>
        <Dialog.Popup>
          <textarea data-testid="nonmodal-field"></textarea>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>

    <AlertDialog.Root v-model:open="confirmationOpen">
      <AlertDialog.Portal>
        <AlertDialog.Popup>
          <AlertDialog.Close data-testid="go-back">Go back</AlertDialog.Close>
        </AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
