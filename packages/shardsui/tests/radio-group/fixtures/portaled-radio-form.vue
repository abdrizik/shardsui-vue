<script setup lang="ts">
import { onBeforeUnmount, onMounted, useTemplateRef } from 'vue'
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const { onFormSubmit } = defineProps<{ onFormSubmit: (values: Record<string, unknown>) => void }>()

const portal = useTemplateRef<HTMLElement>('portal')

onMounted(() => {
  const element = portal.value
  element?.ownerDocument.body.appendChild(element)
})

onBeforeUnmount(() => portal.value?.remove())
</script>

<template>
  <Form @form-submit="onFormSubmit" data-testid="form">
    <Field.Root name="choice">
      <RadioGroup value="a">
        <div ref="portal">
          <Radio.Root value="a" />
        </div>
      </RadioGroup>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
