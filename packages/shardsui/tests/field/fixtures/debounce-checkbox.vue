<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { Field, type FieldValidator } from '@/components/field'

const { validate } = defineProps<{ validate: FieldValidator }>()
</script>

<template>
  <Field.Root :validation-debounce-time="100" validation-mode="onChange" :validate="validate">
    <Checkbox.Root />
    <Field.Error />
  </Field.Root>
</template>
