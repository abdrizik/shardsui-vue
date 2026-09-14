<script setup lang="ts">
import { Drawer } from '@shardsui/vue/drawer'
import { shallowRef } from 'vue'
import GitHub from '~/components/icons/github.vue'
import Npm from '~/components/icons/npm.vue'
import { links } from '~/utils/docs'
import { github, npm } from '~/utils/site'
import { version } from '~/utils/version'

const route = useRoute()

const open = shallowRef(false)
</script>

<template>
  <div>
    <Drawer.Root v-model:open="open" swipe-direction="left">
      <Drawer.Trigger aria-label="Navigation">
        <span aria-hidden="true"></span>
      </Drawer.Trigger>
      <Drawer.Portal>
        <div>
          <Drawer.Backdrop />
          <Drawer.Viewport>
            <Drawer.Popup>
              <nav aria-label="Main navigation">
                <div>
                  <Drawer.Close aria-label="Close navigation">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M17.2197 5.71967C17.5126 5.42678 17.9873 5.42678 18.2802 5.71967C18.5731 6.01256 18.5731 6.48732 18.2802 6.78022L13.0605 11.9999L18.2802 17.2197C18.5731 17.5126 18.5731 17.9873 18.2802 18.2802C17.9873 18.5731 17.5126 18.5731 17.2197 18.2802L11.9999 13.0605L6.78022 18.2802C6.48732 18.5731 6.01256 18.5731 5.71967 18.2802C5.42678 17.9873 5.42678 17.5126 5.71967 17.2197L10.9394 11.9999L5.71967 6.78022C5.42678 6.48732 5.42678 6.01256 5.71967 5.71967C6.01256 5.42678 6.48732 5.42678 6.78022 5.71967L11.9999 10.9394L17.2197 5.71967Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Drawer.Close>
                </div>

                <Drawer.Content>
                  <div v-for="section in links" :key="section.heading">
                    <div>{{ section.heading }}</div>
                    <ul>
                      <li v-for="link in section.links" :key="link.href">
                        <NuxtLink
                          :to="link.href"
                          :aria-current="route.path === link.href ? 'page' : undefined"
                          @click="open = false"
                        >
                          {{ link.title }}
                        </NuxtLink>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div>resources</div>
                    <ul>
                      <li>
                        <a :href="npm" rel="external noopener noreferrer" @click="open = false">
                          <Npm />
                          npm
                          <span>v{{ version }}</span>
                        </a>
                      </li>
                      <li>
                        <a :href="github" rel="external noopener noreferrer" @click="open = false">
                          <GitHub />
                          GitHub
                        </a>
                      </li>
                    </ul>
                  </div>
                </Drawer.Content>
              </nav>
            </Drawer.Popup>
          </Drawer.Viewport>
        </div>
      </Drawer.Portal>
    </Drawer.Root>
  </div>
</template>

<style scoped>
button:has(> span) {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: calc(var(--spacing) * 2);
  block-size: calc(var(--spacing) * 8);
  padding-inline: calc(var(--spacing) * 2);
  margin-inline-end: calc(var(--spacing) * -2);
  border-radius: var(--radius-md);
  color: var(--color-foreground);
  font-size: var(--text-base);
  user-select: none;
  transition:
    background-color 150ms var(--ease-out),
    scale 150ms var(--ease-out);

  &::before {
    content: '';
    position: absolute;
    inset-block: calc(var(--spacing) * -1.5);
    inset-inline: 0;
  }

  &:active {
    scale: 0.96;
  }

  &:focus-visible {
    outline: 2px solid var(--color-gray-900);
    outline-offset: -1px;
  }

  @media (hover: hover) {
    &:hover {
      background-color: var(--color-gray-100);
    }
  }

  @media (width >= 64rem) {
    display: none;
  }

  > span {
    display: flex;
    inline-size: calc(var(--spacing) * 4);
    flex-direction: column;
    align-items: center;
    gap: calc(var(--spacing) * 1);

    &::before,
    &::after {
      content: '';
      display: block;
      inline-size: calc(var(--spacing) * 3.5);
      block-size: 2px;
      background-color: currentColor;
    }
  }
}

