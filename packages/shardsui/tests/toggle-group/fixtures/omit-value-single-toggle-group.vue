<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
</script>

<template>
  <ToggleGroup>
    <Toggle>First</Toggle>
    <Toggle value="">Second</Toggle>
  </ToggleGroup>
</template>
