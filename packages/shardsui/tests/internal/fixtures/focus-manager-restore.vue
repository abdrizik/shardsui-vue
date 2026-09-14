<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Popover } from '@/components/popover'

const { removed = false } = defineProps<{ removed?: boolean }>()

const two = useTemplateRef<HTMLButtonElement>('two')
</script>

<template>
  <div>
    <Popover.Root>
      <Popover.Trigger data-testid="reference">Open</Popover.Trigger>
      <Popover.Portal>
        <Popover.Positioner>
          <Popover.Popup data-testid="floating" :initial-focus="() => two">
            <button>one</button>
            <button v-if="!removed" ref="two" data-testid="two">two</button>
            <button data-testid="three">three</button>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
