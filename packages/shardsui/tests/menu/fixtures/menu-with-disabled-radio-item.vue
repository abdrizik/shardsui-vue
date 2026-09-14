<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onValueChange, onClick } = defineProps<{
  onValueChange?: (value: unknown) => void
  onClick?: (event: MouseEvent) => void
}>()

const value = defineModel<unknown>('value', { default: () => 'one' })
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Open</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.RadioGroup v-model:value="value" @update:value="(next) => onValueChange?.(next)">
            <Menu.RadioItem
              value="one"
              disabled
              data-testid="radio-item-one"
              @click="(event) => onClick?.(event)"
            >
              one
            </Menu.RadioItem>
            <Menu.RadioItem
              value="two"
              data-testid="radio-item-two"
              @click="(event) => onClick?.(event)"
            >
              two
            </Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
