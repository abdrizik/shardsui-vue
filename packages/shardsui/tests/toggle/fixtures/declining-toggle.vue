<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toggle } from '@/components/toggle'

const pressed = shallowRef(false)
</script>

<template>
  <Toggle :pressed="pressed" @update:pressed="() => {}" />
</template>
