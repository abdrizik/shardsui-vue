<script setup lang="ts">
import { onMounted, shallowRef } from 'vue'
import { NavigationMenu } from '@/components/navigation-menu'

const { register } = defineProps<{ register?: (navigate: () => void) => void }>()

const value = shallowRef<unknown>(null)
const aIsActive = shallowRef(false)

const navigate = () => {
  value.value = null
  aIsActive.value = true
}

onMounted(() => {
  register?.(navigate)
})
</script>

<template>
  <NavigationMenu.Root v-model:value="value">
    <NavigationMenu.List data-testid="list">
      <NavigationMenu.Item value="a">
        <a v-if="aIsActive" href="#a">A active</a>
        <template v-else>
          <NavigationMenu.Trigger>A</NavigationMenu.Trigger>
          <NavigationMenu.Content>
            <NavigationMenu.Link href="#a">A link</NavigationMenu.Link>
          </NavigationMenu.Content>
        </template>
      </NavigationMenu.Item>
    </NavigationMenu.List>

    <NavigationMenu.Portal>
      <NavigationMenu.Positioner>
        <NavigationMenu.Popup>
          <NavigationMenu.Viewport />
        </NavigationMenu.Popup>
      </NavigationMenu.Positioner>
    </NavigationMenu.Portal>
  </NavigationMenu.Root>
</template>
