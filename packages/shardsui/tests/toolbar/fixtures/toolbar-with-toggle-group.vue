<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
import { Toolbar } from '@/components/toolbar'
</script>

<template>
  <Toolbar.Root>
    <ToggleGroup aria-label="Alignment">
      <Toggle value="left" data-testid="toggle-left">Left</Toggle>
      <Toggle value="right" data-testid="toggle-right">Right</Toggle>
    </ToggleGroup>
    <Toolbar.Button data-testid="btn">Bold</Toolbar.Button>
  </Toolbar.Root>
</template>
