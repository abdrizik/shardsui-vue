<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Select } from '@/components/select'

const value = shallowRef<string | null>(null)
</script>

<template>
  <Field.Root data-testid="root">
    <Select.Root v-model:value="value">
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
  <button type="button" @click="value = 'a'">set</button>
  <button type="button" @click="value = null">clear</button>
</template>
