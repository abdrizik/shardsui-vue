<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { labels = 'old' } = defineProps<{ labels?: 'old' | 'both' | 'new' }>()
</script>

<template>
  <Combobox.Root open>
    <Combobox.Group data-testid="group">
      <Combobox.GroupLabel v-if="labels !== 'new'" id="old-label">Old</Combobox.GroupLabel>
      <Combobox.GroupLabel v-if="labels !== 'old'" id="new-label">New</Combobox.GroupLabel>
    </Combobox.Group>
  </Combobox.Root>
</template>
