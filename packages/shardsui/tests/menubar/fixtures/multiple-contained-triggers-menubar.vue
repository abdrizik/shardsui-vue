<script setup lang="ts">
import { Menu } from '@/components/menu'
import { Menubar } from '@/components/menubar'
import DynamicMenu from './dynamic-menu.vue'
import { menuContents, type MenuDefinition } from './menu-contents'

const {
  disabled = false,
  loopFocus = true,
  orientation = 'horizontal',
  outside = false
} = defineProps<{
  disabled?: boolean
  loopFocus?: boolean
  orientation?: 'horizontal' | 'vertical'
  outside?: boolean
}>()

const entries = Object.entries(menuContents) as Array<[string, MenuDefinition]>
</script>

<template>
  <div>
    <Menubar
      data-testid="menubar-root"
      style="display: flex"
      :disabled="disabled"
      :loop-focus="loopFocus"
      :orientation="orientation"
    >
      <DynamicMenu>
        <template #triggers>
          <Menu.Trigger
            v-for="[key, menuDef] in entries"
            :key="key"
            :payload="menuDef"
            :data-testid="menuDef.triggerTestId"
          >
            {{ menuDef.label }}
          </Menu.Trigger>
        </template>
      </DynamicMenu>
    </Menubar>
    <button v-if="outside" data-testid="outside">Outside</button>
  </div>
</template>
