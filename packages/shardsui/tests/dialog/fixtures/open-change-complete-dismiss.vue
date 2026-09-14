<script setup lang="ts">
import { shallowRef } from 'vue'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained', onOpenChangeComplete } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = shallowRef(false)

const css = `
  .animation-test-indicator {
    opacity: 0;
    transition: opacity 200ms linear;
  }
  .animation-test-indicator[data-open] {
    opacity: 1;
  }
  .animation-test-indicator[data-open][data-starting-style] {
    opacity: 0;
  }
  .animation-test-indicator[data-ending-style] {
    opacity: 0;
  }
`
</script>

<template>
  <div>
    <component :is="'style'">{{ css }}</component>
    <button @click="open = true">Open externally</button>
    <DialogArrangements
      v-model:open="open"
      :arrangement="arrangement"
      :modal="false"
      popup-class="animation-test-indicator"
      @open-change-complete="onOpenChangeComplete"
    />
  </div>
</template>
