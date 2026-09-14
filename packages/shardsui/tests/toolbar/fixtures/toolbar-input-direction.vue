<script setup lang="ts">
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Toolbar } from '@/components/toolbar'

const { direction = 'ltr' } = defineProps<{ direction?: TextDirection }>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Toolbar.Root orientation="horizontal" :dir="direction">
      <Toolbar.Button data-testid="before">Before</Toolbar.Button>
      <Toolbar.Input value="abcd" data-testid="input" />
      <Toolbar.Button data-testid="after">After</Toolbar.Button>
    </Toolbar.Root>
  </DirectionProvider>
</template>
