<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

type FieldProps = InstanceType<typeof Field.Root>['$props']

const { validate = (value: unknown) => (value === 'a' ? 'error' : null) } = defineProps<{
  validate?: FieldProps['validate']
}>()
</script>

<template>
  <Form>
    <Field.Root :validate="validate">
      <Combobox.Root required>
        <Combobox.Input data-testid="input" />
        <Combobox.Clear data-testid="clear" />
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup data-testid="popup">
              <Combobox.List data-testid="list">
                <Combobox.Item value="a">a</Combobox.Item>
                <Combobox.Item value="b">b</Combobox.Item>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
    </Field.Root>
    <button type="submit">submit</button>
  </Form>
</template>
