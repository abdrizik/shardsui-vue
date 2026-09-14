<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@/components/select'

const itemsFiltered = shallowRef(false)

function onOpen(open: boolean) {
  if (open) {
    setTimeout(() => {
      itemsFiltered.value = true
    }, 0)
  }
}

function onComplete(open: boolean) {
  if (!open) {
    itemsFiltered.value = false
  }
}
</script>

<template>
  <Select.Root @open-change-complete="onComplete" @update:open="onOpen">
    <Select.Trigger>Toggle</Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item value="library">Add to Library</Select.Item>
          <template v-if="!itemsFiltered">
            <Select.Item value="playlist">Add to Playlist</Select.Item>
            <Select.Item value="next">Play Next</Select.Item>
            <Select.Item value="last">Play Last</Select.Item>
          </template>
          <Select.Item value="favorite">Favorite</Select.Item>
          <Select.Item value="share">Share</Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
