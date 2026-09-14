<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const { showFirstTrigger = true } = defineProps<{ showFirstTrigger?: boolean }>()
</script>

<template>
  <PreviewCard.Root v-slot="{ payload }" open trigger-id="trigger-1">
    <button type="button" aria-label="Initial focus"></button>
    <PreviewCard.Trigger
      v-if="showFirstTrigger"
      href="#"
      id="trigger-1"
      :payload="1"
      :delay="0"
      data-testid="trigger-1"
    >
      Trigger 1
    </PreviewCard.Trigger>
    <PreviewCard.Trigger href="#" id="trigger-2" :payload="2" :delay="0" data-testid="trigger-2">
      Trigger 2
    </PreviewCard.Trigger>

    <PreviewCard.Portal>
      <PreviewCard.Positioner side="bottom" align="start">
        <PreviewCard.Popup>
          <span data-testid="content">{{ payload }}</span>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>
