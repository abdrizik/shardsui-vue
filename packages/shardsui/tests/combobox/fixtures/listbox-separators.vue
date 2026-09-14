<script setup lang="ts">
import { Autocomplete } from '@/components/autocomplete'
import { Combobox } from '@/components/combobox'
import { Select } from '@/components/select'

const { orientation = undefined } = defineProps<{ orientation?: 'horizontal' | 'vertical' }>()
</script>

<template>
  <Autocomplete.Separator :orientation="orientation" data-testid="Autocomplete.Separator" />
  <Combobox.Separator :orientation="orientation" data-testid="Combobox.Separator" />
  <Select.Separator :orientation="orientation" data-testid="Select.Separator" />
</template>
