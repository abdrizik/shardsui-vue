<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import CopyButton from '~/components/copy-button.vue'

defineOptions({ inheritAttrs: false })

const { language } = defineProps<{ language?: string }>()

const pre = useTemplateRef<HTMLPreElement>('pre')
const code = computed(() => pre.value?.textContent ?? '')
</script>

<template>
  <div class="code-block-root not-prose">
    <div>
      <CopyButton :text="code" />

      <pre
        ref="pre"
        :class="['thin-scrollbar', $attrs.class]"
        :data-language="language"
      ><slot /></pre>
    </div>
  </div>
</template>

<style scoped>
.code-block-root {
  --code-inner-radius: var(--radius-md);
  align-self: stretch;
  margin-block: var(--prose-flow, calc(var(--spacing) * 4));
  padding: var(--spacing);
  background-color: var(--color-gray-100);
  border-radius: calc(var(--code-inner-radius) + var(--spacing));

  > div {
    position: relative;
    background-color: var(--color-content);
    border-radius: var(--code-inner-radius);

    @media (hover: hover) {
      --copy-opacity: 0;

      &:hover,
      &:focus-within {
        --copy-opacity: 1;
      }
    }
  }

  & :deep(pre) {
    background: none !important;
    font-size: var(--text-code);
    line-height: var(--text-code--line-height);
    color: var(--color-foreground);
    outline: 0;
    display: flex;
    overflow-x: auto;
    overscroll-behavior-x: contain;
    padding-block: calc(var(--spacing) * 3);

    code {
      display: grid;
      flex-grow: 1;
      font-family: var(--font-mono);
      white-space: normal;

      .line {
        display: block;
        white-space: pre;
        padding-inline: calc(var(--spacing) * 4);

        &:empty {
          block-size: 1lh;
        }
      }
    }
  }
}
</style>
