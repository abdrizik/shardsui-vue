<script setup lang="ts">
import { PreviewCard } from '@/components/preview-card'

const {
  parentOpen = false,
  childOpen = false,
  closeDelay = 0
} = defineProps<{ parentOpen?: boolean; childOpen?: boolean; closeDelay?: number }>()
</script>

<template>
  <button type="button" data-testid="outside">Outside</button>

  <PreviewCard.Root :open="parentOpen">
    <PreviewCard.Trigger href="#" :delay="0" :close-delay="closeDelay" data-testid="parent-trigger">
      Parent
    </PreviewCard.Trigger>
    <PreviewCard.Portal>
      <PreviewCard.Positioner data-testid="parent-positioner">
        <PreviewCard.Popup data-testid="parent-popup">
          <div>Parent content</div>
          <PreviewCard.Root :open="childOpen">
            <PreviewCard.Trigger
              href="#"
              :delay="0"
              :close-delay="closeDelay"
              data-testid="child-trigger"
            >
              Child
            </PreviewCard.Trigger>
            <PreviewCard.Portal>
              <PreviewCard.Positioner data-testid="child-positioner">
                <PreviewCard.Popup data-testid="child-popup">Child content</PreviewCard.Popup>
              </PreviewCard.Positioner>
            </PreviewCard.Portal>
          </PreviewCard.Root>
        </PreviewCard.Popup>
      </PreviewCard.Positioner>
    </PreviewCard.Portal>
  </PreviewCard.Root>
</template>
