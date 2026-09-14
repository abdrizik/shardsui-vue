<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'

const {
  onClick = () => {},
  onMousedown = () => {},
  onPointerdown = () => {},
  onKeydown = () => {},
  onMousemove = () => {}
} = defineProps<{
  onClick?: (event: MouseEvent) => void
  onMousedown?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
  onKeydown?: (event: KeyboardEvent) => void
  onMousemove?: (event: MouseEvent) => void
}>()
</script>

<template>
  <Toolbar.Root>
    <Toolbar.Button
      data-testid="btn"
      disabled
      @click="onClick"
      @mousedown="onMousedown"
      @pointerdown="onPointerdown"
      @keydown="onKeydown"
      @mousemove="onMousemove"
    >
      Button
    </Toolbar.Button>
  </Toolbar.Root>
</template>
