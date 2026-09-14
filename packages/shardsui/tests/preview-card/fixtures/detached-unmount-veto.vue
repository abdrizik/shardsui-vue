<script setup lang="ts">
import { shallowRef } from 'vue'
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'

const { handle } = defineProps<{ handle: PreviewCardHandle<number> }>()

const open = shallowRef(true)
const showFirstTrigger = shallowRef(true)
</script>

<template>
  <div style="padding: 50px">
    <button data-testid="remove-first" @click="showFirstTrigger = false">remove</button>

    <div style="display: flex; gap: 120px">
      <PreviewCard.Trigger
        v-if="showFirstTrigger"
        :handle="handle"
        href="#"
        id="trigger-1"
        :payload="1"
        :delay="0"
        data-testid="trigger-1"
      >
        Trigger 1
      </PreviewCard.Trigger>
      <PreviewCard.Trigger
        :handle="handle"
        href="#"
        id="trigger-2"
        :payload="2"
        :delay="0"
        data-testid="trigger-2"
      >
        Trigger 2
      </PreviewCard.Trigger>
    </div>

    <PreviewCard.Root
      v-slot="{ payload }"
      :handle="handle"
      :open="open"
      trigger-id="trigger-1"
      @update:open="
        (next) => {
          if (next) open = true
        }
      "
    >
      <PreviewCard.Portal>
        <PreviewCard.Positioner side="bottom" align="start">
          <PreviewCard.Popup data-testid="popup">
            <span data-testid="content">{{ payload }}</span>
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </div>
</template>
