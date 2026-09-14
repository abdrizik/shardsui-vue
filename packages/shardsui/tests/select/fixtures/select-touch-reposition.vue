<script setup lang="ts">
import { shallowRef, useTemplateRef, watchPostEffect } from 'vue'
import { Select } from '@/components/select'

const { onOpenChangeComplete } = defineProps<{
  onOpenChangeComplete?: (open: boolean) => void
}>()

const items = Array.from({ length: 80 }, (_, index) => `Item ${index + 1}`)

const paddingTop = shallowRef(0)
const wrapper = useTemplateRef<HTMLElement>('wrapper')

watchPostEffect(() => {
  const current = paddingTop.value
  const element = wrapper.value?.querySelector<HTMLElement>('[role="combobox"]')
  if (!element) return
  const gap = document.documentElement.clientHeight - element.getBoundingClientRect().bottom
  if (Math.abs(gap - 100) <= 1) return
  paddingTop.value = current + gap - 100
})
</script>

<template>
  <div ref="wrapper" :style="{ paddingTop: `${paddingTop}px` }">
    <button data-testid="outside">Outside</button>
    <Select.Root @open-change-complete="onOpenChangeComplete">
      <Select.Trigger>Open</Select.Trigger>
      <Select.Portal>
        <Select.Positioner data-testid="positioner" :side-offset="8">
          <Select.Popup class="select-reopen-popup">
            <Select.ScrollUpArrow />
            <Select.Arrow />
            <Select.List class="select-reopen-list">
              <div aria-hidden="true" style="height: 75px">Start</div>
              <Select.Item v-for="item in items" :key="item" :value="item">{{ item }}</Select.Item>
              <div aria-hidden="true" style="height: 75px">End</div>
            </Select.List>
            <Select.ScrollDownArrow />
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  </div>
</template>

<style>
@keyframes select-reopen-exit {
  to {
    opacity: 0;
    transform: scale(0.9);
  }
}

.select-reopen-popup {
  width: 120px;
  transition:
    transform 150ms,
    opacity 150ms;
}

.select-reopen-popup[data-starting-style],
.select-reopen-popup[data-ending-style] {
  animation: select-reopen-exit 20ms linear;
}

.select-reopen-list {
  max-height: var(--available-height);
  overflow-y: auto;
}
</style>
