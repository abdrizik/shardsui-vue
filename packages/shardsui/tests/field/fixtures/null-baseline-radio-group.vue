<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const value = shallowRef<string | null>(null)
</script>

<template>
  <Field.Root data-testid="root">
    <RadioGroup v-model:value="value">
      <Radio.Root value="a" />
      <Radio.Root value="b" />
    </RadioGroup>
  </Field.Root>
  <button type="button" @click="value = 'a'">a</button>
  <button type="button" @click="value = 'b'">b</button>
</template>
