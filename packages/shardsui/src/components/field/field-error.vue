<script setup lang="ts">
import {
  computed,
  mergeProps,
  onWatcherCleanup,
  shallowRef,
  useId,
  watchEffect,
  watchPostEffect
} from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import { LabelableContext } from '@/internal/labelable-context'
import { openChangeComplete } from '@/internal/open-change-complete'
import { usePartElement } from '@/internal/part-element'
import { useTransitionStatus } from '@/internal/transition-status'
import type { PartProps } from '@/internal/types'
import { FieldContext, type FieldErrorState } from './context'
import { getFieldState } from './field'

type Props = PartProps & {
  id?: string
  match?: boolean | keyof ValidityState
}

defineOptions({ inheritAttrs: false })

const { as = 'div', id: idProp, match = undefined } = defineProps<Props>()

const slots = defineSlots<{ default?: (state: FieldErrorState) => any }>()

const uid = useId()
const id = computed(() => idProp ?? uid)

const field = FieldContext.get()
const labelable = LabelableContext.get()

const element = usePartElement()

const matchedValidityKey = computed(() => (typeof match === 'string' ? match : null))

const isVisible = computed(() => {
  if (match === true) return true
  if (field.disabled.value) return false
  if (matchedValidityKey.value) {
    return Boolean(field.validityData.value.state[matchedValidityKey.value])
  }
  return field.hasFormError.value || field.validityData.value.state.valid === false
})

const currentMessages = computed<string | string[]>(() => {
  if (!matchedValidityKey.value && field.hasFormError.value) {
    const formError = field.formError.value
    if (!Array.isArray(formError)) return formError ?? ''
    return formError.length > 1 ? formError : (formError[0] ?? '')
  }
  const clientErrors = field.validityData.value.errors
  if (clientErrors.length > 1) return clientErrors
  return field.validityData.value.error
})

const lastShown = shallowRef<string | string[]>('')

const messages = computed(() => (isVisible.value ? currentMessages.value : lastShown.value))

const transition = useTransitionStatus({
  open: isVisible
})

const fieldState = computed<FieldErrorState>(() => ({
  ...getFieldState(field),
  disabled: field.disabled.value,
  transitionStatus: transition.status.value
}))

openChangeComplete({
  open: isVisible,
  element,
  onComplete: () => {
    if (!isVisible.value) transition.mounted.value = false
  }
})

watchEffect(() => {
  const current = id.value
  if (!isVisible.value || !current) return
  onWatcherCleanup(labelable.registerMessageId(current))
})

watchPostEffect(() => {
  if (isVisible.value) lastShown.value = currentMessages.value
})

const stateAttrs = computed(() =>
  dataAttrs({
    'starting-style': transition.status.value === 'starting',
    'ending-style': transition.status.value === 'ending'
  })
)
</script>

<template>
  <component
    :is="as"
    v-if="transition.mounted.value"
    ref="element"
    v-bind="mergeProps(field.stateAttrs.value, stateAttrs, { id }, $attrs)"
  >
    <slot v-if="slots.default" v-bind="fieldState" />
    <ul v-else-if="Array.isArray(messages)">
      <li v-for="(message, index) in messages" :key="index">{{ message }}</li>
    </ul>
    <template v-else>{{ messages }}</template>
  </component>
</template>
