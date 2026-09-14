<script setup lang="ts">
import { shallowRef } from 'vue'
import { Dialog } from '@/components/dialog'

const parentOpen = shallowRef(false)
const childOpen = shallowRef(false)
</script>

<template>
  <div>
    <Dialog.Root v-model:open="parentOpen">
      <Dialog.Trigger data-testid="parent-reference">parent</Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup data-testid="parent-floating">
          <button
            data-testid="parent-floating-reference"
            @click="
              () => {
                childOpen = true
                parentOpen = false
              }
            "
          >
            open child
          </button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>

    <Dialog.Root v-model:open="childOpen">
      <Dialog.Portal>
        <Dialog.Popup data-testid="child-floating">
          <button data-testid="child-reference">child</button>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </div>
</template>
