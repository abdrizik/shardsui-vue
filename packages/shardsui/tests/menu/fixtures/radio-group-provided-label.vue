<script setup lang="ts">
import { Menu } from '@/components/menu'
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.RadioGroup>
            <Menu.GroupLabel id="test-group">Test group</Menu.GroupLabel>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
