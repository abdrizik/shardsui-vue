<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'

type FieldProps = InstanceType<typeof Field.Root>['$props']

const { validate, validationMode = 'onBlur' } = defineProps<{
  validate?: FieldProps['validate']
  validationMode?: FieldProps['validationMode']
}>()
</script>

<template>
  <Field.Root :validation-mode="validationMode" :validate="validate">
    <Combobox.Root>
      <Combobox.Trigger data-testid="trigger" />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.Input data-testid="input" />
            <Combobox.List data-testid="list">
              <Combobox.Item value="1">Option 1</Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </Field.Root>
  <button data-testid="outside">Outside</button>
</template>
