<script setup lang="ts">
import { Menu } from '@/components/menu'
import type { ContentItem } from './menu-contents'

defineOptions({ name: 'MenuContentItems' })

const { items } = defineProps<{ items: ContentItem[] }>()
</script>

<template>
  <template v-for="(item, index) in items" :key="index">
    <Menu.Item
      v-if="item.type === 'item'"
      :data-testid="item.testId"
      :disabled="item.disabled"
      :close-on-click="item.closeOnClick"
      @click="item.onClick"
    >
      {{ item.label }}
    </Menu.Item>
    <Menu.SubmenuRoot v-else-if="item.type === 'submenu'">
      <Menu.SubmenuTrigger :data-testid="item.testId">{{ item.label }}</Menu.SubmenuTrigger>
      <Menu.Portal>
        <Menu.Positioner :data-testid="item.menuTestId">
          <Menu.Popup>
            <MenuContentItems :items="item.items" />
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.SubmenuRoot>
    <Menu.RadioGroup v-else-if="item.type === 'radioGroup'" :value="item.value">
      <MenuContentItems :items="item.items" />
    </Menu.RadioGroup>
    <Menu.RadioItem v-else :data-testid="item.testId" :value="item.value" :disabled="item.disabled">
      {{ item.label }}
    </Menu.RadioItem>
  </template>
</template>
