<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'
import RouterLinkStub from '../../stubs/router-link.vue'

const { onNavigate } = defineProps<{ onNavigate?: (event: MouseEvent) => void }>()

const open = shallowRef(false)
</script>

<template>
  <Menu.Root v-model:open="open">
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item
            :as="RouterLinkStub"
            to="/library"
            data-testid="item"
            @navigate="(event: MouseEvent) => onNavigate?.(event)"
          >
            Library
          </Menu.Item>
          <Menu.LinkItem
            :as="RouterLinkStub"
            to="/settings"
            data-testid="link-item"
            @navigate="(event: MouseEvent) => onNavigate?.(event)"
          >
            Settings
          </Menu.LinkItem>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
