<script setup lang="ts">
import FocusManagerDialog from './focus-manager-dialog.vue'
</script>

<template>
  <FocusManagerDialog trigger-testid="open-dialog">
    <template #default="{ close }">
      <FocusManagerDialog trigger-testid="open-nested-dialog">
        <template #default="{ close: closeNested }">
          <button
            data-testid="close-nested-dialog"
            aria-label="close-nested-dialog"
            @click="closeNested"
          ></button>
        </template>
      </FocusManagerDialog>
      <button data-testid="close-dialog" aria-label="close-dialog" @click="close"></button>
    </template>
  </FocusManagerDialog>
</template>
