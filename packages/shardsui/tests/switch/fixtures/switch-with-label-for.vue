<script setup lang="ts">
import { Switch } from '@/components/switch'

const { id = 'switch-input' } = defineProps<{ id?: string }>()
</script>

<template>
  <div>
    <label data-testid="label" :for="id">Toggle</label>
    <Switch.Root :id="id">
      <Switch.Thumb />
    </Switch.Root>
  </div>
</template>
