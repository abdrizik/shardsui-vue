<script setup lang="ts">
import { Drawer } from '@/components/drawer'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  open: openProp = undefined,
  modal = true,
  onOpenChange
} = defineProps<{
  open?: boolean
  modal?: boolean | 'trap-focus'
  onOpenChange?: (open: boolean) => void
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <Drawer.Root v-model:open="open" :modal="modal" @update:open="(next) => onOpenChange?.(next)">
    <Drawer.Trigger>Open Drawer</Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup>
          <Drawer.Title>Drawer title</Drawer.Title>
          <Drawer.Description>Drawer description</Drawer.Description>
          <Drawer.Close>Close</Drawer.Close>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
