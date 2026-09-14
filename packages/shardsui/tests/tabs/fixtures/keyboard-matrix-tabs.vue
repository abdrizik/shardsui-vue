<script setup lang="ts">
import { DirectionProvider, type TextDirection } from '@/components/direction-provider'
import { Tabs, type TabsOrientation, type TabsValue } from '@/components/tabs'

const {
  direction = 'ltr',
  orientation = 'horizontal',
  value = 0,
  activateOnFocus = false,
  disabledIndex = -1,
  onValueChange,
  onKeydown
} = defineProps<{
  direction?: TextDirection
  orientation?: TabsOrientation
  value?: TabsValue
  activateOnFocus?: boolean
  disabledIndex?: number
  onValueChange?: (value: TabsValue | undefined) => void
  onKeydown?: (event: KeyboardEvent) => void
}>()
</script>

<template>
  <DirectionProvider :direction="direction">
    <Tabs.Root
      :value="value"
      :orientation="orientation"
      @update:value="(next) => onValueChange?.(next)"
    >
      <Tabs.List :activate-on-focus="activateOnFocus" @keydown="onKeydown">
        <Tabs.Tab :value="0" :disabled="disabledIndex === 0" />
        <Tabs.Tab :value="1" :disabled="disabledIndex === 1" />
        <Tabs.Tab :value="2" :disabled="disabledIndex === 2" />
      </Tabs.List>
    </Tabs.Root>
  </DirectionProvider>
</template>
