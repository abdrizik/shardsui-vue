<script setup lang="ts">
import { Field } from '@/components/field'
import { Slider } from '@/components/slider'
</script>

<template>
  <Field.Root>
    <Slider.Root data-testid="slider" aria-describedby="external-description">
      <Slider.Control>
        <Slider.Track>
          <Slider.Thumb />
        </Slider.Track>
      </Slider.Control>
    </Slider.Root>
    <Field.Description data-testid="description">Adjust the volume</Field.Description>
  </Field.Root>
</template>
