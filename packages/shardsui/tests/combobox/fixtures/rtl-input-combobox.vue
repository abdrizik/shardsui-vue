<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { DirectionProvider } from '@/components/direction-provider'
</script>

<template>
  <DirectionProvider direction="rtl">
    <Combobox.Root input-value="apple">
      <Combobox.Input data-testid="input" />
    </Combobox.Root>
  </DirectionProvider>
</template>
