<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

defineProps<{ onSubmit?: (event: SubmitEvent) => void }>()

const checked = shallowRef(true)
</script>

<template>
  <Form :on-submit="onSubmit">
    <Field.Root name="name">
      <Field.Control value="Alice" />
    </Field.Root>

    <input type="checkbox" :checked="checked" @change="checked = !checked" />

    <Field.Root v-if="checked" name="email">
      <Field.Control value="" required data-testid="email" />
    </Field.Root>

    <button>Submit</button>
  </Form>
</template>
