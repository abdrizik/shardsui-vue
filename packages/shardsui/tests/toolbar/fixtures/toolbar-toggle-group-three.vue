<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
import { Toolbar } from '@/components/toolbar'

const {
  onValueChange,
  multiple = false,
  twoDisabled = false
} = defineProps<{
  onValueChange?: (value: readonly string[] | undefined) => void
  multiple?: boolean
  twoDisabled?: boolean
}>()

const value = defineModel<string[]>('value', { default: () => ['one'] })
</script>

<template>
  <Toolbar.Root>
    <ToggleGroup
      v-model:value="value"
      :multiple="multiple"
      @update:value="(next) => onValueChange?.(next)"
    >
      <Toggle value="one" data-testid="one">One</Toggle>
      <Toggle value="two" data-testid="two" :disabled="twoDisabled">Two</Toggle>
      <Toggle value="three" data-testid="three">Three</Toggle>
    </ToggleGroup>
  </Toolbar.Root>
</template>
