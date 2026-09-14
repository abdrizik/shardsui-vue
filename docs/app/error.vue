<script setup lang="ts">
import type { NuxtError } from '#app'
import Banner from '~/components/banner.vue'
import Ornaments from '~/components/ornaments.vue'

const { error } = defineProps<{ error: NuxtError }>()

useSeoMeta({ title: () => String(error.status) })
</script>

<template>
  <Banner />

  <div>
    <main>
      <template v-if="error.status === 404">
        <h1>
          4
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <circle cx="12" cy="12" r="12" />
          </svg>
          4
        </h1>
        <p>This page doesn't exist.</p>
      </template>
      <template v-else>
        <h1>{{ error.status }}</h1>
        <p>Something went wrong</p>
        <p>{{ error.message || 'An unexpected error occurred.' }}</p>
      </template>
      <NuxtLink to="/quick-start" @click="clearError()">Back to docs</NuxtLink>
    </main>

    <Ornaments />
  </div>
</template>

<style scoped>
div:has(> main) {
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

  > main {
    display: flex;
    min-block-size: 80dvh;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;

    > h1 {
      font-size: clamp(calc(var(--spacing) * 28), 15vw, calc(var(--spacing) * 36));
      line-height: 1;
      font-weight: var(--font-weight-semibold);
      letter-spacing: var(--tracking-tight);
      text-wrap: balance;
      color: var(--color-gray-200);
      user-select: none;

      &:has(svg) {
        display: flex;
        align-items: center;
        gap: clamp(calc(var(--spacing) * 3), 2vw, calc(var(--spacing) * 4));
      }

      svg {
        inline-size: clamp(calc(var(--spacing) * 18), 12vw, calc(var(--spacing) * 24));
        block-size: clamp(calc(var(--spacing) * 18), 12vw, calc(var(--spacing) * 24));
      }
    }

    > p:first-of-type {
      margin-block-start: calc(var(--spacing) * 4);
      font-size: var(--text-lg);
      font-weight: var(--font-weight-medium);
      text-wrap: balance;
    }

    > p:nth-of-type(2) {
      margin-block-start: calc(var(--spacing) * 2);
      max-inline-size: 40ch;
      font-size: var(--text-sm);
      line-height: 1.5;
      text-wrap: pretty;
      color: var(--color-gray-600);
    }

    > a {
      margin-block-start: calc(var(--spacing) * 10);
      font-size: var(--text-sm);

      &:hover {
        text-decoration: underline;
        text-decoration-thickness: from-font;
        text-underline-position: from-font;
        text-decoration-skip-ink: auto;
      }
    }
  }
}
</style>
