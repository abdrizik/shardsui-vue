<script setup lang="ts">
import { CheckboxGroup } from '@/components/checkbox-group'

const { id } = defineProps<{ id?: string }>()
</script>

<template>
  <CheckboxGroup :id="id" />
</template>
