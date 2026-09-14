<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onTransitionend } = defineProps<{ onTransitionend?: (event: TransitionEvent) => void }>()

const value = defineModel<string>('value', { default: 'b' })

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
    <button @click="value = 'a'">Select a</button>
    <RadioGroup :value="value">
      <Radio.Root value="a">
        <Radio.Indicator
          class="animation-test-indicator"
          data-testid="indicator-a"
          @transitionend="onTransitionend"
        />
      </Radio.Root>
      <Radio.Root value="b">
        <Radio.Indicator class="animation-test-indicator" data-testid="indicator-b" />
      </Radio.Root>
    </RadioGroup>
  </div>
</template>
