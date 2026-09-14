<script setup lang="ts">
import { Combobox } from '@/components/combobox'

const { keepMounted = false, ontransitionend = undefined } = defineProps<{
  keepMounted?: boolean
  ontransitionend?: (event: TransitionEvent) => void
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open')

const style = `
    .animation-test-indicator {
      transition: opacity 1ms;
    }

    .animation-test-indicator[data-starting-style],
    .animation-test-indicator[data-ending-style] {
      opacity: 0;
    }
  `
</script>

<template>
  <component :is="'style'">{{ style }}</component>

  <div>
    <Combobox.Root v-model:value="value" v-model:open="open">
      <Combobox.Input data-testid="input" />
      <Combobox.Clear
        class="animation-test-indicator"
        data-testid="clear"
        :keep-mounted="keepMounted"
        @transitionend="ontransitionend"
      />
      <Combobox.Portal>
        <Combobox.Positioner>
          <Combobox.Popup data-testid="popup">
            <Combobox.List data-testid="list">
              <Combobox.Item value="a">a</Combobox.Item>
            </Combobox.List>
          </Combobox.Popup>
        </Combobox.Positioner>
      </Combobox.Portal>
    </Combobox.Root>
  </div>
</template>
