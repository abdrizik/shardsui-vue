<script setup lang="ts">
import { Tabs } from '@/components/tabs'
</script>

<template>
  <Tabs.Root :value="null">
    <Tabs.List>
      <Tabs.Indicator data-testid="bubble" />
    </Tabs.List>
  </Tabs.Root>
</template>
