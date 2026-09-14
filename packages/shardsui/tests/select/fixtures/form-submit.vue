<script setup lang="ts">
import { Field } from '@/components/field'
import { Form } from '@/components/form'
import { Select } from '@/components/select'

type Item = { code: string; label: string }

const { onFormSubmit } = defineProps<{
  onFormSubmit?: (values: Record<string, unknown>) => void
}>()

const items: Item[] = [
  { code: 'US', label: 'United States' },
  { code: 'CA', label: 'Canada' }
]
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="country">
      <Select.Root
        :value="items[0]"
        :item-to-string-label="(item: Item) => item.label"
        :item-to-string-value="(item: Item) => item.code"
      >
        <Select.Trigger>
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item v-for="item in items" :key="item.code" :value="item">
                {{ item.label }}
              </Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
    <button type="submit" data-testid="submit">Submit</button>
  </Form>
</template>
