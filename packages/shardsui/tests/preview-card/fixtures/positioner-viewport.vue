<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const { withViewport = false } = defineProps<{ withViewport?: boolean }>()
</script>

<template>
  <PreviewCard.Root open>
    <PreviewCard.Trigger as="div" style="width: 72px; height: 36px">Trigger</PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-testid="positioner">
        <PreviewCard.Popup style="width: 52px; height: 24px">
          <PreviewCard.Viewport v-if="withViewport">Popup</PreviewCard.Viewport>
          <template v-else>Popup</template>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>
