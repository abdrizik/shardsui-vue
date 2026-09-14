<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'

const { showLate = false } = defineProps<{ showLate?: boolean }>()
</script>

<template>
  <ToggleGroup>
    <Toggle>First</Toggle>
    <Toggle v-if="showLate">Late</Toggle>
  </ToggleGroup>
</template>
