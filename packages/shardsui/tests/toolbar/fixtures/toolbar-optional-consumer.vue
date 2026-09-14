<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'
import OptionalToolbarConsumer from './optional-toolbar-consumer.vue'
</script>

<template>
  <div>
    <OptionalToolbarConsumer />
    <Toolbar.Root orientation="vertical">
      <OptionalToolbarConsumer />
    </Toolbar.Root>
  </div>
</template>
