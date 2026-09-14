<script setup lang="ts">
import { useTemplateRef, type ComponentPublicInstance } from 'vue'
import { PreviewCard } from '@/components/preview-card'

const trigger = useTemplateRef<ComponentPublicInstance>('trigger')
const portalContainer = useTemplateRef<HTMLDivElement>('portalContainer')
</script>

<template>
  <div>
    <div ref="portalContainer" data-testid="portal-container"></div>
    <PreviewCard.Root>
      <PreviewCard.Trigger ref="trigger" href="#" :delay="0" data-testid="trigger">
        Trigger
      </PreviewCard.Trigger>
      <PreviewCard.Portal :container="portalContainer ?? undefined" keep-mounted>
        <PreviewCard.Positioner
          :anchor="(trigger?.$el as HTMLElement | null) ?? null"
          :collision-boundary="{ x: 0, y: 0, width: 300, height: 120 }"
          :collision-padding="0"
          data-testid="positioner"
          side="bottom"
          :side-offset="5"
        >
          <PreviewCard.Popup style="width: 80px; height: 40px">Preview Content</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </div>
</template>
