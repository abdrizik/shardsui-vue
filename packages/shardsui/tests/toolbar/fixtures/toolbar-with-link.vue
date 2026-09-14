<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'
</script>

<template>
  <Toolbar.Root>
    <Toolbar.Button data-testid="btn-1">Button 1</Toolbar.Button>
    <Toolbar.Link href="https://example.com" data-testid="link-1">Link 1</Toolbar.Link>
  </Toolbar.Root>
</template>
