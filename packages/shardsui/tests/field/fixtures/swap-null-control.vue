<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Select } from '@/components/select'

const swapped = shallowRef(false)
</script>

<template>
  <Field.Root data-testid="root">
    <Field.Control v-if="swapped" data-testid="control" value="x" />
    <Select.Root v-else :value="null">
      <Select.Trigger>trigger</Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="a">a</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </Field.Root>
  <button type="button" @click="swapped = true">swap</button>
</template>
