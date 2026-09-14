<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'

const { handle, rootMounted = true } = defineProps<{
  handle: PreviewCardHandle<number>
  rootMounted?: boolean
}>()
</script>

<template>
  <PreviewCard.Trigger :handle="handle" href="#" id="trigger" :payload="1" data-testid="trigger">
    Trigger
  </PreviewCard.Trigger>

  <PreviewCard.Root v-if="rootMounted" v-slot="{ payload }" :handle="handle">
    <span data-testid="payload">{{ payload ?? 'No payload' }}</span>
    <PreviewCard.Portal>
      <PreviewCard.Positioner>
        <PreviewCard.Popup data-testid="popup">Preview Card Content</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>
