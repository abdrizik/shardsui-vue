<script setup lang="ts">
import { Tabs, type TabsValue } from '@/components/tabs'

const {
  css = '',
  onTransitionend,
  onAnimationend
} = defineProps<{
  css?: string
  onTransitionend?: () => void
  onAnimationend?: () => void
}>()

const value = defineModel<TabsValue>('value', { default: 'one' })
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <Tabs.Root v-model:value="value">
    <Tabs.List>
      <Tabs.Tab value="one">One</Tabs.Tab>
      <Tabs.Tab value="two">Two</Tabs.Tab>
    </Tabs.List>
    <Tabs.Panel value="one">Panel one</Tabs.Panel>
    <Tabs.Panel
      value="two"
      class="animation-test-panel"
      data-testid="panel-two"
      @transitionend="() => onTransitionend?.()"
      @animationend="() => onAnimationend?.()"
    >
      Panel two
    </Tabs.Panel>
  </Tabs.Root>
</template>
