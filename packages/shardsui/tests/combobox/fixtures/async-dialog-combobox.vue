<script setup lang="ts">
import { onWatcherCleanup, shallowRef, watchPostEffect } from 'vue'
import { Combobox } from '@/components/combobox'
import { Dialog } from '@/components/dialog'
import ItemsList from './items-list.vue'

const loading = shallowRef(true)
const value = shallowRef<string | null>(null)

watchPostEffect(() => {
  const timeout = setTimeout(() => (loading.value = false), 0)
  onWatcherCleanup(() => clearTimeout(timeout))
})
</script>

<template>
  <Dialog.Root open>
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Popup>
        <form>
          <label for="name">Name</label>
          <input id="name" :disabled="loading" />

          <label for="fruit">Fruit</label>
          <Combobox.Root
            :items="['Apple', 'Banana', 'Cherry']"
            :value="value"
            @update:value="(next: unknown) => (value = next as string | null)"
            :disabled="loading"
          >
            <Combobox.Input id="fruit" placeholder="Select fruit..." />
            <Combobox.Trigger aria-label="Open" />
            <Combobox.Portal>
              <Combobox.Positioner>
                <Combobox.Popup data-testid="popup">
                  <ItemsList />
                </Combobox.Popup>
              </Combobox.Positioner>
            </Combobox.Portal>
          </Combobox.Root>

          <button type="button">Cancel</button>
          <button type="submit" :disabled="loading">Save</button>
        </form>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
