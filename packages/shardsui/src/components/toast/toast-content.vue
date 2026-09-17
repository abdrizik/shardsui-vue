<script setup lang="ts">
import { computed, mergeProps, onWatcherCleanup, watch } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ToastContext, ToastProviderContext, type ToastContentState } from './context'

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<PartProps>()

defineSlots<{ default?: (state: ToastContentState) => any }>()

const toastRoot = ToastContext.get()
const provider = ToastProviderContext.get()

const element = usePartElement()

watch(
  element,
  (node) => {
    if (!node) return

    toastRoot.recalculateHeight()

    const resizeObserver = new ResizeObserver(() => toastRoot.recalculateHeight())
    const mutationObserver = new MutationObserver(() => toastRoot.recalculateHeight())

    resizeObserver.observe(node)
    mutationObserver.observe(node, {
      childList: true,
      subtree: true,
      characterData: true
    })

    onWatcherCleanup(() => {
      resizeObserver.disconnect()
      mutationObserver.disconnect()
    })
  },
  { immediate: true, flush: 'post' }
)

const behind = computed(() => provider.visibleIndexOf(toastRoot.toast.value.id) > 0)

const toastState = computed<ToastContentState>(() => ({
  expanded: provider.expanded.value,
  behind: behind.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ expanded: provider.expanded.value, behind: behind.value })
)
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, $attrs)">
    <slot v-bind="toastState" />
  </component>
</template>
