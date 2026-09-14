<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import { Popover } from '@/components/popover'

const { withFocusTarget = false } = defineProps<{ withFocusTarget?: boolean }>()
</script>

<template>
  <div>
    <Popover.Root open>
      <Popover.Trigger data-testid="trigger">Toggle</Popover.Trigger>
      <input v-if="withFocusTarget" data-testid="focus-target" />
      <Popover.Portal keep-mounted>
        <Popover.Positioner>
          <Popover.Popup data-testid="popover-popup">
            <Combobox.Root>
              <Combobox.Input data-testid="combobox-input" />
              <Combobox.Portal>
                <Combobox.Positioner>
                  <Combobox.Popup>
                    <Combobox.List>
                      <Combobox.Item value="a">a</Combobox.Item>
                      <Combobox.Item value="b">b</Combobox.Item>
                    </Combobox.List>
                  </Combobox.Popup>
                </Combobox.Positioner>
              </Combobox.Portal>
            </Combobox.Root>
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  </div>
</template>
