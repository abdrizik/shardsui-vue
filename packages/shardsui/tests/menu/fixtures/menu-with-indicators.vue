<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onCheckedChange } = defineProps<{ onCheckedChange?: (checked: boolean) => void }>()

const checked = defineModel<boolean>('checked', { default: false })
const value = defineModel<unknown>('value')
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.CheckboxItem
            v-model:checked="checked"
            data-testid="checkbox-item"
            @update:checked="(next) => onCheckedChange?.(next)"
          >
            <Menu.CheckboxItemIndicator data-testid="checkbox-indicator" />
            Toggle
          </Menu.CheckboxItem>
          <Menu.RadioGroup v-model:value="value">
            <Menu.RadioItem value="a" data-testid="radio-item-a">
              <Menu.RadioItemIndicator data-testid="radio-indicator-a" />
              Option A
            </Menu.RadioItem>
            <Menu.RadioItem value="b" data-testid="radio-item-b">
              <Menu.RadioItemIndicator data-testid="radio-indicator-b" />
              Option B
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
