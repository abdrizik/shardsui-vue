<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'
import { Popover } from '@/components/popover'

const { closeOnClick = true } = defineProps<{ closeOnClick?: boolean }>()

const container = shallowRef<HTMLDialogElement | null>(null)
</script>

<template>
  <dialog ref="container" open>
    <Popover.Root v-if="container">
      <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
      <Popover.Portal :container="container">
        <Popover.Positioner>
          <Popover.Popup data-testid="popover-popup">
            <Menu.Root>
              <Menu.Trigger data-testid="menu-trigger">Open nested</Menu.Trigger>
              <Menu.Portal :container="container">
                <Menu.Positioner>
                  <Menu.Popup data-testid="menu-popup">
                    <Menu.Item :close-on-click="closeOnClick" data-testid="menu-item">
                      Item
                    </Menu.Item>
                  </Menu.Popup>
                </Menu.Positioner>
              </Menu.Portal>
            </Menu.Root>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </dialog>
</template>
