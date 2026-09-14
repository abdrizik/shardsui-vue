<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

const { id } = defineProps<{ id?: string }>()
</script>

<template>
  <label v-if="id !== undefined" :for="id" data-testid="label">Label</label>
  <Checkbox.Root :id="id" as="button">
    <Checkbox.Indicator />
  </Checkbox.Root>
</template>
