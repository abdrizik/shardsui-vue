<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined } = defineProps<{ open?: boolean }>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open">
    <Menu.Trigger>Trigger</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Viewport>
            <div data-testid="content">Content</div>
          </Menu.Viewport>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
