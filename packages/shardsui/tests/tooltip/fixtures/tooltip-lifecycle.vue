<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const { onOpenChangeComplete, animated = false } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
  animated?: boolean
}>()

const open = defineModel<boolean>('open', { default: false })

const css = `
  @keyframes tip-enter {
    from {
      opacity: 0;
    }
  }
  @keyframes tip-exit {
    to {
      opacity: 0;
    }
  }
  .anim-popup[data-starting-style] {
    animation: tip-enter 1ms;
  }
  .anim-popup[data-ending-style] {
    animation: tip-exit 1ms;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>
  <button @click="open = !open">Toggle</button>
  <Tooltip.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Tooltip.Portal>
      <Tooltip.Positioner>
        <Tooltip.Popup :class="animated ? 'anim-popup' : undefined" data-testid="popup" />
      </Tooltip.Positioner>
    </Tooltip.Portal>
  </Tooltip.Root>
</template>
