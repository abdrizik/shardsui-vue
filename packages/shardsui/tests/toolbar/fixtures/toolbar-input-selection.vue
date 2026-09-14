<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'
import type { Orientation } from '@/internal/types'

const { orientation = 'horizontal', inputDisabled = false } = defineProps<{
  orientation?: Orientation
  inputDisabled?: boolean
}>()
</script>

<template>
  <Toolbar.Root :orientation="orientation">
    <Toolbar.Button data-testid="button-1">Button 1</Toolbar.Button>
    <Toolbar.Input value="abcd" :disabled="inputDisabled" data-testid="input" />
    <Toolbar.Button data-testid="button-2">Button 2</Toolbar.Button>
  </Toolbar.Root>
</template>
