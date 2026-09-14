<script setup lang="ts">
import { Field } from '@/components/field'
import { Fieldset } from '@/components/fieldset'
</script>

<template>
  <Fieldset.Root disabled>
    <Fieldset.Root>
      <Field.Root>
        <Field.Control data-testid="control" />
      </Field.Root>
    </Fieldset.Root>
  </Fieldset.Root>
</template>
