<script setup lang="ts">
import type { Component } from 'vue'
import SiteHeader from '~/components/site-header.vue'
import { getDemoComponent } from '~/components/content/demos'
import { docs } from '~/utils/docs'
import { siteUrl } from '~/utils/site'

const content = import.meta.glob<string>('../../content/*.md', {
  query: '?raw',
  import: 'default',
  eager: true
})

/** Content files whose demos live under a different slug. */
const slugFor: Record<string, string> = { forms: 'form' }

const demos: { name: string; title: string; demo: Component }[] = []
const seen = new Set<string>()

for (const [path, md] of Object.entries(content)) {
  const file = path.match(/\/([^/]+)\.md$/)?.[1] ?? ''
  const slug = slugFor[file] ?? file
  let title = ''

  for (const line of md.split('\n')) {
    const heading = line.match(/^#{1,6}\s+(.+)$/)
    if (heading) title = heading[1]!

    const name = line.match(/:demo\{name="([^"]+)"\}/)?.[1]
    const demo = name ? getDemoComponent(name) : undefined
    if (!name?.startsWith(`${slug}/`) || name.endsWith('/hero') || !demo || seen.has(name)) {
      continue
    }

    seen.add(name)
    demos.push({ name, title, demo })
  }
}

const components = docs.component.map(({ slug, title }) => ({
  slug,
  title,
  demo: getDemoComponent(`${slug}/hero`)
}))

const seo = {
  title: 'Gallery',
  description: 'Hero and example demos for every ShardsUI component.'
}

const url = new URL('/gallery', siteUrl).href

useHead({ link: [{ rel: 'canonical', href: url }] })

useSeoMeta({
  title: seo.title,
  description: seo.description,
  ogTitle: seo.title,
  ogDescription: seo.description,
  ogUrl: url,
  twitterTitle: seo.title,
  twitterDescription: seo.description
})
</script>

<template>
  <div>
    <SiteHeader />

    <header>
      <h1>gallery</h1>
      <p>Hero and example demos for every component.</p>
    </header>

    <main>
      <div>
        <section v-for="{ slug, title, demo } in components" :key="slug">
          <h2>
            <NuxtLink :to="`/vue/${slug}`">{{ title }}</NuxtLink>
          </h2>
          <div>
            <component :is="demo" v-if="demo" />
          </div>
        </section>
      </div>

      <section>
        <h2>demos</h2>

        <div data-tall>
          <section v-for="{ name, title, demo } in demos" :key="name">
            <h3>{{ title }}</h3>
            <div>
              <component :is="demo" />
            </div>
          </section>
        </div>
      </section>
    </main>
  </div>
</template>

<style scoped>
div:has(> header) {
  margin-inline: auto;
  inline-size: 100%;
  max-inline-size: var(--width-site);
}

header + header {
  margin-block-end: calc(var(--spacing) * 12);

  h1 {
    font-size: clamp(var(--text-2xl), calc(var(--spacing) * 3) + 2vw, var(--text-3xl));
    line-height: 1.15;
    font-weight: var(--font-weight-semibold);
    letter-spacing: var(--tracking-tight);
    text-wrap: balance;
  }

  p {
    margin-block-start: calc(var(--spacing) * 3);
    max-inline-size: 36rem;
    line-height: var(--leading-snug);
    text-wrap: pretty;
    color: var(--color-gray-600);
  }
}

main {
  --hero-min: 18rem;

  display: flex;
  flex-direction: column;

  > section {
    margin-block-start: calc(var(--spacing) * 16);

    > h2 {
      display: flex;
      align-items: center;
      gap: calc(var(--spacing) * 4);
      margin-block-end: calc(var(--spacing) * 8);
      font-size: var(--text-xs);
      font-weight: var(--font-weight-medium);
      letter-spacing: var(--tracking-wide);
      text-transform: uppercase;
      color: var(--color-gray-500);

      &::before,
      &::after {
        content: '';
        flex: 1;
        block-size: var(--border-hairline);
        background: var(--color-border);
      }
    }
  }

  > div,
  > section > div[data-tall] {
    display: grid;
    overflow-x: clip;
    border-block-start: var(--border-hairline) solid var(--color-border);
    border-inline-start: var(--border-hairline) solid var(--color-border);
  }

  > div {
    grid-template-columns: repeat(
      auto-fill,
      minmax(min(100%, max(var(--hero-min), 100% / 3)), 1fr)
    );
  }

  > section > div[data-tall] {
    grid-template-columns: minmax(0, 1fr);

    @media (width >= 40rem) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  > div section,
  > section > div[data-tall] section {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 4);
    min-inline-size: 0;
    padding: calc(var(--spacing) * 5);
    border-inline-end: var(--border-hairline) solid var(--color-border);
    border-block-end: var(--border-hairline) solid var(--color-border);
    background: var(--color-content);
  }

  > section > div[data-tall] section {
    block-size: calc(var(--hero-min) * 1.5);
  }

  > div section {
    aspect-ratio: 1 / 1;
  }

  > div section > div,
  > section > div[data-tall] section > div {
    display: flex;
    flex: 1;
    min-inline-size: 0;
    min-block-size: 0;
    align-items: center;
    justify-content: center;
    overflow: clip;
  }

  > div h2 {
    font-size: var(--text-code);
    font-weight: var(--font-weight-medium);

    a:hover {
      text-decoration: underline;
      text-decoration-thickness: from-font;
      text-underline-position: from-font;
      text-decoration-skip-ink: auto;
    }
  }

  > section > div[data-tall] h3 {
    font-size: var(--text-sm);
    font-weight: var(--font-weight-medium);
  }
}
</style>
