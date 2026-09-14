<script setup lang="ts">
import { shallowRef } from 'vue'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'

const { validate } = defineProps<{ validate: () => string | null }>()

const value = shallowRef<string[]>([])
</script>

<template>
  <Field.Root name="group" validation-mode="onChange" :validate="validate">
    <CheckboxGroup :value="value" />
    <button type="button" @click="value = ['one']">Select</button>
  </Field.Root>
</template>
