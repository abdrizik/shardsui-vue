<script setup lang="ts">
import { shallowRef, useTemplateRef } from 'vue'
import { Menu } from '@/components/menu'

const anchorElement = useTemplateRef<HTMLElement>('anchorElement')
const useAnchor = shallowRef(true)
</script>

<template>
  <div style="margin: 50px">
    <button type="button" @click="useAnchor = false">undefined</button>
    <button type="button" @click="useAnchor = true">ref</button>
    <Menu.Root :open="true" @update:open="() => {}">
      <Menu.Trigger>trigger</Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner
          side="bottom"
          align="start"
          :anchor="useAnchor ? anchorElement : undefined"
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
    <div
      ref="anchorElement"
      data-testid="anchor"
      style="margin-top: 100px; width: 10px; height: 10px"
    ></div>
  </div>
</template>
