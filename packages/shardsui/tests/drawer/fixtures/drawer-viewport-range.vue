<script setup lang="ts">
import { Drawer } from '@/components/drawer'
import { Slider } from '@/components/slider'

const { variant = 'native' } = defineProps<{ variant?: 'native' | 'slider' }>()
</script>

<template>
  <Drawer.Root open swipe-direction="down">
    <Drawer.Portal>
      <Drawer.Backdrop data-testid="backdrop" />
      <Drawer.Viewport>
        <Drawer.Popup>
          <input v-if="variant === 'native'" type="range" data-testid="range" />
          <Slider.Root v-else :value="50">
            <Slider.Control>
              <Slider.Track>
                <Slider.Indicator />
                <Slider.Thumb />
              </Slider.Track>
            </Slider.Control>
          </Slider.Root>
        </Drawer.Popup>
      </Drawer.Viewport>
    </Drawer.Portal>
  </Drawer.Root>
</template>
