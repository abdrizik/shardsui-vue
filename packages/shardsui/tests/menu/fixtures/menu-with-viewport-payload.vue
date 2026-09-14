<script setup lang="ts">
import { Menu } from '@/components/menu'

const handle = Menu.createHandle<string>()
</script>

<template>
  <div>
    <Menu.Trigger :handle="handle" id="trigger1" payload="first" data-testid="trigger1">
      Trigger 1
    </Menu.Trigger>
    <Menu.Trigger :handle="handle" id="trigger2" payload="second" data-testid="trigger2">
      Trigger 2
    </Menu.Trigger>

    <Menu.Root v-slot="{ payload }" :handle="handle">
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.Viewport>
              <div v-if="payload === 'first'" data-testid="payload-image-1">Preview 1</div>
              <div v-if="payload === 'second'" data-testid="payload-image-2">Preview 2</div>
            </Menu.Viewport>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>
