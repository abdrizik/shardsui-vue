<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'

const checked = shallowRef(false)
</script>

<template>
  <button @click="checked = !checked" data-testid="toggle">Toggle</button>
  <Checkbox.Root :checked="checked">
    <Checkbox.Indicator />
  </Checkbox.Root>
</template>
