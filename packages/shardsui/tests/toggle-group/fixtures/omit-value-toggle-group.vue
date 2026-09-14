<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
</script>

<template>
  <ToggleGroup multiple>
    <Toggle value="">First</Toggle>
    <Toggle>Second</Toggle>
  </ToggleGroup>
</template>
