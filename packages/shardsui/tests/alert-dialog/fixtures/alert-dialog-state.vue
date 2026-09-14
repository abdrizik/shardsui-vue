<script setup lang="ts">
import { DialogContext } from '@/components/dialog/context'

const dialog = DialogContext.get()
</script>

<template>
  <div
    data-testid="alert-dialog-state"
    :data-modal="dialog.modal.value"
    :data-disable-pointer-dismissal="dialog.disablePointerDismissal.value"
    :data-role="dialog.role.value"
  ></div>
</template>
