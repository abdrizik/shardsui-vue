<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const phase = shallowRef(0)
</script>

<template>
  <Dialog.Root open :modal="false">
    <Dialog.Portal>
      <Dialog.Popup>
        <template v-if="phase < 2">
          <Dialog.Title :key="`title-${phase}`">Title {{ phase + 1 }}</Dialog.Title>
          <Dialog.Description :key="`description-${phase}`">
            Description {{ phase + 1 }}
          </Dialog.Description>
        </template>
        <button @click="phase += 1">Change labels</button>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
