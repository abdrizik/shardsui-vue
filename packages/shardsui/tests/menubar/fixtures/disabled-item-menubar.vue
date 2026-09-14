<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined, onItemClick } = defineProps<{
  open?: boolean
  onItemClick?: (event: MouseEvent) => void
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menubar disabled>
    <Menu.Root v-model:open="open">
      <Menu.Trigger data-testid="file-trigger">File</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Item data-testid="file-item" @click="(event) => onItemClick?.(event)">
              Open
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </Menubar>
</template>
