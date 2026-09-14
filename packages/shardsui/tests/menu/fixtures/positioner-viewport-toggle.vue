<script setup lang="ts">
import { Menu } from '@/components/menu'

const { viewport = false } = defineProps<{ viewport?: boolean }>()
</script>

<template>
  <Menu.Root open>
    <Menu.Trigger as="div" style="width: 72px; height: 36px">Trigger</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner data-testid="positioner">
        <Menu.Popup style="width: 52px; height: 24px">
          <Menu.Viewport v-if="viewport">Popup</Menu.Viewport>
          <template v-else>Popup</template>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
