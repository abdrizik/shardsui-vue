<script setup lang="ts">
import { computed, mergeProps } from 'vue'
import { chain } from '@/internal/chain'
import { focusElementWithVisible, labelInteraction } from '@/internal/label-interaction'
import { LabelableContext } from '@/internal/labelable-context'
import { registerLabelId } from '@/internal/register-label-id'
import type { PartProps } from '@/internal/types'
import { SliderContext } from './context'
import type { SliderState } from './slider'

type Props = PartProps & {
  id?: string
  onClick?: (event: MouseEvent) => void
  onPointerdown?: (event: PointerEvent) => void
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp, onClick, onPointerdown } = defineProps<Props>()

defineSlots<{ default?: (state: SliderState) => any }>()

const slider = SliderContext.get()
const labelable = LabelableContext.get()

const labelId = computed(() => idProp ?? `${slider.id.value}-label`)

const interaction = labelInteraction({
  focusControl: () => {
    if (slider.thumbElements.value.length !== 1) return
    const input = slider.getThumbInput(0)
    if (input) focusElementWithVisible(input)
  }
})

registerLabelId(slider, () => labelId.value)
registerLabelId(labelable, () => labelId.value)

const ownAttrs = computed(() => ({
  id: labelId.value,
  onClick: chain(onClick, interaction.activateControl),
  onPointerdown: chain(onPointerdown, (event: PointerEvent) => event.preventDefault())
}))
</script>

<template>
  <component :is="as" v-bind="mergeProps(slider.stateAttrs.value, ownAttrs, $attrs)">
    <slot v-bind="slider.state.value" />
  </component>
</template>
