<script setup lang="ts">
import { NavigationMenu } from '@/components/navigation-menu'
import RouterLinkStub from '../../stubs/router-link.vue'
</script>

<template>
  <NavigationMenu.Root>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Link :as="RouterLinkStub" to="/docs" active data-testid="link" class="part">
          Docs
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu.Root>
</template>
