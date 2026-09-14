<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'
import type { DialogHandle } from '@/components/dialog/handle'

const { handle } = defineProps<{ handle: DialogHandle<number> }>()
const rootMounted = shallowRef(true)
</script>

<template>
  <button @click="rootMounted = !rootMounted">Toggle Root</button>
  <Dialog.Trigger :handle="handle" id="trigger" :payload="1">Trigger</Dialog.Trigger>

  <Dialog.Root v-if="rootMounted" v-slot="{ payload }" :handle="handle">
    <span data-testid="payload">{{ payload ?? 'No payload' }}</span>
    <Dialog.Portal>
      <Dialog.Popup>
        Dialog Content
        <Dialog.Close>Close</Dialog.Close>
        <button @click="rootMounted = false">Unmount Root</button>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
