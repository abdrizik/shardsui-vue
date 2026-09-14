<script setup lang="ts">
import { Select } from '@/components/select'

const { labels = 'old' } = defineProps<{ labels?: 'old' | 'both' | 'new' }>()
</script>

<template>
  <Select.Root open>
    <Select.Group data-testid="group">
      <Select.GroupLabel v-if="labels !== 'new'" id="old-label">Old</Select.GroupLabel>
      <Select.GroupLabel v-if="labels !== 'old'" id="new-label">New</Select.GroupLabel>
    </Select.Group>
  </Select.Root>
</template>
