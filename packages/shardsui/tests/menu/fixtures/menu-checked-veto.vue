<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const checked = shallowRef(false)
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.CheckboxItem
            :checked="checked"
            data-testid="checkbox-item"
            @update:checked="() => {}"
          >
            Item
          </Menu.CheckboxItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
