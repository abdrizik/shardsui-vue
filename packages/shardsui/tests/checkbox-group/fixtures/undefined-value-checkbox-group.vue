<script setup lang="ts">
import { shallowRef } from 'vue'
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'

const value = shallowRef<string[] | undefined>(['red'])
</script>

<template>
  <CheckboxGroup :value="value">
    <Checkbox.Root value="red" data-testid="red" />
  </CheckboxGroup>
  <button type="button" @click="value = undefined">Clear</button>
</template>
