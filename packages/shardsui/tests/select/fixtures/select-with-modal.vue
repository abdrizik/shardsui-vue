<script setup lang="ts">
import { Select } from '@/components/select'

const { modal = true } = defineProps<{ modal?: boolean }>()
</script>

<template>
  <div>
    <Select.Root :modal="modal">
      <Select.Trigger data-testid="trigger">Open</Select.Trigger>
      <Select.Portal>
        <Select.Positioner data-testid="positioner">
          <Select.Popup>
            <Select.Item value="1">1</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <button>Outside</button>
  </div>
</template>
