<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
</script>

<template>
  <ToggleGroup :value="['one']">
    <Toggle />
    <Toggle />
  </ToggleGroup>
</template>
