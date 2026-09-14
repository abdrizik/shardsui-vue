<script setup lang="ts">
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { explicit = false, onValueChange } = defineProps<{
  explicit?: boolean
  onValueChange?: (value: unknown) => void
}>()
</script>

<template>
  <RadioGroup @update:value="(next) => onValueChange?.(next)">
    <template v-if="explicit">
      <div>
        <label data-testid="label" for="RadioA">Apple</label>
        <Radio.Root value="apple" id="RadioA" />
      </div>
      <div>
        <label data-testid="label" for="RadioB">Banana</label>
        <Radio.Root value="banana" id="RadioB" />
      </div>
    </template>
    <template v-else>
      <label data-testid="label">
        <Radio.Root value="apple" />
        Apple
      </label>
      <label data-testid="label">
        <Radio.Root value="banana" />
        Banana
      </label>
    </template>
  </RadioGroup>
</template>
