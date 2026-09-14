<script setup lang="ts">
import { shallowRef } from 'vue'
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
import { Toolbar } from '@/components/toolbar'

const { multiple = false, inToolbar = false } = defineProps<{
  multiple?: boolean
  inToolbar?: boolean
}>()

const value = shallowRef<string[]>(['one'])
</script>

<template>
  <Toolbar.Root v-if="inToolbar">
    <Toolbar.Group>
      <ToggleGroup v-model:value="value" :multiple="multiple" data-testid="toggle-group">
        <Toggle value="one">One</Toggle>
        <Toggle value="two">Two</Toggle>
      </ToggleGroup>
    </Toolbar.Group>
  </Toolbar.Root>
  <ToggleGroup v-else v-model:value="value" :multiple="multiple" data-testid="toggle-group">
    <Toggle value="one">One</Toggle>
    <Toggle value="two">Two</Toggle>
  </ToggleGroup>
</template>
