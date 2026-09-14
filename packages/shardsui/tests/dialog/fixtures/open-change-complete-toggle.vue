<script setup lang="ts">
import DialogArrangements from './dialog-arrangements.vue'

const {
  arrangement = 'contained',
  mode = 'none',
  onOpenChangeComplete
} = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
  mode?: 'none' | 'enter' | 'exit'
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })

const exitCss = `
  @keyframes dialog-test-anim-exit {
    to {
      opacity: 0;
    }
  }
  .animation-test-indicator[data-ending-style] {
    animation: dialog-test-anim-exit 1ms;
  }
`

const enterCss = `
  @keyframes dialog-test-anim-enter {
    from {
      opacity: 0;
    }
  }
  .animation-test-indicator[data-starting-style] {
    animation: dialog-test-anim-enter 1ms;
  }
`
</script>

<template>
  <div>
    <component :is="'style'" v-if="mode === 'exit'">{{ exitCss }}</component>
    <component :is="'style'" v-else-if="mode === 'enter'">{{ enterCss }}</component>
    <button data-testid="toggle" @click="open = !open">Toggle</button>
    <DialogArrangements
      v-model:open="open"
      :arrangement="arrangement"
      popup-class="animation-test-indicator"
      @open-change-complete="onOpenChangeComplete"
    />
  </div>
</template>
