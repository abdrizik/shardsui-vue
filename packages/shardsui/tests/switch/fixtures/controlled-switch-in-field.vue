<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import type { FormValidationMode } from '@/components/form'
import { Switch } from '@/components/switch'

const {
  validate,
  validationMode,
  required = false
} = defineProps<{
  validate?: FieldValidator
  validationMode?: FormValidationMode
  required?: boolean
}>()

const checked = shallowRef(false)
</script>

<template>
  <div>
    <Field.Root :validate="validate" :validation-mode="validationMode" name="newsletters">
      <Switch.Root
        data-testid="switch"
        :required="required"
        :checked="checked"
        @update:checked="(next) => (checked = next)"
      >
        <Switch.Thumb />
      </Switch.Root>
    </Field.Root>
    <button type="button" @click="checked = !checked">Toggle externally</button>
  </div>
</template>
