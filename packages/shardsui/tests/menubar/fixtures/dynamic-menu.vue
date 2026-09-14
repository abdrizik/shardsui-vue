<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { MenuHandle } from '@/components/menu/handle'
import MenuContentItems from './menu-content-items.vue'
import type { MenuDefinition } from './menu-contents'

const { handle } = defineProps<{ handle?: MenuHandle<MenuDefinition> }>()

defineSlots<{ triggers?: () => any }>()
</script>

<template>
  <Menu.Root v-slot="{ payload }" :handle="handle">
    <slot name="triggers" />
    <Menu.Portal>
      <Menu.Positioner :data-testid="(payload as MenuDefinition | undefined)?.menuTestId">
        <Menu.Popup>
          <MenuContentItems :items="(payload as MenuDefinition | undefined)?.items ?? []" />
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
