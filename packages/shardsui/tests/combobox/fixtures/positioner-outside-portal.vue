<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root open>
    <Combobox.Input />
    <Combobox.Positioner>
      <Combobox.Popup />
    </Combobox.Positioner>
  </Combobox.Root>
</template>
