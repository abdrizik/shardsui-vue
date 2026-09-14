<script setup lang="ts">
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Toolbar } from '@/components/toolbar'
import type { Orientation } from '@/internal/types'

const { direction = 'ltr', orientation = 'horizontal' } = defineProps<{
  direction?: TextDirection
  orientation?: Orientation
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Toolbar.Root :orientation="orientation" :dir="direction">
      <Toolbar.Button data-testid="button-1">Button 1</Toolbar.Button>
      <Toolbar.Link href="https://example.com">Link</Toolbar.Link>
      <Toolbar.Group>
        <Toolbar.Button data-testid="grouped-button-1">Grouped 1</Toolbar.Button>
        <Toolbar.Button data-testid="grouped-button-2">Grouped 2</Toolbar.Button>
      </Toolbar.Group>
      <Toolbar.Input value="" data-testid="input" />
    </Toolbar.Root>
  </DirectionProvider>
</template>
