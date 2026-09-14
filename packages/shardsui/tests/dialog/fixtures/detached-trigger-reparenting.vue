<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const { handle } = defineProps<{ handle: Dialog.Handle }>()

const nesting = shallowRef(3)
</script>

<template>
  <div>
    <button type="button" data-testid="set-0" @click="nesting = 0">nest 0</button>
    <button type="button" data-testid="set-1" @click="nesting = 1">nest 1</button>
    <button type="button" data-testid="set-2" @click="nesting = 2">nest 2</button>
    <button type="button" data-testid="set-3" @click="nesting = 3">nest 3</button>

    <Dialog.Trigger v-if="nesting === 0" :handle="handle">Trigger</Dialog.Trigger>
    <div v-else-if="nesting === 1"><Dialog.Trigger :handle="handle">Trigger</Dialog.Trigger></div>
    <div v-else-if="nesting === 2">
      <div><Dialog.Trigger :handle="handle">Trigger</Dialog.Trigger></div>
    </div>
    <div v-else>
      <div>
        <div><Dialog.Trigger :handle="handle">Trigger</Dialog.Trigger></div>
      </div>
    </div>

    <Dialog.Root :handle="handle">
      <Dialog.Portal>
        <Dialog.Popup>
          Dialog Content
          <Dialog.Close>Close</Dialog.Close>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>
