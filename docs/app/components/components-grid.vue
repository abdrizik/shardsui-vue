<script setup lang="ts">
import { computed } from 'vue'
import CategoryThumbnail from '~/components/category-thumbnail.vue'
import type { ComponentDoc } from '~/utils/docs'

const { components } = defineProps<{ components: readonly ComponentDoc[] }>()

const groups = computed(() =>
  [...Map.groupBy(components, (c) => c.title[0]!.toUpperCase())].sort(([a], [b]) =>
    a.localeCompare(b)
  )
)
</script>

<template>
  <section>
    <h2>Components</h2>

    <div>
      <div v-for="[letter, items] in groups" :key="letter">
        <h3>{{ letter }}</h3>
        <ul role="list">
          <li v-for="component in items" :key="component.slug">
            <NuxtLink :to="`/vue/${component.slug}`">
              <CategoryThumbnail :slug="component.slug" />
              <span>{{ component.title }}</span>
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </section>
</template>

<style scoped>
section {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 6);

  h2 {
    font-size: var(--text-code);
    font-weight: var(--font-weight-medium);
    color: var(--color-gray-900);
  }

  > div {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 20);

    > div {
      display: flex;
      flex-direction: column;
      gap: calc(var(--spacing) * 4);
    }
  }

  h3 {
    font-family: var(--font-mono);
    font-size: var(--text-xs);
    color: var(--color-gray-600);
  }

  ul {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(min(100%, 13rem), 1fr));
    column-gap: calc(var(--spacing) * 3);
    row-gap: calc(var(--spacing) * 8);

    a {
      display: flex;
      flex-direction: column;
      gap: calc(var(--spacing) * 2);

      &:focus-visible {
        outline: 2px solid var(--color-gray-900);
        outline-offset: calc(var(--spacing) * -0.5);
      }

      span {
        font-size: var(--text-sm);
        color: var(--color-gray-600);
      }

      &:hover span {
        color: var(--color-gray-900);
      }
    }
  }
}
</style>
