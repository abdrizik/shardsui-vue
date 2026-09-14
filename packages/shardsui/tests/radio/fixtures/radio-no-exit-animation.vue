<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const value = defineModel<string>('value', { default: 'a' })
</script>

<template>
  <div>
    <button @click="value = 'b'">Close</button>
    <RadioGroup :value="value">
      <Radio.Root value="a">
        <Radio.Indicator class="animation-test-indicator" data-testid="indicator-a" />
      </Radio.Root>
      <Radio.Root value="a">
        <Radio.Indicator class="animation-test-indicator" />
      </Radio.Root>
    </RadioGroup>
  </div>
</template>
