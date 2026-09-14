<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'
import type { PreviewCardHandle } from '@/components/preview-card/handle'
import { useOpen } from '../../dialog/fixtures/use-open'

const {
  handle,
  open: openProp = undefined,
  triggerId,
  onOpenChange
} = defineProps<{
  handle: PreviewCardHandle<number>
  open?: boolean
  triggerId?: string | null
  onOpenChange?: (open: boolean) => void
}>()

const open = useOpen(() => openProp)
</script>

<template>
  <PreviewCard.Root
    v-slot="{ payload }"
    v-model:open="open"
    :handle="handle"
    :trigger-id="triggerId"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-testid="positioner">
        <PreviewCard.Popup data-testid="popup">
          <span data-testid="content">{{ payload }}</span>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>

  <PreviewCard.Trigger :handle="handle" href="#" id="trigger" :payload="1" data-testid="trigger">
    Trigger
  </PreviewCard.Trigger>
</template>
