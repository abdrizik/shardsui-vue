<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const names = shallowRef(['a', 'b'])
</script>

<template>
  <button type="button" @click="names = ['b', 'a']">Reorder</button>
  <Form>
    <Field.Root v-for="name in names" :key="name" :name="name">
      <Checkbox.Root required :data-testid="name" />
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
