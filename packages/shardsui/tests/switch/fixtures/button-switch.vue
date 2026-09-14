<script setup lang="ts">
import { Switch } from '@/components/switch'

const { id } = defineProps<{ id?: string }>()
</script>

<template>
  <label v-if="id !== undefined" :for="id" data-testid="label">Toggle</label>
  <Switch.Root :id="id" as="button">
    <Switch.Thumb />
  </Switch.Root>
</template>
