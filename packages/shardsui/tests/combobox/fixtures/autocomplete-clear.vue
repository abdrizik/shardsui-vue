<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'

const value = defineModel<string>('value', { default: 'apple' })
</script>

<template>
  <Autocomplete.Root v-model:value="value">
    <Autocomplete.Input data-testid="input" />
    <Autocomplete.Clear data-testid="clear" />
  </Autocomplete.Root>
</template>
