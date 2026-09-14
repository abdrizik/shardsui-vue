<script setup lang="ts">
import { computed, shallowRef, useTemplateRef } from 'vue'
import { useFocusManager } from '@/internal/floating/focus-manager'
import { createTriggerFocusGuards } from '@/internal/floating/trigger-focus-guards'
import FocusGuard from '@/internal/focus-guard.vue'
import FocusManagerPortal from './focus-manager-portal.vue'

const open = shallowRef(false)
const triggerElement = useTemplateRef<HTMLElement>('trigger')
const popupElement = useTemplateRef<HTMLElement>('popup')
const positionerElement = useTemplateRef<HTMLElement>('positioner')
const preGuard = useTemplateRef<{ $el: HTMLElement }>('preGuard')
const postGuard = useTemplateRef<{ $el: HTMLElement }>('postGuard')

const preFocusGuardElement = computed(() => preGuard.value?.$el ?? null)
const triggerFocusTargetElement = computed(() => postGuard.value?.$el ?? null)

function close() {
  open.value = false
}

useFocusManager({
  open,
  modal: false,
  enabled: true,
  popupElement,
  triggerElement,
  openMethod: 'mouse',
  initialFocus: () => undefined,
  finalFocus: () => undefined,
  closeOnFocusOut: true,
  onFocusOut: () => close,
  getNextFocusableElement: () => triggerFocusTargetElement.value
})

const guards = createTriggerFocusGuards({
  close,
  positionerElement,
  popupElement,
  triggerFocusTargetElement,
  preFocusGuardElement
})
</script>

<template>
  <span tabindex="0" data-testid="first"></span>
  <FocusGuard v-if="open" ref="preGuard" :on-focus="guards.closeAndFocusBefore" />
  <button
    ref="trigger"
    data-testid="reference"
    aria-label="reference"
    @click="open = true"
  ></button>
  <template v-if="open">
    <FocusGuard ref="postGuard" :on-focus="guards.closeAndFocusAfter" />
    <FocusManagerPortal>
      <div ref="positioner">
        <div ref="popup" data-testid="floating">
          <span tabindex="0" data-testid="inside"></span>
        </div>
      </div>
    </FocusManagerPortal>
  </template>
  <span tabindex="0" data-testid="last"></span>
</template>
