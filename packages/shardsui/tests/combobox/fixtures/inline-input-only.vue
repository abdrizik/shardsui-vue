<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root inline value="apple">
    <Combobox.Input data-testid="input" />
  </Combobox.Root>
</template>
