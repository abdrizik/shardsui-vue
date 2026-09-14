import type { Component } from 'vue'

const components = import.meta.glob<Component>('./**/demo.vue', {
  import: 'default',
  eager: true
})

const sources = import.meta.glob<string>('./**/demo.vue', {
  query: '?raw',
  import: 'default',
  eager: true
})

function demoPath(name: string): string {
  return `./${name}/demo.vue`
}

export function getDemoComponent(name: string): Component | undefined {
  return components[demoPath(name)]
}

export function getDemoSource(name: string): string {
  return sources[demoPath(name)] ?? ''
}
