import { computed, shallowRef, toValue, type MaybeRefOrGetter } from 'vue'
import { dataAttrs } from '@/internal/data-attrs'
import type { FieldsetState } from './context'

type FieldsetRootOptions = {
  disabled: MaybeRefOrGetter<boolean>
}

export function useFieldsetRoot(options: FieldsetRootOptions) {
  const labelId = shallowRef<string | undefined>(undefined)
  const disabled = computed(() => toValue(options.disabled))
  const state = computed<FieldsetState>(() => ({ disabled: disabled.value }))
  const stateAttrs = computed(() => dataAttrs({ disabled: disabled.value }))

  return { labelId, disabled, state, stateAttrs }
}

export type FieldsetRoot = ReturnType<typeof useFieldsetRoot>
