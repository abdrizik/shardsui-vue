<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root open>
    <Combobox.List>
      <Combobox.Item value="orphan" :index="-1">orphan</Combobox.Item>
    </Combobox.List>
  </Combobox.Root>
</template>
