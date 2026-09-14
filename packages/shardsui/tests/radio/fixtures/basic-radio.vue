<script setup lang="ts">
import { shallowRef } from 'vue'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const {
  value: initialValue,
  disabled = false,
  onClick
} = defineProps<{
  value?: string
  disabled?: boolean
  onClick?: (event: MouseEvent) => void
}>()

const value = shallowRef<string | undefined>(initialValue)
</script>

<template>
  <RadioGroup v-model:value="value">
    <Radio.Root value="a" data-testid="radio-a" :disabled="disabled" :on-click="onClick">
      Option A
      <Radio.Indicator data-testid="indicator-a" />
    </Radio.Root>
    <Radio.Root value="b" data-testid="radio-b">
      Option B
      <Radio.Indicator data-testid="indicator-b" />
    </Radio.Root>
  </RadioGroup>
</template>
