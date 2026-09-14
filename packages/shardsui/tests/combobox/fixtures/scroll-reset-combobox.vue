<script setup lang="ts">
import { shallowRef, useTemplateRef, watchPostEffect } from 'vue'
import { Combobox } from '@/components/combobox'
import ItemsList from './items-list.vue'

const { variant = 'list', items = Array.from({ length: 50 }, (_, index) => `item-${index}`) } =
  defineProps<{
    variant?: 'list' | 'wrapper' | 'clip' | 'dialog' | 'inline-dialog'
    items?: string[]
  }>()

const dialogRef = useTemplateRef<HTMLElement>('dialogRef')
const dialogElement = shallowRef<HTMLElement | null>(null)

watchPostEffect(() => {
  dialogElement.value = dialogRef.value ?? null
})
</script>

<template>
  <Combobox.Root v-if="variant === 'inline-dialog'" :items="items" inline open>
    <div
      role="dialog"
      data-testid="dialog"
      style="height: 80px; overflow-y: auto; overflow-anchor: none"
    >
      <div style="height: 100px"></div>
      <Combobox.Input data-testid="input" />
      <div data-testid="viewport" style="height: 100px; overflow-y: auto">
        <ItemsList />
      </div>
    </div>
  </Combobox.Root>
  <Combobox.Root v-else-if="variant === 'dialog'" :items="items" open>
    <div
      ref="dialogRef"
      role="dialog"
      data-testid="dialog"
      style="height: 80px; overflow-y: auto; overflow-anchor: none"
    >
      <div style="height: 100px"></div>
      <Combobox.Input data-testid="input" />
      <Combobox.Portal :container="dialogElement">
        <Combobox.Positioner>
          <Combobox.Popup>
            <ItemsList />
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </div>
  </Combobox.Root>
  <Combobox.Root v-else :items="items">
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <div
            v-if="variant === 'wrapper'"
            data-testid="viewport"
            style="max-height: 100px; overflow-y: auto"
          >
            <Combobox.List data-testid="list" style="overflow-y: auto">
              <Combobox.Item v-for="item in items" :key="item" :value="item">{{
                item
              }}</Combobox.Item>
            </Combobox.List>
          </div>
          <div
            v-else-if="variant === 'clip'"
            data-testid="viewport"
            style="height: 100px; overflow-y: auto"
          >
            <div style="overflow-y: clip">
              <Combobox.List data-testid="list">
                <Combobox.Item v-for="item in items" :key="item" :value="item">
                  {{ item }}
                </Combobox.Item>
              </Combobox.List>
            </div>
          </div>
          <Combobox.List v-else data-testid="list" style="max-height: 100px; overflow-y: auto">
            <Combobox.Item v-for="item in items" :key="item" :value="item">{{
              item
            }}</Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
