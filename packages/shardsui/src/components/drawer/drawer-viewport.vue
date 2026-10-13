<script setup lang="ts">
import { DialogContext, type DialogViewportState } from '@/components/dialog/context'
import DialogViewport from '@/components/dialog/dialog-viewport.vue'
import { mergeProps } from '@/internal/merge-props'
import type { PartProps } from '@/internal/types'
import { DrawerContext, DrawerProviderContext, DrawerViewportContext } from './context'
import { useDrawerSwipe } from './swipe'

defineOptions({ inheritAttrs: false })

const { as } = defineProps<PartProps>()

defineSlots<{ default?: (state: DialogViewportState) => any }>()

const drawer = DrawerContext.get()
const dialog = DialogContext.get()
const provider = DrawerProviderContext.getOr()

const swipe = useDrawerSwipe(dialog, drawer, provider)

DrawerViewportContext.set(swipe)
</script>

<template>
  <DialogViewport
    v-slot="state"
    :as="as"
    v-bind="mergeProps($attrs, { 'data-nested-dialog-open': undefined })"
  >
    <slot v-bind="state" />
  </DialogViewport>
</template>
