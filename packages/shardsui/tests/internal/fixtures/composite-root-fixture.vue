<script setup lang="ts">
import { useTemplateRef } from 'vue'
import type { ModifierKey } from '@/internal/composite'
import { useCompositeRoot, type CompositeOrientation } from '@/internal/floating/composite'
import CompositeItemFixture from './composite-item-fixture.vue'

type ItemDef = { label: string; disabled?: boolean }

const {
  orientation = 'vertical',
  loopFocus = true,
  enableHomeAndEnd = false,
  modifierKeys = undefined,
  items = [{ label: '1' }, { label: '2' }, { label: '3' }],
  nativeInput = false
} = defineProps<{
  orientation?: CompositeOrientation
  loopFocus?: boolean
  enableHomeAndEnd?: boolean
  modifierKeys?: ModifierKey[]
  items?: ItemDef[]
  nativeInput?: boolean
}>()

const root = useTemplateRef<HTMLElement>('root')

const composite = useCompositeRoot({
  orientation: () => orientation,
  loopFocus: () => loopFocus,
  enableHomeAndEnd: () => enableHomeAndEnd,
  modifierKeys: () => modifierKeys,
  ref: root
})
</script>

<template>
  <div
    ref="root"
    data-testid="root"
    role="toolbar"
    tabindex="-1"
    @keydown="composite.onKeydown"
    @focusin="composite.onFocus"
  >
    <template v-for="item in items" :key="item.label">
      <CompositeItemFixture
        :composite="composite"
        :label="item.label"
        :disabled="item.disabled ?? false"
      />
      <input
        v-if="nativeInput && item.label === '1'"
        data-testid="native-input"
        type="text"
        value="abcd"
      />
    </template>
  </div>
</template>
