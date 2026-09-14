<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'
import PreviewCardOpenOnMount from './preview-card-open-on-mount.vue'

const {
  handle,
  phase = 'outgoing',
  onOpenError
} = defineProps<{
  handle: PreviewCardHandle
  phase?: 'outgoing' | 'overlap' | 'incoming'
  onOpenError?: (error: unknown) => void
}>()
</script>

<template>
  <PreviewCard.Trigger :handle="handle" href="#" id="trigger" data-testid="trigger">
    Trigger
  </PreviewCard.Trigger>

  <PreviewCard.Root
    v-if="phase === 'outgoing' || phase === 'overlap'"
    key="outgoing"
    :handle="handle"
  >
    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup>Outgoing</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>

  <template v-if="phase === 'overlap' || phase === 'incoming'">
    <PreviewCard.Root key="incoming" :handle="handle">
      <PreviewCard.Portal>
        <PreviewCard.Positioner>
          <PreviewCard.Popup>Incoming</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
    <PreviewCardOpenOnMount :handle="handle" trigger-id="trigger" :on-error="onOpenError" />
  </template>
</template>
