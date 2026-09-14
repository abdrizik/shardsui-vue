<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import { CheckboxGroup } from '@/components/checkbox-group'
</script>

<template>
  <CheckboxGroup disabled>
    <Checkbox.Root name="red" value="red" data-testid="red" :disabled="false" />
    <Checkbox.Root name="green" value="green" data-testid="green" />
    <Checkbox.Root name="blue" value="blue" data-testid="blue" />
  </CheckboxGroup>
</template>
