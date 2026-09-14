<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Fieldset } from '@/components/fieldset'

const outerDisabled = shallowRef(false)
const innerDisabled = shallowRef(true)
</script>

<template>
  <Fieldset.Root :disabled="outerDisabled">
    <Fieldset.Root :disabled="innerDisabled">
      <Field.Root data-testid="root">
        <Field.Control data-testid="control" />
      </Field.Root>
    </Fieldset.Root>
  </Fieldset.Root>
  <button type="button" @click="outerDisabled = true">Disable outer</button>
  <button type="button" @click="innerDisabled = false">Enable inner</button>
  <button type="button" @click="outerDisabled = false">Enable outer</button>
</template>
