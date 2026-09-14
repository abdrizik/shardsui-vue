<script setup lang="ts">
import { ScrollArea } from '@shardsui/vue/scroll-area'
import { onWatcherCleanup, shallowRef, useTemplateRef, watchPostEffect } from 'vue'
import { links } from '~/utils/docs'

const route = useRoute()

const content = useTemplateRef<HTMLElement>('content')
const activeY = shallowRef<number | null>(null)

watchPostEffect(() => {
  const container = content.value
  const active = container?.querySelector<HTMLElement>(
    `a[href="${CSS.escape(route.path)}"][aria-current="page"]`
  )
  if (!container || !active) {
    activeY.value = null
    return
  }

  function measure() {
    activeY.value = active!.offsetTop + active!.offsetHeight / 2
  }

  measure()
  const observer = new ResizeObserver(measure)
  observer.observe(container)
  onWatcherCleanup(() => observer.disconnect())
})
</script>

<template>
  <nav aria-label="Main navigation">
    <ScrollArea.Root>
      <ScrollArea.Viewport>
        <div ref="content">
          <span
            v-if="activeY !== null"
            :style="{ '--indicator-y': `${activeY}px` }"
            aria-hidden="true"
          ></span>
          <div v-for="section in links" :key="section.heading">
            <div>{{ section.heading }}</div>
            <ul>
              <li v-for="link in section.links" :key="link.href">
                <NuxtLink
                  :to="link.href"
                  :aria-current="route.path === link.href ? 'page' : undefined"
                >
                  {{ link.title }}
                </NuxtLink>
              </li>
            </ul>
          </div>
        </div>
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar orientation="vertical">
        <ScrollArea.Thumb />
      </ScrollArea.Scrollbar>
    </ScrollArea.Root>
  </nav>
</template>

<style scoped>
nav {
  --side-nav-item-height: calc(var(--spacing) * 7);
  --side-nav-item-line-height: calc(var(--spacing) * 5.5);
  --side-nav-item-padding-y: calc(
    var(--side-nav-item-height) / 2 - var(--side-nav-item-line-height) / 2
  );
  --side-nav-link-padding-x: calc(var(--spacing) * 5);
  --side-nav-dot-size: calc(var(--spacing) * 2);
  --side-nav-dot-gap: calc(var(--spacing) * 2);
  --side-nav-dot-inset: calc(-1 * var(--side-nav-dot-gap) - var(--side-nav-dot-size));
  --side-nav-scrollbar-thumb-width: calc(var(--spacing) * 1);
  --side-nav-scrollbar-width: calc(var(--spacing) * 6);
  --side-nav-scrollbar-gap-left: calc(var(--spacing) * 4);

  font-size: var(--text-sm);

  @media (width < 64rem) {
    display: none;
  }

  @media (width >= 64rem) {
    position: sticky;
    inset-block-start: calc(var(--spacing) * 6);
    align-self: start;
    margin-inline-start: calc(-1 * var(--side-nav-link-padding-x));

    > div > div:first-child {
      max-block-size: calc(100dvh - calc(var(--spacing) * 12));
      padding-block: 0 calc(var(--spacing) * 10);
      padding-inline-start: var(--side-nav-link-padding-x);
      padding-inline-end: calc(
        var(--side-nav-scrollbar-gap-left) + var(--side-nav-scrollbar-width) / 2 +
          var(--side-nav-scrollbar-thumb-width) / 2
      );
      outline: 0;
    }

    > div > div + div {
      display: flex;
      padding-block: calc(var(--spacing) * 6) calc(var(--spacing) * 18);
      inline-size: var(--side-nav-scrollbar-width);
      opacity: 0;
      transition: opacity 200ms 500ms;

      &:active,
      &[data-scrolling] {
        transition-duration: 0ms;
        transition-delay: 0ms;
        opacity: 1;
      }

      > div {
        display: flex;
        justify-content: center;
        inline-size: 100%;

        &::before {
          content: '';
          display: block;
          block-size: 100%;
          inline-size: var(--side-nav-scrollbar-thumb-width);
          border-radius: var(--radius-sm);
          background-color: var(--color-gray-600);
        }
      }
    }
  }

  > div > div:first-child > div {
    position: relative;

    > div {
      &:not(:last-child) {
        margin-block-end: calc(var(--spacing) * 6);
      }

      > div {
        line-height: 1;
        margin-block-end: calc(var(--spacing) * 2.5);
        font-size: var(--text-xs);
        font-weight: var(--font-weight-medium);
        text-transform: uppercase;
        letter-spacing: var(--tracking-wider);
        color: var(--color-gray-400);
      }
    }

    > span,
    a::before {
      position: absolute;
      inline-size: var(--side-nav-dot-size);
      block-size: var(--side-nav-dot-size);
      border-radius: var(--radius-full);
      pointer-events: none;
    }

    > span {
      inset-block-start: 0;
      inset-inline-start: var(--side-nav-dot-inset);
      background-color: var(--color-foreground);
      opacity: 1;
      transform: translateY(calc(var(--indicator-y) - 50%));
      transition:
        transform 250ms var(--ease-in-out),
        opacity 200ms ease;

      @starting-style {
        opacity: 0;
      }
    }

    a {
      position: relative;
      display: flex;
      align-items: center;
      padding-block: var(--side-nav-item-padding-y);
      padding-inline: var(--side-nav-link-padding-x);
      line-height: var(--side-nav-item-line-height);
      margin-inline-start: calc(-1 * var(--side-nav-link-padding-x));
      border-radius: var(--radius-md);
      color: var(--color-gray-700);
      user-select: none;
      transition: color 150ms var(--ease-out);

      &:hover {
        color: var(--color-foreground);
      }

      &[aria-current='page'] {
        color: var(--color-foreground);
      }

      &:focus-visible {
        z-index: 1;
        outline: 2px solid var(--color-gray-900);
        outline-offset: -1px;
      }

      &::before {
        content: '';
        inset-block-start: 50%;
        inset-inline-start: calc(var(--side-nav-link-padding-x) + var(--side-nav-dot-inset));
        background-color: var(--color-gray-400);
        opacity: 0;
        transform: translateY(-50%);
        transition: opacity 150ms var(--ease-out);
      }

      &:hover:not([aria-current='page'])::before {
        opacity: 1;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      > span,
      a::before {
        transition: none;
      }
    }
  }
}
</style>
