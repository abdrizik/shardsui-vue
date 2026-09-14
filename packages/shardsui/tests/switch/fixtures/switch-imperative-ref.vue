<script setup lang="ts">
import { Switch } from '@/components/switch'

function interact(host: Element | null) {
  const element = host?.querySelector<HTMLElement>('[role="switch"]')
  if (!element) return
  element.focus()
  element.blur()
  element.click()
}
</script>

<template>
  <div :ref="(host) => interact(host as Element | null)">
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
  </div>
</template>
