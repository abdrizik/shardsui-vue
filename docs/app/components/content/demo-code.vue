<script setup lang="ts">
const { html, collapsed = false } = defineProps<{ html: string; collapsed?: boolean }>()
</script>

<template>
  <div class="thin-scrollbar" :data-closed="collapsed ? '' : undefined">
    <div v-html="html"></div>
  </div>
</template>

<style scoped>
div:has(> div) {
  --demo-code-block-line-height: var(--text-code--line-height);
  position: relative;
  outline: 0;
  overflow-x: auto;
  overflow-y: hidden;
  overscroll-behavior-x: contain;
  border-end-start-radius: var(--demo-radius);
  border-end-end-radius: var(--demo-radius);
  line-height: var(--demo-code-block-line-height);

  &[data-closed] {
    overflow-x: hidden;
    max-block-size: var(--demo-min-h);
    mask-image: linear-gradient(to bottom, oklch(0 0 0) 45%, transparent);
  }

  > div {
    font-size: var(--text-code);
    line-height: var(--demo-code-block-line-height);
    display: flex;

    & :deep(pre) {
      display: flex;
      flex-grow: 1;
      background: none !important;
    }

    & :deep(code) {
      display: block;
      flex-grow: 1;
      padding-block: calc(var(--spacing) * 2);
      font-family: var(--font-mono);
      white-space: normal;

      .line {
        display: block;
        white-space: pre;
        padding-inline: calc(var(--spacing) * 3);

        &:empty {
          block-size: 1lh;
        }
      }

      &:not(:has(.line)) {
        padding-inline: calc(var(--spacing) * 3);
      }
    }
  }
}
</style>
