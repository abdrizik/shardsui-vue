<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import { FieldContext } from '@/components/field/context'
import { getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { dataAttrs } from '@/internal/data-attrs'
import { mergeDescribedBy } from '@/internal/labelable'
import { LabelableContext } from '@/internal/labelable-context'
import type { PartProps } from '@/internal/types'
import { useCheckboxGroupRoot } from './checkbox-group'
import { CheckboxGroupContext, type CheckboxGroupState } from './context'

type Props = PartProps & {
  disabled?: boolean
  ariaDescribedby?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'div', disabled = false, ariaDescribedby } = defineProps<Props>()

const value = defineModel<string[]>('value', { default: () => [] })

defineSlots<{ default?: (state: CheckboxGroupState) => any }>()

const uid = useId()

const field = FieldContext.getOr()
const labelable = LabelableContext.get()

const checkboxGroup = useCheckboxGroupRoot({
  uid,
  value,
  setValue: (next) => {
    value.value = next
  },
  disabled: () => disabled
})

CheckboxGroupContext.set(checkboxGroup)

const ariaDescribedBy = computed(() =>
  mergeDescribedBy(ariaDescribedby, labelable.messageIds.value)
)

const checkboxGroupState = computed<CheckboxGroupState>(() => ({
  ...getFieldState(field),
  disabled: checkboxGroup.disabled.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ disabled: checkboxGroup.disabled.value, ...getFieldStateAttrs(field) })
)

const ownAttrs = computed(() => ({
  role: 'group',
  'aria-labelledby': labelable.labelId.value,
  'aria-describedby': ariaDescribedBy.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="checkboxGroupState" />
  </component>
</template>
