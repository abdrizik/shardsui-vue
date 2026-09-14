<script setup lang="ts">
import { useTemplateRef, watchPostEffect } from 'vue'
import { ContextMenu } from '@/components/context-menu'

defineOptions({ inheritAttrs: false })

const {
  disabled = false,
  onOpenChange,
  as = undefined,
  onContextmenu = undefined,
  onRef,
  showTrigger = true
} = defineProps<{
  disabled?: boolean
  onOpenChange?: (open: boolean) => void
  as?: keyof HTMLElementTagNameMap
  onContextmenu?: (event: MouseEvent) => void
  onRef?: (element: HTMLElement | null) => void
  showTrigger?: boolean
}>()

const trigger = useTemplateRef<{ $el: HTMLElement | null }>('trigger')

watchPostEffect(() => {
  const element = trigger.value?.$el ?? null
  if (element) onRef?.(element)
})
</script>

<template>
  <ContextMenu.Root :disabled="disabled" @update:open="(value) => onOpenChange?.(value)">
    <ContextMenu.Trigger
      v-if="showTrigger"
      ref="trigger"
      data-testid="trigger"
      :as="as"
      :on-contextmenu="onContextmenu"
      v-bind="$attrs"
    >
      Right-click me
    </ContextMenu.Trigger>
    <ContextMenu.Portal>
      <ContextMenu.Positioner data-testid="positioner">
        <ContextMenu.Popup data-testid="popup" />
      </ContextMenu.Positioner>
    </ContextMenu.Portal>
  </ContextMenu.Root>
</template>
