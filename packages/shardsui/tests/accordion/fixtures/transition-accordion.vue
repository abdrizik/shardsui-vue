<script setup lang="ts">
import { Accordion } from '@/components/accordion'
</script>

<template>
  <Accordion.Root :value="[0]" :multiple="false">
    <Accordion.Item :value="0">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel class="transition-test-panel" data-testid="panel-1" keep-mounted>
        First panel
      </Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item :value="1">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel class="transition-test-panel" data-testid="panel-2" keep-mounted>
        Second panel
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

<style>
.transition-test-panel {
  overflow: hidden;
  height: var(--accordion-panel-height);
  transition: height 300ms linear;
}

.transition-test-panel[data-starting-style],
.transition-test-panel[data-ending-style] {
  height: 0;
}
</style>
