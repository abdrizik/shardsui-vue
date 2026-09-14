<script setup lang="ts">
import { Dialog } from '@/components/dialog'

const {
  arrangement = 'contained',
  onOpenChange,
  onOpenChangeComplete,
  modal = true,
  disablePointerDismissal = false,
  includeBackdrop = false,
  container = null,
  popupClass,
  popupTestId = 'dialog-popup',
  triggerText = 'Open'
} = defineProps<{
  arrangement?: 'contained' | 'detached' | 'multiple-detached'
  onOpenChange?: (open: boolean) => void
  onOpenChangeComplete?: (open: boolean) => void
  modal?: boolean | 'trap-focus'
  disablePointerDismissal?: boolean
  includeBackdrop?: boolean
  container?: HTMLElement | null
  popupClass?: string
  popupTestId?: string
  triggerText?: string
}>()

const open = defineModel<boolean>('open', { default: false })

const slots = defineSlots<{ default?: () => any }>()

const handle = Dialog.createHandle()
</script>

<template>
  <Dialog.Root
    v-if="arrangement === 'contained'"
    v-model:open="open"
    :modal="modal"
    :disable-pointer-dismissal="disablePointerDismissal"
    @open-change-complete="onOpenChangeComplete"
    @update:open="(next) => onOpenChange?.(next)"
  >
    <Dialog.Trigger data-testid="trigger">{{ triggerText }}</Dialog.Trigger>
    <Dialog.Portal :container="container">
      <Dialog.Backdrop
        v-if="includeBackdrop"
        data-testid="backdrop"
        style="position: fixed; z-index: 10; inset: 0"
      />
      <Dialog.Popup
        :data-testid="popupTestId"
        :class="popupClass"
        style="position: fixed; z-index: 10"
      >
        <slot v-if="slots.default" />
        <template v-else>
          <Dialog.Title>title text</Dialog.Title>
          <Dialog.Description>description text</Dialog.Description>
          <p>Dialog content</p>
          <Dialog.Close>Close</Dialog.Close>
        </template>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
  <template v-else>
    <Dialog.Trigger :handle="handle" data-testid="trigger">{{ triggerText }}</Dialog.Trigger>
    <Dialog.Trigger
      v-if="arrangement === 'multiple-detached'"
      :handle="handle"
      data-testid="trigger-2"
    >
      Open another
    </Dialog.Trigger>
    <Dialog.Root
      v-model:open="open"
      :handle="handle"
      :modal="modal"
      :disable-pointer-dismissal="disablePointerDismissal"
      @open-change-complete="onOpenChangeComplete"
      @update:open="(next) => onOpenChange?.(next)"
    >
      <Dialog.Portal :container="container">
        <Dialog.Backdrop
          v-if="includeBackdrop"
          data-testid="backdrop"
          style="position: fixed; z-index: 10; inset: 0"
        />
        <Dialog.Popup
          :data-testid="popupTestId"
          :class="popupClass"
          style="position: fixed; z-index: 10"
        >
          <slot v-if="slots.default" />
          <template v-else>
            <Dialog.Title>title text</Dialog.Title>
            <Dialog.Description>description text</Dialog.Description>
            <p>Dialog content</p>
            <Dialog.Close>Close</Dialog.Close>
          </template>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  </template>
</template>
