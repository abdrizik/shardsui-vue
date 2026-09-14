<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { disabled = true, name = 'x' } = defineProps<{ disabled?: boolean; name?: string }>()

const value = defineModel<unknown[]>('value', { default: () => ['a'] })
</script>

<template>
  <form data-testid="form">
    <Combobox.Root multiple :disabled="disabled" :name="name" v-model:value="value">
      <Combobox.Input data-testid="input" />
    </Combobox.Root>
  </form>
</template>
