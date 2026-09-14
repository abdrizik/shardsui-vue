<script setup lang="ts">
import { Drawer } from '@/components/drawer'
</script>

<template>
  <Drawer.Root open>
    <Drawer.Portal>
      <Drawer.Viewport>
        <Drawer.Popup>
          <Drawer.Content data-testid="content">Content</Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
