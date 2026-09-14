<script setup lang="ts">
import { Switch } from '@/components/switch'

const checked = defineModel<boolean>('checked', { default: false })
</script>

<template>
  <div>
    <button @click="checked = !checked">Toggle</button>
    <Switch.Root :checked="checked">
      <Switch.Thumb />
    </Switch.Root>
  </div>
</template>
