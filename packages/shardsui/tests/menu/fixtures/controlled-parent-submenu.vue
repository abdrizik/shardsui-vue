<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = true, onSubmenuOpenChange } = defineProps<{
  open?: boolean
  onSubmenuOpenChange?: (open: boolean) => void
}>()

const open = useOpen(() => openProp, true)
const submenuOpen = shallowRef(true)
</script>

<template>
  <Menu.Root v-model:open="open">
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal keep-mounted>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.SubmenuRoot
            v-model:open="submenuOpen"
            @update:open="(next) => onSubmenuOpenChange?.(next)"
          >
            <Menu.SubmenuTrigger>More</Menu.SubmenuTrigger>
            <Menu.Portal>
              <Menu.Positioner>
                <Menu.Popup data-testid="submenu-popup" />
              </Menu.Positioner>
            </Menu.Portal>
          </Menu.SubmenuRoot>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
