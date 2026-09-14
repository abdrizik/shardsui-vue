<script setup lang="ts">
import { Select } from '@/components/select'

const {
  multiple = false,
  disabled = false,
  value = undefined,
  onSubmit
} = defineProps<{
  multiple?: boolean
  disabled?: boolean
  value?: string | string[] | null
  onSubmit?: (data: FormData) => void
}>()

function handleSubmit(event: SubmitEvent) {
  event.preventDefault()
  onSubmit?.(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form @submit="handleSubmit">
    <Select.Root :multiple="multiple" :disabled="disabled" :value="value as never" name="select">
      <Select.Trigger data-testid="trigger">
        <Select.Value />
      </Select.Trigger>
      <Select.Portal>
        <Select.Positioner>
          <Select.Popup>
            <Select.Item value="a">a</Select.Item>
            <Select.Item value="b">b</Select.Item>
            <Select.Item value="c">c</Select.Item>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
    <button type="submit">Submit</button>
  </form>
</template>
