<script setup lang="ts">
import { DirectionProvider } from '@/components/direction-provider'
import type { ModifierKey } from '@/internal/composite'
import type { CompositeOrientation } from '@/internal/floating/composite'
import CompositeRootFixture from './composite-root-fixture.vue'

type ItemDef = { label: string; disabled?: boolean }

const { rtl = false } = defineProps<{
  orientation?: CompositeOrientation
  loopFocus?: boolean
  enableHomeAndEnd?: boolean
  modifierKeys?: ModifierKey[]
  items?: ItemDef[]
  rtl?: boolean
  nativeInput?: boolean
}>()
</script>

<template>
  <DirectionProvider :direction="rtl ? 'rtl' : 'ltr'">
    <CompositeRootFixture v-bind="{ ...$props, rtl: undefined }" />
  </DirectionProvider>
</template>
