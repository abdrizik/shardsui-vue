<script setup lang="ts">
import { Toggle } from '@/components/toggle'
import { ToggleGroup } from '@/components/toggle-group'
import { Toolbar } from '@/components/toolbar'
</script>

<template>
  <Toolbar.Root>
    <Toolbar.Button data-testid="before">Before</Toolbar.Button>
    <Toolbar.Group disabled>
      <ToggleGroup>
        <Toggle value="one" data-testid="one">One</Toggle>
        <Toggle value="two" data-testid="two">Two</Toggle>
      </ToggleGroup>
    </Toolbar.Group>
    <Toolbar.Button data-testid="after">After</Toolbar.Button>
  </Toolbar.Root>
</template>
