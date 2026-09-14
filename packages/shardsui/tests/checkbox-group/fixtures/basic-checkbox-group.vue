<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'

const { disabled = false, onValueChange } = defineProps<{
  disabled?: boolean
  onValueChange?: (value: string[]) => void
}>()

const value = defineModel<string[] | undefined>('value')
</script>

<template>
  <CheckboxGroup
    v-model:value="value"
    :disabled="disabled"
    @update:value="(next) => onValueChange?.(next)"
  >
    <Checkbox.Root name="red" value="red" data-testid="red" />
    <Checkbox.Root name="green" value="green" data-testid="green" />
    <Checkbox.Root name="blue" value="blue" data-testid="blue" />
  </CheckboxGroup>
</template>
