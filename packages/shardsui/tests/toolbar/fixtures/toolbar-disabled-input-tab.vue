<script setup lang="ts">
import { Toolbar } from '@/components/toolbar'
</script>

<template>
  <div>
    <Toolbar.Root>
      <Toolbar.Button data-testid="button" />
      <Toolbar.Input value="abcd" disabled />
    </Toolbar.Root>
    <button type="button" data-testid="after">after</button>
  </div>
</template>
