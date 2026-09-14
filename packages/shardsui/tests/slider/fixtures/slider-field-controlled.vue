<script setup lang="ts">
import { shallowRef } from 'vue'
import { Field, type FieldValidator } from '@/components/field'
import { Slider } from '@/components/slider'

const { validate = () => null } = defineProps<{ validate?: FieldValidator }>()

const value = shallowRef(0)
</script>

<template>
  <Field.Root validation-mode="onChange" :validate="validate" name="volume">
    <Slider.Root
      :value="value"
      @update:value="
        (next) => {
          if (!Array.isArray(next)) value = next
        }
      "
    >
      <Slider.Control>
        <Slider.Track>
          <Slider.Thumb data-testid="thumb" />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
  </Field.Root>
  <button type="button" @click="value = 5">Set externally</button>
</template>
