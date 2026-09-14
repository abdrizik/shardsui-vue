<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const { handle } = defineProps<{ handle: Dialog.Handle<() => number> }>()

const payloads = shallowRef([1, 2])
</script>

<template>
  <div>
    <div>
      <Dialog.Trigger id="trigger-1" :payload="() => payloads[0]!" :handle="handle"
        >Dialog 1</Dialog.Trigger
      >
      <Dialog.Trigger id="trigger-2" :payload="() => payloads[1]!" :handle="handle"
        >Dialog 2</Dialog.Trigger
      >
      <button type="button" @click="payloads = [8, 16]">Update payloads</button>
    </div>
    <Dialog.Root
      v-slot="{ payload }"
      :handle="handle"
      :modal="false"
      :disable-pointer-dismissal="true"
    >
      <Dialog.Portal>
        <Dialog.Popup>
          <span data-testid="content">{{ payload?.() }}</span>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>
