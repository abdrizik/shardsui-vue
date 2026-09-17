<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watchPostEffect } from 'vue'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { DialogContext, DialogPortalContext, type DialogViewportState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: DialogViewportState) => any }>()

const dialog = DialogContext.get()
const portal = DialogPortalContext.getOr()

const element = usePartElement()

watchPostEffect(() => {
  dialog.viewportElement.value = element.value
  onWatcherCleanup(() => {
    dialog.viewportElement.value = null
  })
})

const shouldRender = computed(() => dialog.mounted.value || !!portal?.keepMounted.value)

const dialogState = computed<DialogViewportState>(() => ({
  open: dialog.open.value,
  transitionStatus: dialog.transitionStatus.value,
  nested: dialog.nested.value,
  nestedDialogOpen: dialog.nestedOpenCount.value > 0
}))

const ownAttrs = computed(() => ({
  hidden: !dialog.mounted.value,
  role: 'presentation'
}))

const style = computed(() => (dialog.open.value ? undefined : { pointerEvents: 'none' }))
</script>

<template>
  <component
    :is="as"
    v-if="shouldRender"
    ref="element"
    v-bind="mergeProps(dialog.transitionAttrs.value, dialog.nestedAttrs.value, ownAttrs, $attrs)"
    :style="style"
  >
    <slot v-bind="dialogState" />
  </component>
</template>
