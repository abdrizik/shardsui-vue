<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const value = shallowRef<unknown>(undefined)
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.RadioGroup :value="value" @update:value="() => {}">
            <Menu.RadioItem value="a" data-testid="radio-item-a">Option A</Menu.RadioItem>
            <Menu.RadioItem value="b" data-testid="radio-item-b">Option B</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
