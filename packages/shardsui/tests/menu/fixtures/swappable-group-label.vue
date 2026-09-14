<script setup lang="ts">
import { Menu } from '@/components/menu'

const { labels = 'old' } = defineProps<{ labels?: 'old' | 'both' | 'new' }>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Group>
            <Menu.GroupLabel v-if="labels !== 'new'" id="old-label">Old</Menu.GroupLabel>
            <Menu.GroupLabel v-if="labels !== 'old'" id="new-label">New</Menu.GroupLabel>
          </Menu.Group>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
