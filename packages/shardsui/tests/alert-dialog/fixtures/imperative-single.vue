<script setup lang="ts">
import { AlertDialog } from '@/components/alert-dialog'

const { handle } = defineProps<{ handle: AlertDialog.Handle }>()
</script>

<template>
  <div>
    <AlertDialog.Trigger :handle="handle" id="trigger">Trigger</AlertDialog.Trigger>
    <AlertDialog.Root :handle="handle">
      <AlertDialog.Portal>
        <AlertDialog.Popup data-testid="content">Content</AlertDialog.Popup>
      </AlertDialog.Portal>
    </AlertDialog.Root>
  </div>
</template>
