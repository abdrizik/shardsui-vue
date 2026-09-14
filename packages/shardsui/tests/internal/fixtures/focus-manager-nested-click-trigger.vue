<script setup lang="ts">
import { Popover } from '@/components/popover'
</script>

<template>
  <div>
    <Popover.Root>
      <Popover.Trigger data-testid="reference">reference</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup data-testid="floating">
            <Popover.Root>
              <Popover.Trigger data-testid="nested-trigger">nested</Popover.Trigger>
              <Popover.Portal>
                <Popover.Positioner>
                  <Popover.Popup data-testid="nested-floating">Nested content</Popover.Popup>
                </Popover.Positioner>
              </Popover.Portal>
            </Popover.Root>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
    <button data-testid="last">last</button>
  </div>
</template>
