<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const { items = ['apple'] } = defineProps<{ items?: readonly string[] }>()
</script>

<template>
  <Autocomplete.Root :items="items" open auto-highlight="always">
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.List>
      <Autocomplete.Collection v-slot="{ item }">
        <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Root>
</template>
