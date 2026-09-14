<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const items = ['apple', 'banana', 'cherry']
</script>

<template>
  <Autocomplete.Root :items="items" auto-highlight="always" keep-highlight open inline>
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.List>
      <Autocomplete.Collection v-slot="{ item }">
        <Autocomplete.Item :value="item">{{ item }}</Autocomplete.Item>
      </Autocomplete.Collection>
    </Autocomplete.List>
  </Autocomplete.Root>
  <button data-testid="outside">outside</button>
</template>
