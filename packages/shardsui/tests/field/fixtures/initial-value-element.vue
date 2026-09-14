<script setup lang="ts">
import { useTemplateRef, watchPostEffect, type ComponentPublicInstance } from 'vue'
import { Field } from '@/components/field'

const { onElement } = defineProps<{ onElement: (element: HTMLInputElement) => void }>()

const control = useTemplateRef<ComponentPublicInstance>('control')

watchPostEffect(() => {
  const element = control.value?.$el
  if (element instanceof HTMLInputElement) onElement(element)
})
</script>

<template>
  <Field.Root>
    <Field.Control ref="control" value="foo" data-testid="input" />
  </Field.Root>
</template>
