<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const { items = ['alpha', 'beta'] } = defineProps<{ items?: readonly string[] }>()
</script>

<template>
  <Autocomplete.Root :items="items" open inline>
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.List>
      <Autocomplete.Collection v-slot="{ item }">
        <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Root>
</template>
