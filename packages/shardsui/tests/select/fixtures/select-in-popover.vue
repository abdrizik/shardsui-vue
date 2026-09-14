<script setup lang="ts">
import { shallowRef } from 'vue'
import { Popover } from '@/components/popover'
import { Select } from '@/components/select'

const {
  selectModal = true,
  programmatic = false,
  popoverModal = false,
  popoverOpen = true
} = defineProps<{
  selectModal?: boolean
  programmatic?: boolean
  popoverModal?: boolean
  popoverOpen?: boolean
}>()

const open = shallowRef(popoverOpen)
const selectOpen = shallowRef(false)
</script>

<template>
  <Popover.Root v-model:open="open" :modal="popoverModal">
    <Popover.Trigger>Open popover</Popover.Trigger>
    <Popover.Portal>
      <Popover.Positioner>
        <Popover.Popup data-testid="popover-popup">
          <button v-if="programmatic" type="button" @click="selectOpen = true">
            Open select programmatically
          </button>
          <Select.Root :modal="selectModal" v-model:open="selectOpen">
            <Select.Label>Apple</Select.Label>
            <Select.Trigger data-testid="select-trigger">
              <Select.Value placeholder="Pick one" />
            </Select.Trigger>
            <Select.Portal>
              <Select.Positioner :side-offset="8">
                <Select.Popup>
                  <Select.Item value="one">One</Select.Item>
                  <Select.Item value="two">Two</Select.Item>
                </Select.Popup>
              </Select.Positioner>
            </Select.Portal>
          </Select.Root>
        </Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
