<script setup lang="ts">
import { computed, mergeProps, watch } from 'vue'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { ComboboxContext } from './context'
import { useInitialLiveRegionTextMutation } from './initial-live-region-text-mutation'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const combobox = ComboboxContext.get()

const element = usePartElement()

watch(
  () => element.value,
  (node) => {
    combobox.emptyElement.value = node ?? null
  },
  { immediate: true, flush: 'sync' }
)

useInitialLiveRegionTextMutation(() => element.value)

const visible = computed(() =>
  combobox.hasItems.value ? combobox.flatFilteredItems.value.length === 0 : combobox.isEmpty.value
)

const ownAttrs = { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot v-if="visible" />
  </component>
</template>
