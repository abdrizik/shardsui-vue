<script setup lang="ts">
import { Checkbox } from '@/components/checkbox'
import IconStub from '../../stubs/icon.vue'
</script>

<template>
  <Checkbox.Root :checked="true">
    <Checkbox.Indicator :as="IconStub" data-testid="indicator" />
  </Checkbox.Root>
</template>
