<script setup lang="ts">
import { Dialog } from '@/components/dialog'
import type { DialogHandle } from '@/components/dialog/handle'
import MountAction from './mount-action.vue'

type Props = {
  handle: DialogHandle<number>
  open?: boolean
  action: () => void
}

const { handle, open = false, action } = defineProps<Props>()
</script>

<template>
  <Dialog.Root v-slot="{ payload }" :handle="handle" :open="open">
    <span data-testid="payload">{{ payload ?? 'No payload' }}</span>
    <MountAction :action="action" />
  </Dialog.Root>
</template>
