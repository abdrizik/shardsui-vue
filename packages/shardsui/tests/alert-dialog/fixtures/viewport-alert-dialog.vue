<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
</script>

<template>
  <AlertDialog.Root open>
    <AlertDialog.Portal>
      <AlertDialog.Viewport data-testid="viewport">
        <AlertDialog.Popup>Dialog</AlertDialog.Popup>
      </AlertDialog.Viewport>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
