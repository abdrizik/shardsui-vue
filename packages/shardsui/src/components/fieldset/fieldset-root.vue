<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import type { PartProps } from '@/internal/types'
import { FieldsetContext, type FieldsetState } from './context'
import { useFieldsetRoot } from './fieldset'

type Props = PartProps & {
  disabled?: boolean
}

defineOptions({ inheritAttrs: false })

const { as = 'fieldset', disabled = false } = defineProps<Props>()

defineSlots<{ default?: (state: FieldsetState) => any }>()

const parent = FieldsetContext.getOr()

const fieldset = useFieldsetRoot({
  disabled: () => disabled || (parent?.disabled.value ?? false)
})

FieldsetContext.set(fieldset)

const ownAttrs = computed(() => ({
  disabled: fieldset.disabled.value || undefined,
  'aria-labelledby': fieldset.labelId.value
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(fieldset.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="fieldset.state.value" />
  </component>
</template>
