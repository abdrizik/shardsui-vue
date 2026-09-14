<script setup lang="ts">
import { ContextMenu } from '@/components/context-menu'
import type { CollisionAvoidance } from '@/internal/floating/anchor-positioning'
import { useOpen } from '../../dialog/fixtures/use-open'

type Anchor = { getBoundingClientRect: () => DOMRect }

const {
  open: openProp = undefined,
  collisionAvoidance = { side: 'flip' },
  anchor
} = defineProps<{
  open?: boolean
  collisionAvoidance?: CollisionAvoidance
  anchor?: Anchor
}>()

const open = useOpen(() => openProp, true)
</script>

<template>
  <div style="position: fixed; bottom: 0; left: 0; right: 0; height: 50px">
    <ContextMenu.Root v-model:open="open">
      <ContextMenu.Trigger data-testid="context-trigger">Surface</ContextMenu.Trigger>
      <ContextMenu.Portal>
        <ContextMenu.Positioner
          data-testid="positioner"
          :collision-avoidance="collisionAvoidance"
          :anchor="anchor"
        >
          <ContextMenu.Popup data-testid="context-popup" style="width: 150px; height: 100px">
            <ContextMenu.Item>Action 1</ContextMenu.Item>
            <ContextMenu.Item>Action 2</ContextMenu.Item>
            <ContextMenu.Item>Action 3</ContextMenu.Item>
          </ContextMenu.Popup>
        </ContextMenu.Positioner>
      </ContextMenu.Portal>
    </ContextMenu.Root>
  </div>
</template>
