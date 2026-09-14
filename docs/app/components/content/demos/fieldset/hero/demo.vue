<script setup lang="ts">
import { Field } from '@shardsui/vue/field'
import { Fieldset } from '@shardsui/vue/fieldset'

const fields = [
  { label: 'Full name', placeholder: 'Otl Aicher' },
  { label: 'Expertise', placeholder: 'Design systems' }
]
</script>

<template>
  <Fieldset.Root class="flex w-full max-w-64 flex-col gap-4">
    <Fieldset.Legend class="text-base font-semibold text-gray-900">Profile</Fieldset.Legend>

    <Field.Root v-for="field in fields" :key="field.label" class="flex flex-col items-start gap-1">
      <Field.Label class="text-sm font-semibold text-gray-900">{{ field.label }}</Field.Label>
      <Field.Control
        :placeholder="field.placeholder"
        class="h-8 w-full rounded-md border border-gray-200 px-2 text-sm font-normal text-gray-900 focus:outline-2 focus:-outline-offset-1 focus:outline-gray-950 any-pointer-coarse:text-base"
      />
    </Field.Root>
  </Fieldset.Root>
</template>
