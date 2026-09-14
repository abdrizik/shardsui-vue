import tailwindcss from '@tailwindcss/vite'
import { siteName, siteUrl } from './app/utils/site.js'

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: false },
  css: ['~/assets/styles/main.css'],
  app: {
    head: {
      htmlAttrs: { lang: 'en' },
      titleTemplate: `%s — ${siteName}`,
      meta: [
        { name: 'text-scale', content: 'scale' },
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: siteName },
        { property: 'og:locale', content: 'en' },
        { property: 'og:image', content: new URL('/og.png', siteUrl).href },
        { property: 'og:image:type', content: 'image/png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        {
          property: 'og:image:alt',
          content: `${siteName} — unstyled, accessible UI components for Vue`
        },
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:image', content: new URL('/og.png', siteUrl).href }
      ],
      link: [{ rel: 'icon', href: import.meta.dev ? '/favicon-dev.svg' : '/favicon.svg' }]
    }
  },
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/', '/gallery']
    }
  },
  vite: {
    plugins: [tailwindcss()]
  }
})
