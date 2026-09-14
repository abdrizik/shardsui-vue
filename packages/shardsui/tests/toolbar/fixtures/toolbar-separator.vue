<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'
import type { Orientation } from '@/internal/types'

const { orientation = 'horizontal', separatorOrientation } = defineProps<{
  orientation?: Orientation
  separatorOrientation?: Orientation
}>()
</script>

<template>
  <Toolbar.Root :orientation="orientation">
    <Toolbar.Separator :orientation="separatorOrientation" />
  </Toolbar.Root>
</template>
