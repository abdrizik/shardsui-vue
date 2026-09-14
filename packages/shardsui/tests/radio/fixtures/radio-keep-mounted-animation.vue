<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onAnimationend } = defineProps<{ onAnimationend?: (event: AnimationEvent) => void }>()

const value = defineModel<string>('value', { default: 'a' })

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
    <button @click="value = 'b'">Close</button>
    <RadioGroup :value="value">
      <Radio.Root value="a">
        <Radio.Indicator
          class="animation-test-indicator"
          keep-mounted
          data-testid="indicator-a"
          @animationend="onAnimationend"
        />
      </Radio.Root>
      <Radio.Root value="a">
        <Radio.Indicator class="animation-test-indicator" keep-mounted />
      </Radio.Root>
    </RadioGroup>
  </div>
</template>
