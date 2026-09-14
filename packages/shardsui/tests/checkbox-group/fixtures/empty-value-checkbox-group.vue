<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'

const value = shallowRef([''])
</script>

<template>
  <CheckboxGroup v-model:value="value">
    <Checkbox.Root value="" data-testid="empty" />
    <Checkbox.Root value="other" data-testid="other" />
  </CheckboxGroup>
</template>
