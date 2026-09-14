<script setup lang="ts">
import { Tabs } from '@/components/tabs'

const never = false
</script>

<template>
  <Tabs.Root :value="0">
    <span v-if="never"></span>
    <Tabs.List>
      <Tabs.Tab :value="1" />
    </Tabs.List>
  </Tabs.Root>
</template>
