<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'

const { active = false } = defineProps<{ active?: boolean }>()
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link href="#" :active="active" data-testid="active-link">
          link
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</template>
