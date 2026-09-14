<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'

const phase = shallowRef(0)
</script>

<template>
  <Popover.Root open>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup>
          <template v-if="phase < 2">
            <Popover.Title :key="phase">Title {{ phase + 1 }}</Popover.Title>
            <Popover.Description :key="phase">Description {{ phase + 1 }}</Popover.Description>
          </template>
          <button @click="phase += 1">Change labels</button>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
