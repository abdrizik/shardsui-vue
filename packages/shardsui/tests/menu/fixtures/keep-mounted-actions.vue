<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const { onActions } = defineProps<{
  onActions?: (actions: { close: () => void }) => void
}>()

const open = shallowRef(false)

onMounted(() => {
  onActions?.({
    close: () => {
      open.value = false
    }
  })
})
</script>

<template>
  <div>
    <input data-testid="input" />
    <Menu.Root v-model:open="open" :modal="false">
      <Menu.Trigger>Toggle</Menu.Trigger>
      <Menu.Portal keep-mounted>
        <Menu.Positioner data-testid="menu-positioner">
          <Menu.Popup data-testid="menu">
            <Menu.Item data-testid="item-1">Item 1</Menu.Item>
            <Menu.Item data-testid="item-2">Item 2</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <input data-testid="after" />
  </div>
</template>
