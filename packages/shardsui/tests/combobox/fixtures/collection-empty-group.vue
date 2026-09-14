<script setup lang="ts">
import { Combobox } from '@/components/combobox'
</script>

<template>
  <Combobox.Root open>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Group data-testid="group">
              <Combobox.Collection v-slot="{ item }">
                <span>{{ item }}</span>
              </Combobox.Collection>
            </Combobox.Group>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
