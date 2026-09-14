<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'

const { onClick, onClickCapture, onAncestorClick } = defineProps<{
  onClick?: (event: MouseEvent) => void
  onClickCapture?: (event: MouseEvent) => void
  onAncestorClick?: (event: MouseEvent) => void
}>()
</script>

<template>
  <div @click="(event) => onAncestorClick?.(event)">
    <Toolbar.Root>
      <Toolbar.Button
        as="span"
        @click="(event) => onClick?.(event)"
        @click.capture="(event) => onClickCapture?.(event)"
      >
        Save
      </Toolbar.Button>
    </Toolbar.Root>
  </div>
</template>
