<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { Field, type FieldValidator } from '@/components/field'

const { validate, required = false } = defineProps<{
  validate?: FieldValidator
  required?: boolean
}>()

const checked = shallowRef(false)
</script>

<template>
  <Field.Root validation-mode="onChange" :validate="validate" name="terms">
    <Checkbox.Root v-model:checked="checked" data-testid="checkbox" :required="required" />
  </Field.Root>
  <button type="button" @click="checked = !checked">Toggle externally</button>
</template>
