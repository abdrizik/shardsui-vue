<script setup lang="ts">
import { computed, mergeProps, useId } from 'vue'
import type { PartProps } from '@/internal/types'
import type { ToastDescriptionState } from './context'
import { useToastLabelPart } from './label-part'

type Props = PartProps & {
  id?: string
}

defineOptions({ inheritAttrs: false })

const { as = 'p', id: idProp } = defineProps<Props>()

const slots = defineSlots<{ default?: (state: ToastDescriptionState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const label = useToastLabelPart({
  part: 'description',
  id,
  hasChildren: () => Boolean(slots.default)
})

const toastState = computed<ToastDescriptionState>(() => ({ type: label.type.value }))

const ownAttrs = computed(() => ({ 'data-type': label.type.value, id: id.value }))
</script>

<template>
  <component :is="as" v-if="label.shouldRender.value" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot v-if="slots.default" v-bind="toastState" />
    <template v-else>{{ label.content.value }}</template>
  </component>
</template>
