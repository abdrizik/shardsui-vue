<script setup lang="ts">
import { Dialog } from '@/components/dialog'
</script>

<template>
  <Dialog.Root :modal="false">
    <Dialog.Trigger data-testid="reference">reference</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup data-testid="floating" :final-focus="() => undefined">
        <Dialog.Close data-testid="close">close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
