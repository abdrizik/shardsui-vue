<script setup lang="ts">
import { Menu } from '@/components/menu'
import { useOpen } from '../../dialog/fixtures/use-open'

const { open: openProp = undefined } = defineProps<{
  open?: boolean
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Menu.Root v-model:open="open">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup data-testid="menu">
          <Menu.Item data-testid="item-hidden" style="display: none">Apple</Menu.Item>
          <Menu.Item data-testid="item-apricot">Apricot</Menu.Item>
          <Menu.Item data-testid="item-banana">Banana</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
