<script setup lang="ts">
import { Drawer } from '@/components/drawer'
import type { DrawerHandle } from '@/components/drawer/handle'

defineProps<{ handle: DrawerHandle<number> }>()
</script>

<template>
  <div>
    <Drawer.Trigger :handle="handle" :payload="1">Trigger 1</Drawer.Trigger>
    <Drawer.Trigger :handle="handle" :payload="2">Trigger 2</Drawer.Trigger>
    <Drawer.Root v-slot="{ payload }" :handle="handle">
      <Drawer.Portal>
        <Drawer.Viewport>
          <Drawer.Popup>
            <span v-if="payload !== undefined" data-testid="payload">{{ payload }}</span>
            <Drawer.Close>Close</Drawer.Close>
          </Drawer.Popup>
        </Drawer.Viewport>
      </Drawer.Portal>
    </Drawer.Root>
  </div>
</template>
