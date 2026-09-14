<script setup lang="ts">
import { computed } from 'vue'
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
import type { Orientation } from '@/internal/types'

const {
  value,
  multiple = false,
  disabled = false,
  orientation = 'horizontal',
  onValueChange
} = defineProps<{
  value?: string[]
  multiple?: boolean
  disabled?: boolean
  orientation?: Orientation
  onValueChange?: (value: readonly string[] | undefined) => void
}>()

const bound = computed(() => ({
  ...(value === undefined ? {} : { value }),
  ...(onValueChange ? { 'onUpdate:value': onValueChange } : {})
}))
</script>

<template>
  <ToggleGroup v-bind="bound" :multiple="multiple" :disabled="disabled" :orientation="orientation">
    <Toggle value="one">One</Toggle>
    <Toggle value="two">Two</Toggle>
    <Toggle value="three">Three</Toggle>
  </ToggleGroup>
</template>
