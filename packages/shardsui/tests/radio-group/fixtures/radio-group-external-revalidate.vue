<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { validate } = defineProps<{ validate?: FieldValidator }>()

const value = shallowRef('a')
</script>

<template>
  <Field.Root validation-mode="onChange" :validate="validate" name="choices">
    <RadioGroup v-model:value="value">
      <Field.Item>
        <Radio.Root value="a" data-testid="radio" />
      </Field.Item>
      <Field.Item>
        <Radio.Root value="b" data-testid="radio" />
      </Field.Item>
    </RadioGroup>
  </Field.Root>
  <button type="button" @click="value = 'b'">Select externally</button>
</template>
