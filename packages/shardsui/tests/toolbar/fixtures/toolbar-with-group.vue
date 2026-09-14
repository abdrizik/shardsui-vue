<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'

const { groupDisabled = false } = defineProps<{ groupDisabled?: boolean }>()
</script>

<template>
  <Toolbar.Root>
    <Toolbar.Group :disabled="groupDisabled" data-testid="group">
      <Toolbar.Button data-testid="group-btn">Button</Toolbar.Button>
      <Toolbar.Link href="https://example.com" data-testid="group-link">Link</Toolbar.Link>
      <Toolbar.Input value="" data-testid="group-input" />
    </Toolbar.Group>
  </Toolbar.Root>
</template>
