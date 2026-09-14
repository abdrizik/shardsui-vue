<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
</script>

<template>
  <ToggleGroup>
    <Toggle value="one">One</Toggle>
    <Toggle value="two" disabled>Two</Toggle>
  </ToggleGroup>
</template>
