<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const ITEMS = Array.from({ length: 40 }, (_, index) => `item-${index}`)
</script>

<!-- Anchor fixed near the bottom of the viewport: less room below than above,
     but still more than the List's capped height. -->
<template>
  <div style="position: fixed; bottom: 120px; left: 100px">
    <Combobox.Root open>
      <Combobox.Input data-testid="input" />
      <Combobox.Portal>
        <Combobox.Positioner data-testid="positioner" side="bottom" :side-offset="0">
          <Combobox.Popup data-testid="popup">
            <Combobox.List
              data-testid="list"
              style="max-height: min(80px, var(--available-height)); overflow-y: auto"
            >
              <Combobox.Item v-for="item in ITEMS" :key="item" :value="item" style="height: 30px">
                {{ item }}
              </Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </div>
</template>
