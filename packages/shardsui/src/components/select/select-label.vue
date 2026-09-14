<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { FieldContext, type FieldRootState } from '@/components/field/context'
import { getFieldState, getFieldStateAttrs } from '@/components/field/field'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { focusElementWithVisible, labelInteraction } from '@/internal/label-interaction'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { SelectContext } from './context'

type Props = PartProps & {
  id?: string
  onClick?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp, onClick, onPointerdown } = defineProps<Props>()

defineSlots<{ default?: (state: FieldRootState) => any }>()

const select = SelectContext.get()
const field = FieldContext.getOr()

const labelId = computed(() => idProp ?? `${select.rootId.value}-label`)

registerLabelId(select, () => labelId.value)

const selectState = computed<FieldRootState>(() => ({
  ...getFieldState(field),
  disabled: field?.disabled.value ?? false
}))

const stateAttrs = computed(() => dataAttrs(getFieldStateAttrs(field)))

const interaction = labelInteraction({
  focusControl: () => {
    if (select.triggerElement.value) focusElementWithVisible(select.triggerElement.value)
  }
})

function preventFocusSteal(event: PointerEvent) {
  event.preventDefault()
}

const ownAttrs = computed(() => ({
  id: labelId.value,
  onClick: chain(onClick, interaction.activateControl),
  onPointerdown: chain(onPointerdown, preventFocusSteal)
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="selectState" />
  </component>
</template>
