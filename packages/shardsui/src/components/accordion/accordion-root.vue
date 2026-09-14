<script setup lang="ts" generic="Value = unknown">
import { computed, mergeProps } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { PartProps } from '@/internal/types'
import { useAccordionRoot, type AccordionRootState } from './accordion'
import { AccordionContext } from './context'

type Props = PartProps & {
  disabled?: boolean
  hiddenUntilFound?: boolean
  keepMounted?: boolean
  multiple?: boolean
}

defineOptions({ inheritAttrs: false })

const {
  as = 'div',
  disabled = false,
  hiddenUntilFound = false,
  keepMounted = false,
  multiple = false
} = defineProps<Props>()

const value = defineModel<Value[]>('value', { default: () => [] })

defineSlots<{ default?: (state: AccordionRootState<Value>) => any }>()

const accordion = useAccordionRoot<Value>({
  value,
  setValue: (next) => {
    value.value = next
  },
  disabled: () => disabled,
  hiddenUntilFound: () => hiddenUntilFound,
  keepMounted: () => keepMounted,
  multiple: () => multiple
})

AccordionContext.set(accordion)

const stateAttrs = computed(() => dataAttrs({ disabled }))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, $attrs)">
    <slot v-bind="accordion.state.value" />
  </component>
</template>
