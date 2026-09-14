<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field } from '@/components/field'
import { Fieldset } from '@/components/fieldset'
import { Radio } from '@/components/radio'
import { RadioGroup } from '@/components/radio-group'

const explicit = shallowRef(true)
const fieldLabel = shallowRef('field-label-a')
const showFieldLabel = shallowRef(true)
const legend = shallowRef('legend-a')
const showLegend = shallowRef(true)
</script>

<template>
  <span id="explicit-label">Explicit label</span>
  <Field.Root name="choice">
    <Field.Label v-if="showFieldLabel" :key="fieldLabel" as="span" :id="fieldLabel">
      Field label
    </Field.Label>
    <Fieldset.Root>
      <Fieldset.Legend v-if="showLegend" :key="legend" :id="legend">Legend</Fieldset.Legend>
      <RadioGroup v-bind="explicit ? { 'aria-labelledby': 'explicit-label' } : {}">
        <Radio.Root value="a" />
      </RadioGroup>
    </Fieldset.Root>
  </Field.Root>
  <button type="button" @click="explicit = false">remove explicit</button>
  <button
    type="button"
    @click="
      () => {
        fieldLabel = 'field-label-b'
        showFieldLabel = true
      }
    "
  >
    mount field replacement
  </button>
  <button type="button" @click="showFieldLabel = false">remove field label</button>
  <button
    type="button"
    @click="
      () => {
        legend = 'legend-b'
        showLegend = true
      }
    "
  >
    mount legend replacement
  </button>
  <button type="button" @click="showLegend = false">remove legend</button>
</template>
