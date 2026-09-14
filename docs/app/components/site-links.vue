<script setup lang="ts">
import GitHub from '~/components/icons/github.vue'
import Npm from '~/components/icons/npm.vue'
import { github, npm } from '~/utils/site'
import { version } from '~/utils/version'
</script>

<template>
  <div>
    <span>v{{ version }}</span>
    <div>
      <a :href="npm" rel="external noopener noreferrer" aria-label="npm">
        <Npm />
      </a>
      <a :href="github" rel="external noopener noreferrer" aria-label="GitHub">
        <GitHub />
      </a>
    </div>
  </div>
</template>

<style scoped>
div:has(> span) {
  display: none;
  align-items: center;
  gap: calc(var(--spacing) * 4);

  @media (width >= 64rem) {
    display: flex;
  }

  > span {
    border-inline-end: var(--border-hairline) solid var(--color-border);
    padding-inline-end: calc(var(--spacing) * 4);
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    font-variant-numeric: tabular-nums;
    color: var(--color-gray-700);
  }

  > div {
    display: flex;
    align-items: center;
    margin-inline-start: calc(var(--spacing) * -1.5);
  }

  a {
    display: inline-flex;
    border-radius: var(--radius-md);
    padding: calc(var(--spacing) * 1.5);
    color: var(--color-gray-700);
    transition: color 150ms var(--ease-out);

    &:hover {
      color: var(--color-gray-950);
    }

    &:focus-visible {
      outline: 2px solid var(--color-gray-900);
      outline-offset: calc(var(--spacing) * 0.5);
    }
  }
}
</style>
