<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root>
    <CheckboxGroup :value="['1', '2']">
      <Checkbox.Root name="1" data-testid="checkbox-1" />
      <Checkbox.Root name="2" data-testid="checkbox-2" />
    </CheckboxGroup>
  </Field.Root>
</template>
