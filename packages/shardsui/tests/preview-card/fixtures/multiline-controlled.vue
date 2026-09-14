<script setup lang="ts">
import { shallowRef } from 'vue'
import { PreviewCard } from '@/components/preview-card'

const sideOffset = 5

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)

function onOpenChange(next: boolean) {
  open.value = next
  if (!next) triggerId.value = null
}
</script>

<template>
  <div style="width: 140px">
    <PreviewCard.Root :open="open" :trigger-id="triggerId" @update:open="onOpenChange">
      <PreviewCard.Trigger
        :delay="0"
        data-testid="trigger"
        id="trigger"
        style="display: inline; line-height: 20px"
      >
        This is a long text that will wrap across multiple lines in the trigger element
      </PreviewCard.Trigger>
      <PreviewCard.Portal keep-mounted>
        <PreviewCard.Positioner data-testid="positioner" side="bottom" :side-offset="sideOffset">
          <PreviewCard.Popup data-testid="popup" style="width: 80px; height: 40px">
            Preview Content
          </PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>

    <button
      type="button"
      @click="
        () => {
          triggerId = 'trigger'
          open = true
        }
      "
    >
      Open
    </button>
    <button type="button" @click="open = false">Close</button>
  </div>
</template>
