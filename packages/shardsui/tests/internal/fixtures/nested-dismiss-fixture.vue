<script setup lang="ts">
import type { DismissReason } from '@/internal/floating/dismiss'
import DismissLayer from './dismiss-layer.vue'

type Bubbles = boolean | { escapeKey?: boolean; outsidePress?: boolean }

type Props = {
  parentOutsidePress?: boolean
  childOutsidePress?: boolean
  parentBubbles?: Bubbles
  childBubbles?: Bubbles
  onParentDismiss?: (reason: DismissReason, event: Event) => void
  onChildDismiss?: (reason: DismissReason, event: Event) => void
}

const {
  parentOutsidePress = true,
  childOutsidePress = true,
  parentBubbles = undefined,
  childBubbles = undefined,
  onParentDismiss,
  onChildDismiss
} = defineProps<Props>()
</script>

<template>
  <div>
    <DismissLayer
      testid="parent-popup"
      :outside-press="parentOutsidePress"
      :bubbles="parentBubbles"
      :on-dismiss="onParentDismiss"
    >
      <DismissLayer
        testid="child-popup"
        :outside-press="childOutsidePress"
        :bubbles="childBubbles"
        :on-dismiss="onChildDismiss"
      />
    </DismissLayer>
    <div data-testid="outside">Outside element</div>
  </div>
</template>
