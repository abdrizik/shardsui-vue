<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import type { DialogHandle } from '@/components/dialog/handle'
import MountAction from './mount-action.vue'

const { handle } = defineProps<{ handle: DialogHandle<number> }>()
</script>

<template>
  <Dialog.Trigger :handle="handle" id="other" :payload="9">Other</Dialog.Trigger>
  <Dialog.Trigger :handle="handle" id="trigger" :payload="5">Trigger</Dialog.Trigger>
  <Dialog.Root v-slot="{ payload }" :handle="handle">
    <span data-testid="payload">{{ payload ?? 'No payload' }}</span>
    <Dialog.Portal>
      <Dialog.Popup>Dialog Content</Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
  <MountAction :action="() => handle.open('trigger')" />
</template>
