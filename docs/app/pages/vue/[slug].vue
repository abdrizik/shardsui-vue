<script setup lang="ts">
import { MarkdownDocument } from '@comark/vue'
import { parseMarkdown } from 'comark/parse'
import { components } from '~/components/content/components'
import { loadContent } from '~/utils/content'
import { docs } from '~/utils/docs'
import { siteName, siteUrl } from '~/utils/site'
import { plugins } from '~/utils/markdown'
import { transformReferenceTables } from '~/utils/reference-tables'

definePageMeta({ layout: 'docs' })

const route = useRoute()
const slug = String(route.params.slug)

const metadata = Object.values(docs)
  .flat()
  .find((c) => c.slug === slug)

if (!metadata) {
  throw createError({ status: 404, statusText: `Page not found: ${slug}` })
}

const { data: tree } = await useAsyncData(`docs:${slug}`, async () => {
  const raw = await loadContent(slug)
  if (raw === undefined) {
    throw createError({ status: 404, statusText: `Docs page missing: ${slug}.md` })
  }
  return transformReferenceTables(await parseMarkdown(raw.trim(), { plugins }))
})

const url = new URL(route.path, siteUrl).href

useHead({ link: [{ rel: 'canonical', href: url }] })

useSeoMeta({
  title: metadata.title,
  description: metadata.description,
  ogTitle: metadata.title,
  ogDescription: metadata.description,
  ogUrl: url,
  twitterTitle: metadata.title,
  twitterDescription: metadata.description
})
</script>

<template>
  <article class="prose">
    <MarkdownDocument v-if="tree" :value="tree" :components="components" />
  </article>
</template>
