<script setup lang="ts">
import { mergeProps, useTemplateRef } from 'vue'
import type { PartProps } from '@/internal/types'
import { useInitialLiveRegionTextMutation } from './initial-live-region-text-mutation'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

const element = useTemplateRef<HTMLElement>('element')

useInitialLiveRegionTextMutation(() => element.value)

const ownAttrs = { role: 'status', 'aria-live': 'polite', 'aria-atomic': 'true' }
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
