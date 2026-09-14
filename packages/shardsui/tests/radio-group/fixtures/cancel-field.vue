<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const value = shallowRef<unknown>(undefined)
</script>

<template>
  <Field.Root>
    <RadioGroup :value="value" @update:value="() => {}">
      <Radio.Root value="a" data-testid="a">A<Radio.Indicator /></Radio.Root>
      <Radio.Root value="b" data-testid="b">B<Radio.Indicator /></Radio.Root>
    </RadioGroup>
  </Field.Root>
</template>
