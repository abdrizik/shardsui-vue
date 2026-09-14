<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { hasNullItemLabel } from '@/internal/resolve-value-label'
import type { PartProps } from '@/internal/types'
import { SelectContext } from './context'

type Props = PartProps & {
  placeholder?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'span', placeholder } = defineProps<Props>()

const slots = defineSlots<{ default?: (props: { value: unknown }) => any }>()

const select = SelectContext.get()

const hasNullLabel = computed(() => !select.hasValue.value && hasNullItemLabel(select.items.value))

const showPlaceholder = computed(
  () => !select.hasValue.value && placeholder != null && !hasNullLabel.value
)

const stateAttrs = computed(() => dataAttrs({ placeholder: !select.hasValue.value }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, $attrs)">
    <slot v-if="slots.default" :value="select.value.value" />
    <template v-else-if="showPlaceholder">{{ placeholder }}</template>
    <template v-else>{{ select.selectedLabel.value }}</template>
  </component>
</template>
