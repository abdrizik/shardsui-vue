<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Drawer } from '@/components/drawer'

const { onOpenChange = undefined } = defineProps<{ onOpenChange?: (open: boolean) => void }>()

const items = [
  'Apple',
  'Banana',
  'Cherry',
  'Date',
  'Elderberry',
  'Fig',
  'Grape',
  'Honeydew',
  'Kiwi',
  'Lime'
]
</script>

<template>
  <Drawer.Root open @update:open="(next) => onOpenChange?.(next)">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport>
        <Drawer.Popup>
          <Drawer.Content>
            <Combobox.Root open>
              <Combobox.Input />
              <Combobox.Portal>
                <Combobox.Positioner>
                  <Combobox.Popup>
                    <Combobox.List style="max-height: 40px; overflow: auto">
                      <Combobox.Item v-for="item in items" :key="item" :value="item">
                        {{ item }}
                      </Combobox.Item>
                    </Combobox.List>
                  </Combobox.Popup>
                </Combobox.Positioner>
              </Combobox.Portal>
            </Combobox.Root>
          </Drawer.Content>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
