<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'

const {
  handle,
  delay1 = 0,
  delay2 = undefined
} = defineProps<{
  handle: PreviewCardHandle<number>
  delay1?: number
  delay2?: number
}>()
</script>

<template>
  <button type="button" aria-label="Initial focus"></button>

  <PreviewCard.Trigger
    :handle="handle"
    href="#"
    id="trigger-1"
    :payload="1"
    :delay="delay1"
    data-testid="trigger1"
  >
    Trigger 1
  </PreviewCard.Trigger>
  <PreviewCard.Trigger
    v-if="delay2 !== undefined"
    :handle="handle"
    href="#"
    id="trigger-2"
    :payload="2"
    :delay="delay2"
    data-testid="trigger2"
  >
    Trigger 2
  </PreviewCard.Trigger>

  <PreviewCard.Root v-slot="{ payload }" :handle="handle">
    <PreviewCard.Portal keep-mounted>
      <PreviewCard.Positioner>
        <PreviewCard.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>
