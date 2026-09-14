<script setup lang="ts">
import { mergeProps, useId } from 'vue'
import { CollapsibleContext } from '@/components/collapsible/context'
import type { PartProps } from '@/internal/types'
import { useAccordionItem, type AccordionItemState } from './accordion'
import { AccordionContext, AccordionItemContext } from './context'

type Props = PartProps & {
  value?: unknown
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'div', value, disabled = false } = defineProps<Props>()

const emit = defineEmits<{ openChange: [open: boolean] }>()

defineSlots<{ default?: (state: AccordionItemState) => any }>()

const uid = useId()
const accordion = AccordionContext.get()

const item = useAccordionItem({
  uid,
  accordion,
  value: () => value,
  disabled: () => disabled,
  onOpenChange: (open) => emit('openChange', open)
})

AccordionItemContext.set(item)
CollapsibleContext.set(item.collapsible)
</script>

<template>
  <component :is="as" v-bind="mergeProps(item.stateAttrs.value, $attrs)">
    <slot v-bind="item.state.value" />
  </component>
</template>
