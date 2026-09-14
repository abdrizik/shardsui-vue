<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toggle } from '@/components/toggle'

const pressed = shallowRef(false)
</script>

<template>
  <input type="checkbox" :checked="pressed" @change="pressed = !pressed" />
  <Toggle :pressed="pressed" />
</template>
