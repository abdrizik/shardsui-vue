<script setup lang="ts">
import Logo from '~/components/logo.vue'
import MobileNav from '~/components/mobile-nav.vue'
import SiteLinks from '~/components/site-links.vue'
</script>

<template>
  <header>
    <NuxtLink to="/" aria-label="ShardsUI">
      <Logo />
    </NuxtLink>
    <nav aria-label="Site links">
      <SiteLinks />
      <MobileNav />
    </nav>
  </header>
</template>

<style scoped>
header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-block-end: clamp(
    calc(var(--spacing) * 16),
    calc(var(--spacing) * 7) + 3vw,
    calc(var(--spacing) * 22)
  );

  > a {
    display: flex;
    inline-size: fit-content;
    border-radius: var(--radius-md);
    color: var(--color-gray-900);
  }

  nav {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 3);
  }
}
</style>
