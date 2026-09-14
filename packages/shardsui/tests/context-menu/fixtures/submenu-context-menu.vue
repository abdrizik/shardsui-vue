<script setup lang="ts">
import { ContextMenu } from '@/components/context-menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  rootOnOpenChange,
  submenuOnOpenChange,
  submenuOpen: submenuOpenProp = undefined,
  submenuOpenOnHover = true
} = defineProps<{
  rootOnOpenChange?: (open: boolean) => void
  submenuOnOpenChange?: (open: boolean) => void
  submenuOpen?: boolean
  submenuOpenOnHover?: boolean
}>()

const submenuOpen = useOpen(() => submenuOpenProp, true)
</script>

<template>
  <ContextMenu.Root @update:open="(value) => rootOnOpenChange?.(value)">
    <ContextMenu.Trigger data-testid="context-trigger">Surface</ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner>
        <ContextMenu.Popup data-testid="context-root-popup">
          <ContextMenu.SubmenuRoot
            v-model:open="submenuOpen"
            @update:open="(value) => submenuOnOpenChange?.(value)"
          >
            <ContextMenu.SubmenuTrigger
              :delay="1"
              :open-on-hover="submenuOpenOnHover"
              data-testid="context-submenu-trigger"
            >
              More options
            </ContextMenu.SubmenuTrigger>
            <ContextMenu.Portal>
              <ContextMenu.Positioner>
                <ContextMenu.Popup data-testid="context-submenu-popup">
                  <ContextMenu.Item data-testid="context-submenu-item">
                    Deep action
                  </ContextMenu.Item>
                </ContextMenu.Popup>
              </ContextMenu.Positioner>
            </ContextMenu.Portal>
          </ContextMenu.SubmenuRoot>
        </ContextMenu.Popup>
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</template>
