<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field, type FieldValidator } from '@/components/field'

const { validate } = defineProps<{ validate?: FieldValidator }>()

const selected = shallowRef<string[]>([])
</script>

<template>
  <Field.Root validation-mode="onChange" :validate="validate" name="apple">
    <CheckboxGroup :value="selected">
      <Field.Item>
        <Checkbox.Root value="one" data-testid="checkbox" />
      </Field.Item>
      <Field.Item>
        <Checkbox.Root value="two" data-testid="checkbox" />
      </Field.Item>
    </CheckboxGroup>
  </Field.Root>
  <button type="button" @click="selected = ['one']">Select externally</button>
</template>
