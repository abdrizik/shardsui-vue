<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'

const { id = 'checkbox-input-a' } = defineProps<{ id?: string }>()
</script>

<template>
  <div>
    <label for="checkbox-input-a">Label A</label>
    <label for="checkbox-input-b">Label B</label>
    <Checkbox.Root :id="id" />
  </div>
</template>
