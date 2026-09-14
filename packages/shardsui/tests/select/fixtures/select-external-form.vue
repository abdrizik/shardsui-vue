<script setup lang="ts">
import { Select } from '@/components/select'

const {
  multiple = false,
  name = 'country',
  value = undefined,
  onSubmit
} = defineProps<{
  multiple?: boolean
  name?: string
  value?: string | string[] | null
  onSubmit?: (data: FormData) => void
}>()

function handleSubmit(event: SubmitEvent) {
  event.preventDefault()
  onSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form id="external-form" @submit="handleSubmit">
    <button type="submit">Submit</button>
  </form>

  <Select.Root :multiple="multiple" :name="name" :value="value as never" form="external-form">
    <Select.Trigger data-testid="trigger">
      <Select.Value />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="US">United States</Select.Item>
          <Select.Item value="CA">Canada</Select.Item>
          <Select.Item value="AU">Australia</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
