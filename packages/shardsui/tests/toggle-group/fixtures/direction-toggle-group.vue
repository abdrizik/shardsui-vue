<script setup lang="ts">
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
import type { Orientation } from '@/internal/types'

const { direction = 'rtl', orientation = 'horizontal' } = defineProps<{
  direction?: TextDirection
  orientation?: Orientation
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <ToggleGroup :orientation="orientation">
      <Toggle value="one">One</Toggle>
      <Toggle value="two">Two</Toggle>
      <Toggle value="three">Three</Toggle>
    </ToggleGroup>
  </DirectionProvider>
</template>
