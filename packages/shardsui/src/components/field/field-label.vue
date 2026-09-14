<script setup lang="ts">
import { computed, mergeProps, useId, useTemplateRef } from 'vue'
import { chain } from '@/internal/chain'
import { dataAttrs } from '@/internal/data-attrs'
import { focusElementWithVisible, labelInteraction } from '@/internal/label-interaction'
import { LabelableContext } from '@/internal/labelable-context'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { FieldContext, FieldItemContext, type FieldRootState } from './context'
import { getFieldState, getFieldStateAttrs } from './field'

type Props = PartProps & {
  id?: string
  onMousedown?: (event: MouseEvent) => void
  onClick?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'label', id: idProp, onMousedown, onClick, onPointerdown } = defineProps<Props>()

defineSlots<{ default?: (state: FieldRootState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const field = FieldContext.get()
const item = FieldItemContext.getOr()
const labelable = LabelableContext.get()

const element = useTemplateRef<HTMLElement>('element')

const native = computed(() => as === 'label')
const disabled = computed(() => field.disabled.value || (item?.disabled.value ?? false))

const interaction = labelInteraction({
  native,
  focusControl: () => {
    const controlId = labelable.controlId.value
    if (!element.value || !controlId) return
    const control = element.value.ownerDocument.getElementById(controlId)
    if (control) focusElementWithVisible(control)
  }
})

registerLabelId(labelable, () => id.value)

const fieldState = computed<FieldRootState>(() => ({
  ...getFieldState(field),
  disabled: disabled.value
}))

const stateAttrs = computed(() =>
  dataAttrs({ disabled: disabled.value, ...getFieldStateAttrs(field) })
)

const ownAttrs = computed(() => ({
  id: id.value,
  for: native.value ? labelable.controlId.value : undefined,
  onMousedown: chain(onMousedown, native.value ? interaction.activateControl : undefined),
  onClick: chain(onClick, native.value ? undefined : interaction.activateControl),
  onPointerdown: chain(
    onPointerdown,
    native.value ? undefined : (event: PointerEvent) => event.preventDefault()
  )
}))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(stateAttrs, ownAttrs, $attrs)">
    <slot v-bind="fieldState" />
  </component>
</template>
