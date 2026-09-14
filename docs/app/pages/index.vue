<script setup lang="ts">
import ComponentsGrid from '~/components/components-grid.vue'
import Sidebar from '~/components/sidebar.vue'
import { docs } from '~/utils/docs'
import { siteName, siteUrl } from '~/utils/site'

const description =
  'Unstyled, accessible UI components for Vue 3. Keyboard, focus management, and ARIA.'
const url = new URL('/', siteUrl).href

const title = `${siteName} — Unstyled UI components for Vue 3`

useHead({ titleTemplate: null, link: [{ rel: 'canonical', href: url }] })

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description,
  ogUrl: url,
  twitterTitle: title,
  twitterDescription: description
})
</script>

<template>
  <div>
    <Sidebar />

    <main>
      <ComponentsGrid :components="docs.component" />
    </main>
  </div>
</template>

<style scoped>
div {
  margin-inline: auto;
  display: grid;
  inline-size: 100%;
  max-inline-size: var(--width-site);
  grid-template-columns: minmax(0, 1fr);
  gap: calc(var(--spacing) * 14);

  @media (width >= 64rem) {
    grid-template-columns: var(--width-rail) minmax(0, 1fr);
    gap: calc(var(--spacing) * 16);
  }

  > main {
    display: flex;
    flex-direction: column;
  }
}
</style>
