<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { onOpenChangeComplete } = defineProps<{ onOpenChangeComplete?: (open: boolean) => void }>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <div>
    <button data-testid="toggle" @click="open = !open">Toggle</button>
    <AlertDialog.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
      <AlertDialog.Portal>
        <AlertDialog.Popup data-testid="popup" />
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
