<script setup lang="ts">
import { Accordion } from '@/components/accordion'
</script>

<template>
  <Accordion.Root hidden-until-found keep-mounted>
    <Accordion.Item :value="0">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 1</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel>Panel contents 1</Accordion.Panel>
    </Accordion.Item>
    <Accordion.Item :value="1">
      <Accordion.Header>
        <Accordion.Trigger>Trigger 2</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel :hidden-until-found="false" :keep-mounted="false"
        >Overridden panel</Accordion.Panel
      >
    </Accordion.Item>
  </Accordion.Root>
</template>
