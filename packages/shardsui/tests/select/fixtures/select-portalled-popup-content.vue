<script setup lang="ts">
import { onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import { Select } from '@/components/select'
import { portalTo } from '@/internal/floating/portal'

const portalled = useTemplateRef<HTMLElement>('portalled')

watchPostEffect(() => {
  const node = portalled.value
  if (!node) return
  onWatcherCleanup(portalTo(null)(node))
})
</script>

<template>
  <Select.Root open>
    <Select.Trigger data-testid="trigger">Open</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.List>
            <Select.Item value="apple">Apple</Select.Item>
          </Select.List>
          <div ref="portalled" data-shards-ui-portal>Portalled content</div>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
