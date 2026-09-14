<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const value = defineModel<string>('value', { default: 'a' })

const css = `
  @keyframes radio-indicator-exit {
    to {
      opacity: 0;
    }
  }
  .radio-indicator-anim[data-ending-style] {
    animation: radio-indicator-exit 1ms;
  }
`
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <RadioGroup v-model:value="value">
    <Radio.Root value="a" data-testid="radio-a">
      <Radio.Indicator class="radio-indicator-anim" data-testid="indicator-a" />
    </Radio.Root>
    <Radio.Root value="b" data-testid="radio-b">
      <Radio.Indicator class="radio-indicator-anim" data-testid="indicator-b" />
    </Radio.Root>
  </RadioGroup>
</template>
