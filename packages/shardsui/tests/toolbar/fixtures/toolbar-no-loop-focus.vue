<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'
</script>

<template>
  <Toolbar.Root :loop-focus="false">
    <Toolbar.Button data-testid="first">First</Toolbar.Button>
    <Toolbar.Button data-testid="last">Last</Toolbar.Button>
  </Toolbar.Root>
</template>
