<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
</script>

<template>
  <div>
    <label data-testid="label" for="myCheckbox">Toggle</label>
    <Checkbox.Root id="myCheckbox" />
  </div>
</template>
