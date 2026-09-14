<script setup lang="ts">
import { shallowRef } from 'vue'
import { PreviewCard } from '@/components/preview-card'

const open = shallowRef(false)
const triggerId = shallowRef<string | null>(null)

function onOpenChange(next: boolean) {
  open.value = next
  if (!next) triggerId.value = null
}
</script>

<template>
  <div>
    <PreviewCard.Root :open="open" :trigger-id="triggerId" @update:open="onOpenChange">
      <PreviewCard.Trigger
        href="#"
        id="trigger-1"
        data-testid="trigger-1"
        :delay="0"
        style="display: inline"
      >
        Trigger 1
      </PreviewCard.Trigger>
      <PreviewCard.Trigger
        href="#"
        id="trigger-2"
        data-testid="trigger-2"
        :delay="0"
        style="display: inline"
      >
        Trigger 2
      </PreviewCard.Trigger>
      <PreviewCard.Portal>
        <PreviewCard.Positioner data-testid="positioner" side="bottom" :side-offset="5">
          <PreviewCard.Popup style="width: 80px; height: 40px">Preview Content</PreviewCard.Popup>
        </PreviewCard.Positioner>
      </PreviewCard.Portal>
    </PreviewCard.Root>

    <button
      type="button"
      @click="
        () => {
          open = true
          triggerId = 'trigger-2'
        }
      "
    >
      Switch
    </button>
  </div>
</template>
