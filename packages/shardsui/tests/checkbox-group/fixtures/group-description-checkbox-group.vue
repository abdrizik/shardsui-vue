<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
</script>

<template>
  <Field.Root name="apple">
    <CheckboxGroup :value="[]" aria-describedby="external-description">
      <Field.Description data-testid="group-description">Group description</Field.Description>
      <Field.Item>
        <Field.Label>
          <Checkbox.Root value="fuji-apple" aria-describedby="checkbox-description" />
          Fuji
        </Field.Label>
      </Field.Item>
    </CheckboxGroup>
  </Field.Root>
</template>
