<script setup lang="ts">
import { shallowRef } from 'vue'
import { Fieldset } from '@/components/fieldset'

const legendId = shallowRef('legend-a')
const showLegend = shallowRef(true)
</script>

<template>
  <Fieldset.Root>
    <Fieldset.Legend v-if="showLegend" :id="legendId">Legend</Fieldset.Legend>
  </Fieldset.Root>
  <button type="button" @click="legendId = 'legend-b'">Change id</button>
  <button type="button" @click="showLegend = false">Remove legend</button>
</template>
