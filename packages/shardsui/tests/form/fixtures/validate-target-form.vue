<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { initialValidate, renamedValidate, replacementValidate } = defineProps<{
  initialValidate: () => string | null
  renamedValidate: () => string | null
  replacementValidate: () => string | null
}>()

const form = useTemplateRef<{ validate: (fieldName?: string) => void }>('form')
const step = shallowRef(0)

const visible = computed(() => step.value !== 2)
const name = computed(() => (step.value === 0 ? 'initial' : 'current'))
const validate = computed(() => {
  if (step.value === 1) return renamedValidate
  if (step.value > 1) return replacementValidate
  return initialValidate
})
</script>

<template>
  <Form ref="form">
    <Field.Root v-if="visible" :key="step" :name="name" :validate="validate">
      <Field.Control :id="`control-${step}`" />
    </Field.Root>
  </Form>
  <button type="button" @click="step = 1">Rename</button>
  <button type="button" @click="step = 2">Unmount</button>
  <button type="button" @click="step = 3">Replace</button>
  <button type="button" @click="form?.validate('initial')">Validate initial</button>
  <button type="button" @click="form?.validate('current')">Validate current</button>
</template>
