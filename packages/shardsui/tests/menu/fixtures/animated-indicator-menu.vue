<script setup lang="ts">
import { shallowRef } from 'vue'
import { Menu } from '@/components/menu'

const { keepMounted = true, onAnimationEnd } = defineProps<{
  keepMounted?: boolean
  onAnimationEnd: () => void
}>()

const checked = defineModel<boolean>('checked', { default: true })
const value = shallowRef<unknown>('a')
</script>

<template>
  <div>
    <button
      @click="
        () => {
          checked = false
          value = 'b'
        }
      "
    >
      Close
    </button>
    <Menu.Root :open="true" :modal="false" @update:open="() => {}">
      <Menu.Portal>
        <Menu.Positioner>
          <Menu.Popup>
            <Menu.CheckboxItem v-model:checked="checked">
              <Menu.CheckboxItemIndicator
                class="animation-test-indicator"
                data-testid="checkbox-indicator"
                :keep-mounted="keepMounted"
                @animationend="onAnimationEnd"
              />
            </Menu.CheckboxItem>
            <Menu.RadioGroup v-model:value="value">
              <Menu.RadioItem value="a">
                <Menu.RadioItemIndicator
                  class="animation-test-indicator"
                  data-testid="radio-indicator"
                  :keep-mounted="keepMounted"
                  @animationend="onAnimationEnd"
                />
              </Menu.RadioItem>
              <Menu.RadioItem value="b">Other</Menu.RadioItem>
            </Menu.RadioGroup>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  </div>
</template>

<style>
@keyframes test-anim {
  to {
    opacity: 0;
  }
}

.animation-test-indicator[data-ending-style] {
  animation: test-anim 1ms;
}
</style>
