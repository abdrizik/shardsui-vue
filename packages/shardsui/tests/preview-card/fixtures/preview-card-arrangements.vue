<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const {
  arrangement = 'contained',
  onOpenChange,
  onOpenChangeComplete,
  delay = 0,
  closeDelay = 0,
  popupClass
} = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
  onOpenChange?: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  delay?: number
  closeDelay?: number
  popupClass?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const handle = PreviewCard.createHandle()
</script>

<template>
  <button type="button" @click="open = true">Open</button>
  <button type="button" @click="open = false">Close</button>

  <PreviewCard.Root
    v-if="arrangement === 'contained'"
    v-model:open="open"
    @open-change-complete="onOpenChangeComplete"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <PreviewCard.Trigger href="#" :delay="delay" :close-delay="closeDelay" data-testid="trigger">
      Link
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-testid="positioner">
        <PreviewCard.Popup data-testid="popup" :class="popupClass">Content</PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
  <template v-else>
    <PreviewCard.Trigger
      :handle="handle"
      href="#"
      :delay="delay"
      :close-delay="closeDelay"
      data-testid="trigger"
    >
      Link
    </PreviewCard.Trigger>
    <PreviewCard.Trigger
      v-if="arrangement === 'multiple-detached'"
      :handle="handle"
      href="#"
      data-testid="trigger-2"
    >
      Another link
    </PreviewCard.Trigger>
    <PreviewCard.Root
      v-model:open="open"
      :handle="handle"
      @open-change-complete="onOpenChangeComplete"
      @update:open="(next) => onOpenChange?.(next)"
    >
      <PreviewCard.Portal>
        <PreviewCard.Positioner data-testid="positioner">
          <PreviewCard.Popup data-testid="popup" :class="popupClass">Content</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>
  </template>
</template>
