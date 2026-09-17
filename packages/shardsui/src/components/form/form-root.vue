<script
  setup
  lang="ts"
  generic="FormValues extends Record<string, unknown> = Record<string, unknown>"
>
import { computed, getCurrentInstance, mergeProps } from 'vue'
import { usePartElement } from '@/internal/part-element'
import type { PartProps } from '@/internal/types'
import { FormContext } from './context'
import { useFormRoot, type FormErrors, type FormValidationMode } from './form'

type Props = PartProps & {
  validationMode?: FormValidationMode
  errors?: FormErrors
  onSubmit?: (event: SubmitEvent) => void
}

defineOptions({ inheritAttrs: false })

const {
  as = 'form',
  validationMode = 'onSubmit',
  errors: externalErrors,
  onSubmit
} = defineProps<Props>()

const emit = defineEmits<{ formSubmit: [values: FormValues] }>()

const instance = getCurrentInstance()

const emitFormSubmit = (values: Record<string, unknown>): void =>
  emit('formSubmit', values as FormValues)

const formSubmitListener = (): typeof emitFormSubmit | undefined => {
  const listeners = instance?.vnode.props
  return listeners?.onFormSubmit || listeners?.onFormSubmitOnce ? emitFormSubmit : undefined
}

defineSlots<{ default?: () => any }>()

const element = usePartElement()

const form = useFormRoot({
  validationMode: () => validationMode,
  externalErrors: () => externalErrors,
  element,
  onsubmit: (event) => onSubmit?.(event),
  onFormSubmit: formSubmitListener
})

FormContext.set(form)

defineExpose({ validate: form.validate })

const ownAttrs = computed(() => ({ novalidate: true, onSubmit: form.onsubmit }))
</script>

<template>
  <component :is="as" ref="element" v-bind="mergeProps(ownAttrs, $attrs)">
    <slot />
  </component>
</template>
