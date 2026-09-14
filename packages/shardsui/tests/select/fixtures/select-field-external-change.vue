<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import { Select } from '@/components/select'

const { validate } = defineProps<{ validate?: FieldValidator }>()

const value = shallowRef('a')

const validateFn = computed<FieldValidator>(
  () => validate ?? ((val: unknown) => (val === 'b' ? 'error' : null))
)
</script>

<template>
  <div>
    <Field.Root validation-mode="onChange" :validate="validateFn" name="flavor">
      <Select.Root :value="value" @update:value="(next) => (value = next as string)">
        <Select.Trigger data-testid="trigger">
          <Select.Value />
        </Select.Trigger>
        <Select.Portal>
          <Select.Positioner>
            <Select.Popup>
              <Select.Item value="a">Option A</Select.Item>
              <Select.Item value="b">Option B</Select.Item>
            </Select.Popup>
          </Select.Positioner>
        </Select.Portal>
      </Select.Root>
    </Field.Root>
    <button type="button" data-testid="set-external" @click="value = 'b'">Select externally</button>
  </div>
</template>
