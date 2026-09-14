<script setup lang="ts">
import { Select } from '@/components/select'

const { onOpenChangeComplete } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <button @click="open = true">Open</button>
  <button @click="open = false">Close</button>
  <Select.Root v-model:open="open" @open-change-complete="onOpenChangeComplete">
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup data-testid="popup" />
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
