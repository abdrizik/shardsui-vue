<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'

const { onValueChange } = defineProps<{
  onValueChange?: (value: readonly string[] | undefined) => void
}>()

const value: string[] = []
</script>

<template>
  <ToggleGroup :value="value" @update:value="(next) => onValueChange?.(next)">
    <Toggle value="one">One</Toggle>
    <Toggle value="two">Two</Toggle>
    <Toggle value="three">Three</Toggle>
  </ToggleGroup>
</template>
