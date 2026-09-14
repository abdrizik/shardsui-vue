<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
</script>

<template>
  <ToggleGroup aria-label="My Toggle Group">
    <Toggle value="one">One</Toggle>
    <Toggle value="two">Two</Toggle>
  </ToggleGroup>
</template>
