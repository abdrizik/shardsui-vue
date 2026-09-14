<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Field } from '@/components/field'
import { Form } from '@/components/form'

const { onsubmit = undefined } = defineProps<{ onsubmit?: (event: SubmitEvent) => void }>()
</script>

<template>
  <Form :on-submit="onsubmit">
    <Field.Root name="combobox">
      <Combobox.Root required>
        <Combobox.Trigger data-testid="trigger">
          <Combobox.Value />
        </Combobox.Trigger>
        <Combobox.Portal>
          <Combobox.Positioner>
            <Combobox.Popup data-testid="popup">
              <Combobox.Input data-testid="input" />
              <Combobox.List data-testid="list">
                <Combobox.Item value="a">a</Combobox.Item>
                <Combobox.Item value="b">b</Combobox.Item>
              </Combobox.List>
            </Combobox.Popup>
          </Combobox.Positioner>
        </Combobox.Portal>
      </Combobox.Root>
      <Field.Error match="valueMissing" data-testid="error">required</Field.Error>
    </Field.Root>
    <button type="submit">Submit</button>
  </Form>
</template>
