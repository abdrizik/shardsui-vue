<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root multiple>
    <Combobox.Chips data-testid="chips">
      <Combobox.ChipRemove data-testid="remove" />
    </Combobox.Chips>
  </Combobox.Root>
</template>
