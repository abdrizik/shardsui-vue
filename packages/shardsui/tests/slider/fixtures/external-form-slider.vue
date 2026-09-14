<script setup lang="ts">
import { Slider } from '@/components/slider'

const { value = 25, onNativeSubmit } = defineProps<{
  value?: number
  onNativeSubmit?: (data: FormData) => void
}>()

function onSubmit(event: Event) {
  event.preventDefault()
  onNativeSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form id="external-form" @submit="onSubmit">
    <button type="submit">Submit</button>
  </form>

  <Slider.Root :value="value" name="slider" form="external-form" data-testid="root">
    <Slider.Control data-testid="control">
      <Slider.Track>
        <Slider.Thumb data-testid="thumb" />
      </Slider.Track>
    </Slider.Control>
  </Slider.Root>
</template>
