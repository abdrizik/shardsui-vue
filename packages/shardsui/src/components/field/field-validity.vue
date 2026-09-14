<script setup lang="ts">
import { computed } from 'vue'
import { useTransitionStatus } from '@/internal/transition-status'
import { FieldContext, type FieldValidityState } from './context'

defineOptions({ inheritAttrs: false })

defineSlots<{ default: (state: FieldValidityState) => any }>()

const field = FieldContext.get()

const transition = useTransitionStatus({
  open: () => field.combinedValidityData.value.state.valid === false
})

const fieldState = computed<FieldValidityState>(() => ({
  validity: field.combinedValidityData.value.state,
  error: field.combinedValidityData.value.error,
  errors: field.combinedValidityData.value.errors,
  value: field.combinedValidityData.value.value,
  initialValue: field.combinedValidityData.value.initialValue,
  transitionStatus: transition.status.value
}))
</script>

<template>
  <slot v-bind="fieldState" />
</template>
