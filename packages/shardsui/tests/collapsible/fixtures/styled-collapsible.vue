<script setup lang="ts">
import { Collapsible } from '@/components/collapsible'

const {
  css = '',
  panelClass,
  panelStyle,
  keepMounted = false,
  hiddenUntilFound = false,
  content = 'This is panel content'
} = defineProps<{
  css?: string
  panelClass?: string
  panelStyle?: string
  keepMounted?: boolean
  hiddenUntilFound?: boolean
  content?: string
}>()

const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <component :is="'style'">{{ css }}</component>

  <Collapsible.Root v-model:open="open">
    <Collapsible.Trigger>Trigger</Collapsible.Trigger>
    <Collapsible.Panel
      :class="panelClass"
      :style="panelStyle"
      :keep-mounted="keepMounted"
      :hidden-until-found="hiddenUntilFound"
      data-testid="panel"
    >
      {{ content }}
    </Collapsible.Panel>
  </Collapsible.Root>
</template>
