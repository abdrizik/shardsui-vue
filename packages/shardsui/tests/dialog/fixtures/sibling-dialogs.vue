<script setup lang="ts">
import { shallowRef } from 'vue'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained' } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
}>()

const openNested = shallowRef(false)
const openNested2 = shallowRef(false)
</script>

<template>
  <div>
    <DialogArrangements :arrangement="arrangement" trigger-text="Open base" popup-test-id="level-1">
      <button type="button" @click="openNested = true">Open nested 1</button>
    </DialogArrangements>

    <DialogArrangements
      v-model:open="openNested"
      :arrangement="arrangement"
      popup-test-id="level-2"
    >
      <button type="button" @click="openNested2 = true">Open nested 2</button>
    </DialogArrangements>

    <DialogArrangements
      v-model:open="openNested2"
      :arrangement="arrangement"
      popup-test-id="level-3"
    >
      Final nested
    </DialogArrangements>
  </div>
</template>
