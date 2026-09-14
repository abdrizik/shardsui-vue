<script setup lang="ts">
import Banner from '~/components/banner.vue'
</script>

<template>
  <Banner />

  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style scoped>
div + div {
  position: relative;
  z-index: 0;
  display: flex;
  min-height: 100dvh;
  flex-direction: column;
  padding: calc(var(--spacing) * 4);

  @media (width >= 40rem) {
    padding: calc(var(--spacing) * 8);
  }

  @media (width >= 64rem) {
    padding: calc(var(--spacing) * 12);
  }
}
</style>
