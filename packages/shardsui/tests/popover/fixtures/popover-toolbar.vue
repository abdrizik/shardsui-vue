<script setup lang="ts">
import { computed, useTemplateRef, type ComponentPublicInstance } from 'vue'
import { Popover } from '@/components/popover'
import { Toolbar } from '@/components/toolbar'

const { content = 'button' } = defineProps<{ content?: 'button' | 'input' }>()

const toolbar = useTemplateRef<ComponentPublicInstance>('toolbar')
const container = computed(() => (toolbar.value?.$el as HTMLElement | null | undefined) ?? null)
</script>

<template>
  <Toolbar.Root ref="toolbar" data-testid="toolbar">
    <Toolbar.Button data-testid="first">First</Toolbar.Button>
    <Popover.Root>
      <Popover.Trigger data-testid="trigger">Open</Popover.Trigger>
      <Popover.Portal :container="container">
        <Popover.Positioner>
          <Popover.Popup data-testid="popup">
            <input v-if="content === 'input'" data-testid="inside" value="ab" />
            <button v-else type="button" data-testid="inside">Inside</button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <Toolbar.Button data-testid="last">Last</Toolbar.Button>
  </Toolbar.Root>
</template>
