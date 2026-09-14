<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)
</script>

<template>
  <div>
    <Dialog.Root
      v-slot="{ payload }"
      :open="open"
      :trigger-id="triggerId"
      @update:open="(next) => (open = next)"
    >
      <Dialog.Trigger id="trigger-1" :payload="1">One</Dialog.Trigger>
      <Dialog.Trigger id="trigger-2" :payload="2">Two</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup>
          <span data-testid="content">{{ payload }}</span>
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>

    <button
      type="button"
      @click="
        () => {
          triggerId = 'trigger-2'
          open = true
        }
      "
    >
      Open programmatically
    </button>
  </div>
</template>
