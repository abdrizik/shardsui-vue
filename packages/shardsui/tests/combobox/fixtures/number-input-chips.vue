<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root multiple :items="['apple']" :value="['apple']">
    <Combobox.Chips>
      <Combobox.Chip data-testid="chip">apple</Combobox.Chip>
      <Combobox.Input type="number" data-testid="input" />
    </Combobox.Chips>
  </Combobox.Root>
</template>
