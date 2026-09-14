<script setup lang="ts">
import { mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { ComboboxRowContext } from './context'

type Props = PartProps

defineOptions({ inheritAttrs: false })

const { as = 'div' } = defineProps<Props>()

defineSlots<{ default?: () => any }>()

ComboboxRowContext.set(true)

const ownAttrs = { role: 'row' }
</script>

<template>
  <component :is="as" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
