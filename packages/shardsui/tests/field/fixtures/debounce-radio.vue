<script setup lang="ts">
import { Field, type FieldValidator } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { validate } = defineProps<{ validate: FieldValidator }>()
</script>

<template>
  <Field.Root :validation-debounce-time="100" validation-mode="onChange" :validate="validate">
    <RadioGroup>
      <Radio.Root value="a" data-testid="item-a" />
      <Radio.Root value="b" data-testid="item-b" />
    </RadioGroup>
    <Field.Error />
  </Field.Root>
</template>
