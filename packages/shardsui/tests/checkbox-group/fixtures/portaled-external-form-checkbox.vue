<script setup lang="ts">
import { onUnmounted } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const externalForm = document.createElement('form')
document.body.appendChild(externalForm)

onUnmounted(() => externalForm.remove())
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="group">
      <CheckboxGroup :value="[]">
        <Teleport :to="externalForm">
          <div>
            <Checkbox.Root value="external" required />
          </div>
        </Teleport>
      </CheckboxGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
