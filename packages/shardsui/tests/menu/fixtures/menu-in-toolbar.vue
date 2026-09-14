<script setup lang="ts">
import { computed, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { Menu } from '@/components/menu'
import { Toolbar } from '@/components/toolbar'

const { onParentKeydown } = defineProps<{ onParentKeydown?: (event: KeyboardEvent) => void }>()

const toolbar = useTemplateRef<ComponentPublicInstance>('toolbar')
const container = computed(() => (toolbar.value?.$el as HTMLElement | null | undefined) ?? null)
</script>

<template>
  <div role="presentation" @keydown="(event) => onParentKeydown?.(event)">
    <Toolbar.Root ref="toolbar" data-testid="toolbar">
      <Toolbar.Button data-testid="first">First</Toolbar.Button>
      <Menu.Root>
        <Menu.Trigger data-testid="trigger">Open</Menu.Trigger>
        <Menu.Portal :container="container" keep-mounted>
          <Menu.Positioner>
            <Menu.Popup data-testid="popup">
              <Menu.Item data-testid="item">Item</Menu.Item>
            </Menu.Popup>
          </Menu.Positioner>
        </Menu.Portal>
      </Menu.Root>
      <Toolbar.Button data-testid="last">Last</Toolbar.Button>
    </Toolbar.Root>
  </div>
</template>
