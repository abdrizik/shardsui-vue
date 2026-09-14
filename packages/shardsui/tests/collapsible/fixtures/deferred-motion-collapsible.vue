<script setup lang="ts">
import { shallowRef } from 'vue'
import { Collapsible } from '@/components/collapsible'

const {
  css = '',
  panelClass,
  panelStyle
} = defineProps<{
  css?: string
  panelClass?: string
  panelStyle?: string
}>()

const motionEnabled = shallowRef(false)
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <button type="button" data-testid="enable-motion" @click="motionEnabled = true">
    Enable motion
  </button>

  <Collapsible.Root>
    <Collapsible.Trigger>Trigger</Collapsible.Trigger>
    <Collapsible.Panel
      :class="motionEnabled ? panelClass : undefined"
      :style="motionEnabled ? panelStyle : undefined"
      hidden-until-found
      keep-mounted
      data-testid="panel"
    >
      This is panel content
    </Collapsible.Panel>
  </Collapsible.Root>
</template>
