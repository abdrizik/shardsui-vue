<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'

const { onTransitionend } = defineProps<{ onTransitionend?: (event: TransitionEvent) => void }>()

const checked = shallowRef(false)

const css = `
  .animation-test-indicator {
    transition: opacity 1ms;
  }

  .animation-test-indicator[data-starting-style],
  .animation-test-indicator[data-ending-style] {
    opacity: 0;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <div>
    <button @click="checked = true">Check</button>
    <Checkbox.Root :checked="checked">
      <Checkbox.Indicator
        class="animation-test-indicator"
        data-testid="indicator"
        @transitionend="onTransitionend"
      />
    </Checkbox.Root>
  </div>
</template>
