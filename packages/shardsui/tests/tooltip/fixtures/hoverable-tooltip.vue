<script setup lang="ts">
import { Tooltip } from '@/components/tooltip'

const { disableHoverablePopup = false } = defineProps<{ disableHoverablePopup?: boolean }>()
</script>

<template>
  <div style="padding-top: 100px; padding-left: 100px">
    <Tooltip.Root :disable-hoverable-popup="disableHoverablePopup">
      <Tooltip.Trigger :delay="0" :close-delay="0" style="width: 120px; height: 40px">
        Trigger
      </Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Positioner data-testid="positioner" side="bottom" :side-offset="0">
          <Tooltip.Popup data-testid="popup" style="width: 120px; height: 40px"
            >Content</Tooltip.Popup
          >
        </Tooltip.Positioner>
      </Tooltip.Portal>
    </Tooltip.Root>
    <button type="button" data-testid="outside">Outside</button>
  </div>
</template>
