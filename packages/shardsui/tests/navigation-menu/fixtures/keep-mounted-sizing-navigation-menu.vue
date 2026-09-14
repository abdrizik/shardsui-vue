<script setup lang="ts">
import { shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const { initialValue = null, portalKeepMounted = false } = defineProps<{
  initialValue?: string | null
  portalKeepMounted?: boolean
}>()

const value = shallowRef<string | null>(initialValue)
</script>

<template>
  <NavigationMenu.Root v-model:value="value">
    <NavigationMenu.List>
      <NavigationMenu.Item value="item-1">
        <NavigationMenu.Trigger data-testid="trigger-product">Product</NavigationMenu.Trigger>
        <NavigationMenu.Content keep-mounted>
          <div style="width: 675px; height: 220px">Product panel</div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>

      <NavigationMenu.Item value="item-2">
        <NavigationMenu.Trigger data-testid="trigger-learn">Learn</NavigationMenu.Trigger>
        <NavigationMenu.Content keep-mounted>
          <div style="width: 500px; height: 180px">Learn panel</div>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal :keep-mounted="portalKeepMounted">
      <NavigationMenu.Positioner data-testid="positioner">
        <NavigationMenu.Popup data-testid="popup-root">
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>
