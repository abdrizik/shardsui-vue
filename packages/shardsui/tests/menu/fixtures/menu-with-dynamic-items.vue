<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const itemsFiltered = shallowRef(false)

function handleOpenChange(newOpen: boolean) {
  if (newOpen) {
    setTimeout(() => {
      itemsFiltered.value = true
    }, 0)
  }
}

function handleOpenChangeComplete(newOpen: boolean) {
  if (!newOpen) {
    itemsFiltered.value = false
  }
}
</script>

<template>
  <Menu.Root @open-change-complete="handleOpenChangeComplete" @update:open="handleOpenChange">
    <Menu.Trigger>Toggle</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item>Add to Library</Menu.Item>
          <template v-if="!itemsFiltered">
            <Menu.Item>Add to Playlist</Menu.Item>
            <Menu.Item>Play Next</Menu.Item>
            <Menu.Item>Play Last</Menu.Item>
          </template>
          <Menu.Item>Favorite</Menu.Item>
          <Menu.Item>Share</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