div:has(> div > div > nav) {
  > div:first-child {
    position: fixed;
    inset: 0;
    min-block-size: 100dvh;
    background-color: oklch(0 0 0 / 0.15);
    backdrop-filter: blur(1.5px);
    opacity: calc(1 - var(--drawer-swipe-progress));
    transition: opacity 450ms cubic-bezier(0.32, 0.72, 0, 1);

    &[data-starting-style],
    &[data-ending-style] {
      opacity: 0;
    }

    &[data-swiping] {
      transition-duration: 0s;
    }

    @supports (-webkit-touch-callout: none) {
      position: absolute;
    }
  }

  > div + div {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;

    > div {
      --inset: calc(var(--spacing) * 3);

      pointer-events: none;
      inline-size: 100%;
      block-size: 100%;
      padding-block-start: calc(var(--inset) + env(safe-area-inset-top, 0px));
      padding-block-end: calc(var(--inset) + env(safe-area-inset-bottom, 0px));
      padding-inline-start: calc(var(--inset) + env(safe-area-inset-left, 0px));
      padding-inline-end: var(--inset);
      outline: 0;
      transform: translateX(var(--drawer-swipe-movement-x));
      transition: transform 450ms cubic-bezier(0.32, 0.72, 0, 1);

      /* 2px covers the subpixel seam left by the panel's own border. */
      &[data-starting-style],
      &[data-ending-style] {
        transform: translateX(calc(-100% - 2px));
      }

      &[data-ending-style] {
        transition-duration: calc(var(--drawer-swipe-strength) * 0.4s);
      }

      &[data-swiping] {
        transition-duration: 0s;
        user-select: none;
      }

      @media (width >= 40rem) {
        max-inline-size: 40rem;
      }
    }
  }

  nav {
    display: flex;
    block-size: 100%;
    flex-direction: column;
    overflow: hidden;
    pointer-events: auto;
    background-color: var(--color-content);
    border: var(--border-hairline) solid var(--color-gray-200);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-2xl);
    font-size: var(--text-sm);
    line-height: calc(var(--spacing) * 5.5);

    > div:first-child {
      display: flex;
      justify-content: flex-end;
      padding: calc(var(--spacing) * 6) calc(var(--spacing) * 6) 0;

      > button {
        position: relative;
        inset-block-start: calc(var(--spacing) * -2);
        inset-inline-end: calc(var(--spacing) * -2);
        display: flex;
        align-items: center;
        justify-content: center;
        inline-size: calc(var(--spacing) * 8);
        block-size: calc(var(--spacing) * 8);
        border: 1px solid var(--color-gray-200);
        border-radius: var(--radius-md);
        background-color: var(--color-gray-50);
        color: var(--color-gray-900);
        transition:
          background-color 150ms var(--ease-out),
          scale 150ms var(--ease-out);

        &::before {
          content: '';
          position: absolute;
          inset: calc(var(--spacing) * -1.5);
        }

        &:active {
          background-color: var(--color-gray-100);
          scale: 0.96;
        }

        &:focus-visible {
          outline: 2px solid var(--color-gray-900);
          outline-offset: -1px;
        }

        @media (hover: hover) {
          &:hover {
            background-color: var(--color-gray-100);
          }
        }
      }
    }

    > div + div {
      overflow-y: auto;
      overscroll-behavior: contain;
      scrollbar-width: none;
      padding-block-end: calc(var(--spacing) * 2);

      &::-webkit-scrollbar {
        display: none;
      }

      > div {
        &:not(:last-child) {
          margin-block-end: calc(var(--spacing) * 4);
        }

        > div {
          padding-block: calc(var(--spacing) * 0.75);
          padding-inline: calc(var(--spacing) * 6);
          color: var(--color-gray-500);
        }
      }
    }
  }

  a {
    display: flex;
    align-items: center;
    gap: calc(var(--spacing) * 1);
    padding-block: calc(var(--spacing) * 0.75);
    padding-inline: calc(var(--spacing) * 6);
    color: var(--color-gray-700);
    user-select: none;
    transition: color 150ms var(--ease-out);

    &[aria-current='page'] {
      font-weight: var(--font-weight-medium);
      color: var(--color-foreground);
    }

    &:focus-visible {
      outline: 2px solid var(--color-gray-900);
      outline-offset: -1px;
    }

    @media (hover: hover) {
      &:hover {
        color: var(--color-foreground);
      }
    }

    > span {
      margin-inline-start: auto;
      font-family: var(--font-mono);
      font-variant-numeric: tabular-nums;
      color: var(--color-gray-500);
    }
  }
}
</style>
