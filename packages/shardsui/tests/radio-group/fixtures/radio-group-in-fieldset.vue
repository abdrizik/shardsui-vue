<script setup lang="ts">
import { Field } from '@/components/field'
import { Fieldset } from '@/components/fieldset'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'
</script>

<template>
  <Field.Root name="test">
    <Fieldset.Root>
      <Fieldset.Legend>Legend</Fieldset.Legend>
      <RadioGroup>
        <Field.Item>
          <Radio.Root value="a" />
        </Field.Item>
      </RadioGroup>
    </Fieldset.Root>
  </Field.Root>
</template>
