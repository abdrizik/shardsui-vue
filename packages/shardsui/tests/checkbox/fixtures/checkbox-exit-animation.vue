<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'

const { keepMounted = false, onAnimationend } = defineProps<{
  keepMounted?: boolean
  onAnimationend?: (event: AnimationEvent) => void
}>()

const checked = shallowRef(true)

const css = `
  @keyframes test-anim {
    to {
      opacity: 0;
    }
  }

  .animation-test-indicator[data-ending-style] {
    animation: test-anim 1ms;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <div>
    <button @click="checked = false">Uncheck</button>
    <Checkbox.Root :checked="checked">
      <Checkbox.Indicator
        class="animation-test-indicator"
        data-testid="indicator"
        :keep-mounted="keepMounted"
        @animationend="onAnimationend"
      />
    </Checkbox.Root>
  </div>
</template>
