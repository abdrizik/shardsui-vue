<script setup lang="ts">
import { shallowRef } from 'vue'
import FocusManagerDialog from './focus-manager-dialog.vue'

const sideDialogOpen = shallowRef(false)
</script>

<template>
  <FocusManagerDialog :modal="false" trigger-testid="open-dialog">
    <template #default="{ close }">
      <button data-testid="close-dialog" aria-label="close-dialog" @click="close"></button>
      <button
        data-testid="open-nested-dialog"
        aria-label="open-nested-dialog"
        @click="sideDialogOpen = true"
      ></button>
    </template>
    <template #side>
      <FocusManagerDialog modal :open="sideDialogOpen">
        <template #default="{ close: closeSide }">
          <button
            data-testid="close-nested-dialog"
            aria-label="close-nested-dialog"
            @click="closeSide"
          ></button>
        </template>
      </FocusManagerDialog>
    </template>
  </FocusManagerDialog>
</template>
