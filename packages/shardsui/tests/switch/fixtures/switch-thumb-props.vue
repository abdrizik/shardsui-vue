<script setup lang="ts">
import { Switch } from '@/components/switch'

defineOptions({ inheritAttrs: false })
</script>

<template>
  <Switch.Root>
    <Switch.Thumb data-testid="thumb" v-bind="$attrs" />
  </Switch.Root>
</template>
