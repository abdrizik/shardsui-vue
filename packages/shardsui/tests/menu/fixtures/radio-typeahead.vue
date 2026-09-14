<script setup lang="ts">
import { Menu } from '@/components/menu'

const { onValueChange } = defineProps<{ onValueChange?: (value: unknown) => void }>()
</script>

<template>
  <Menu.Root open>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.RadioGroup @update:value="(value) => onValueChange?.(value)">
            <Menu.RadioItem value="one" data-testid="item-one">Item One</Menu.RadioItem>
            <Menu.RadioItem value="two" data-testid="item-two">Item Two</Menu.RadioItem>
          </Menu.RadioGroup>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
