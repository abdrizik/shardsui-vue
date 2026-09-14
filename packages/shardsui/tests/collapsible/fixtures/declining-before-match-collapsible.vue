<script setup lang="ts">
import { shallowRef } from 'vue'
import { Collapsible } from '@/components/collapsible'

const { onOpenChange, css = '' } = defineProps<{
  onOpenChange?: (open: boolean) => void
  css?: string
}>()

const open = shallowRef(false)
const declining = shallowRef(true)

function handleOpenChange(next: boolean) {
  if (!declining.value) open.value = next
  onOpenChange?.(next)
}
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <button type="button" data-testid="allow" @click="declining = false">Allow</button>

  <Collapsible.Root :open="open" @update:open="handleOpenChange">
    <Collapsible.Trigger>Trigger</Collapsible.Trigger>
    <Collapsible.Panel
      class="transition-test-panel"
      style="transition-duration: 123ms"
      hidden-until-found
      keep-mounted
      data-testid="panel"
    >
      This is panel content
    </Collapsible.Panel>
  </Collapsible.Root>
</template>
