<script setup lang="ts">
import { Switch } from '@/components/switch'

const id = defineModel<string>('id', { default: 'switch-input-a' })
</script>

<template>
  <div>
    <label for="switch-input-a">Label A</label>
    <label for="switch-input-b">Label B</label>
    <Switch.Root :id="id">
      <Switch.Thumb />
    </Switch.Root>
    <button type="button" @click="id = 'switch-input-b'">Toggle</button>
  </div>
</template>
