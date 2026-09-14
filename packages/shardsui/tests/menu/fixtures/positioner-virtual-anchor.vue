<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { VirtualAnchorElement } from '@/internal/floating/anchor-positioning'

const { anchor } = defineProps<{ anchor: VirtualAnchorElement }>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner
        side="bottom"
        align="start"
        :anchor="anchor"
        :arrow-padding="0"
        data-testid="positioner"
      >
        <Menu.Popup>
          <Menu.Item>1</Menu.Item>
          <Menu.Item>2</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
