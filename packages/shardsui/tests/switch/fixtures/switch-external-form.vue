<script setup lang="ts">
import { Switch } from '@/components/switch'

const { onData } = defineProps<{ onData: (data: FormData) => void }>()

function onsubmit(event: SubmitEvent) {
  event.preventDefault()
  onData(new FormData(event.currentTarget as HTMLFormElement))
}
</script>

<template>
  <form id="external-form" @submit="onsubmit">
    <button type="submit">Submit</button>
  </form>
  <Switch.Root name="test-switch" form="external-form" data-testid="switch" />
</template>
