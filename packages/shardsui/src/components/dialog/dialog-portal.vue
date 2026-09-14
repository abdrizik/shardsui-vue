<script setup lang="ts">
import { computed, onWatcherCleanup, toRef, useTemplateRef, watch, watchPostEffect } from 'vue'
import { portalTo } from '@/internal/floating/portal'
import InternalBackdrop from '@/internal/internal-backdrop.vue'
import { DialogContext, DialogPortalContext } from './context'

type Props = {
  container?: HTMLElement | null
  keepMounted?: boolean
}

defineOptions({ inheritAttrs: false })

const { container = null, keepMounted = false } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const dialog = DialogContext.get()

const shouldRender = computed(() => dialog.mounted.value || keepMounted)
const backdropVisible = computed(() => dialog.mounted.value && dialog.modal.value === true)

DialogPortalContext.set({ keepMounted: toRef(() => keepMounted) })

const element = useTemplateRef<HTMLDivElement>('element')
const internalBackdrop = useTemplateRef<InstanceType<typeof InternalBackdrop>>('internalBackdrop')

watch(
  () => [element.value, container] as const,
  ([node, target], _previous, onCleanup) => {
    if (!node) return
    onCleanup(portalTo(target)(node))
  },
  { immediate: true, flush: 'post' }
)

watchPostEffect(() => {
  dialog.internalBackdropElement.value = internalBackdrop.value?.element ?? null
  onWatcherCleanup(() => {
    dialog.internalBackdropElement.value = null
  })
})
</script>

<template>
  <div v-if="shouldRender" ref="element" data-shards-ui-portal>
    <InternalBackdrop
      v-if="backdropVisible"
      ref="internalBackdrop"
      :inert="dialog.open.value ? undefined : true"
    />
    <slot />
  </div>
</template>
