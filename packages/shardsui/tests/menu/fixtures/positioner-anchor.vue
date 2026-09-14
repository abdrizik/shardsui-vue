<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Menu } from '@/components/menu'

const anchor = useTemplateRef<HTMLElement>('anchor')
</script>

<template>
  <div style="margin: 50px">
    <Menu.Root open>
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="start"
          :anchor="anchor"
          :arrow-padding="0"
          data-testid="positioner"
        >
          <Menu.Popup>
            <Menu.Item>1</Menu.Item>
            <Menu.Item>2</Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
    <div ref="anchor" data-testid="anchor" style="margin-top: 100px"></div>
  </div>
</template>
