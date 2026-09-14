<script setup lang="ts">
import { Accordion } from '@/components/accordion'

const { value = ['one'] } = defineProps<{ value?: unknown[] }>()
</script>

<template>
  <Accordion.Root :value="value">
    <Accordion.Item value="one">
      <Accordion.Header>
        <Accordion.Trigger>Trigger</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel
        data-testid="panel"
        style="
          animation-duration: 100ms;
          animation-name: panel-slide-down;
          animation-timing-function: linear;
        "
      >
        Panel content
      </Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>
