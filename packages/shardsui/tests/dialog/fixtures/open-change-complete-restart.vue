<script setup lang="ts">
import { shallowRef } from 'vue'
import DialogArrangements from './dialog-arrangements.vue'

const { arrangement = 'contained', onOpenChangeComplete } = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = shallowRef(false)
const variant = shallowRef<'a' | 'b'>('a')

const css = `
  @keyframes dialog-test-enter-a {
    from {
      opacity: 0;
    }
  }
  @keyframes dialog-test-enter-b {
    from {
      opacity: 0;
    }
  }
  .animation-test-indicator.animation-a[data-open] {
    animation: dialog-test-enter-a 50ms linear;
  }
  .animation-test-indicator.animation-b[data-open] {
    animation: dialog-test-enter-b 50ms linear;
  }
`
</script>

<template>
  <div>
    <component :is="'style'">{{ css }}</component>
    <button @click="open = true">Open externally</button>
    <button @click="variant = variant === 'a' ? 'b' : 'a'">Swap animation</button>
    <DialogArrangements
      v-model:open="open"
      :arrangement="arrangement"
      :popup-class="`animation-test-indicator animation-${variant}`"
      @open-change-complete="onOpenChangeComplete"
    />
  </div>
</template>
