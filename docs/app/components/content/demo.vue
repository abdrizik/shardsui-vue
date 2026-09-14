<script setup lang="ts">
import { Collapsible } from '@shardsui/vue/collapsible'
import { computed, shallowRef } from 'vue'
import CopyButton from '~/components/copy-button.vue'
import DemoCode from './demo-code.vue'
import { getDemoComponent, getDemoSource } from './demos'
import { highlight } from '~/utils/highlight'

const COLLAPSIBLE_LINES_THRESHOLD = 8

const { name, lang = 'vue' } = defineProps<{ name: string; lang?: string }>()

const component = computed(() => getDemoComponent(name))
const code = computed(() => getDemoSource(name).trim())

const collapsible = computed(() => code.value.split('\n').length >= COLLAPSIBLE_LINES_THRESHOLD)

const { data: codeHtml } = await useAsyncData(
  computed(() => `demo:${name}`),
  () => highlight(code.value, lang),
  { watch: [code] }
)

const expanded = shallowRef(false)
</script>

<template>
  <div class="demo-root not-prose">
    <div class="thin-scrollbar">
      <div>
        <component :is="component" v-if="component" />
        <p v-else class="demo-missing">Missing demo: {{ name }}</p>
      </div>
    </div>

    <Collapsible.Root v-model:open="expanded">
      <div role="figure" aria-label="Component demo code">
        <div :data-closed="collapsible && !expanded ? '' : undefined">
          <CopyButton :text="code" />

          <template v-if="collapsible">
            <Collapsible.Panel keep-mounted :hidden="false">
              <DemoCode :html="codeHtml ?? ''" :collapsed="!expanded" />
            </Collapsible.Panel>

            <Collapsible.Trigger
              :aria-label="expanded ? 'Hide code' : 'Show code'"
              :data-open="expanded ? '' : undefined"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M17.7197 8.96967C18.0126 8.67678 18.4873 8.67678 18.7802 8.96967C19.0731 9.26256 19.0731 9.73732 18.7802 10.0302L12.5302 16.2802C12.2373 16.5731 11.7626 16.5731 11.4697 16.2802L5.21967 10.0302C4.92678 9.73732 4.92678 9.26256 5.21967 8.96967C5.51256 8.67678 5.98732 8.67678 6.28022 8.96967L11.9999 14.6894L17.7197 8.96967Z"
                  fill="currentColor"
                />
              </svg>
            </Collapsible.Trigger>
          </template>
          <DemoCode v-else :html="codeHtml ?? ''" />
        </div>
      </div>
    </Collapsible.Root>
  </div>
</template>

<style scoped>
.demo-root {
  --demo-radius: var(--radius-md);
  --padding: var(--spacing);
  --outer-radius: calc(var(--demo-radius) + var(--padding));
  --demo-min-h: calc(var(--spacing) * 56);
  --demo-shell: var(--color-gray-100);
  margin-block: calc(var(--spacing) * 6);
  padding: var(--padding);
  display: flex;
  flex-direction: column;
  gap: var(--padding);
  background-color: var(--demo-shell);
  border-radius: var(--outer-radius);

  > div:first-child {
    position: relative;
    background-color: var(--color-content);
    border-radius: var(--demo-radius);
    overflow: auto hidden;
    overscroll-behavior-x: contain;

    &:focus-visible {
      outline: 2px solid var(--color-gray-900);
      outline-offset: -1px;
      z-index: 1;
    }

    > div {
      padding: calc(var(--spacing) * 8) calc(var(--spacing) * 6);
      min-block-size: var(--demo-min-h);
      min-inline-size: fit-content;
      display: flex;
      justify-content: center;
      align-items: center;

      .demo-missing {
        margin: 0;
        font-family: var(--font-mono);
        font-size: var(--text-code);
        color: light-dark(oklch(0.51 0.19 27), oklch(0.71 0.17 22));
      }
    }
  }

  > div:last-child > div {
    position: relative;
    background-color: var(--color-content);
    border-radius: var(--demo-radius);

    @media (hover: hover) {
      --copy-opacity: 0;

      &:hover,
      &:focus-within {
        --copy-opacity: 1;
      }
    }

    > div {
      display: flex;
      flex-direction: column;
      position: relative;
      isolation: isolate;
      outline: 0;

      > button:last-child {
        position: absolute;
        z-index: 2;
        inset-block-end: calc(var(--spacing) * 3);
        inset-inline-start: 50%;
        transform: translateX(-50%);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        inline-size: calc(var(--spacing) * 7);
        block-size: calc(var(--spacing) * 7);
        border-radius: var(--radius-full);
        background-color: var(--color-content);
        color: var(--color-gray-600);
        box-shadow: var(--elevation-raised);
        user-select: none;
        -webkit-tap-highlight-color: transparent;
        outline: 0;
        transition:
          background-color 150ms ease,
          color 150ms ease,
          box-shadow 150ms ease-out;

        &[data-open] {
          position: sticky;
          inset-inline-start: auto;
          transform: none;
          align-self: center;
          margin-block-start: calc(var(--spacing) * -10);
          margin-block-end: calc(var(--spacing) * 3);

          svg {
            transform: rotate(180deg);
          }
        }

        &:focus-visible {
          outline: 2px solid var(--color-gray-900);
          outline-offset: calc(var(--spacing) * 0.5);
        }

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }

        @media (hover: hover) {
          &:hover {
            background-color: var(--demo-shell);
            color: var(--color-gray-900);
          }
        }
      }
    }
  }
}
</style>
