<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, popupId } = defineProps<{ open?: boolean; popupId?: string }>()

const open = useOpen(() => openProp)
</script>

<template>
  <AlertDialog.Root v-model:open="open">
    <AlertDialog.Trigger data-testid="trigger">Open dialog</AlertDialog.Trigger>
    <AlertDialog.Portal>
      <AlertDialog.Popup :id="popupId" data-testid="popup">Dialog</AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
