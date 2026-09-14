<script setup lang="ts">
import { Collapsible } from '@shardsui/vue/collapsible'
import type { ReferenceRow } from '~/utils/reference-tables'

defineOptions({ inheritAttrs: false })

const { columns, rows } = defineProps<{ columns?: string[]; rows?: ReferenceRow[] }>()
</script>

<template>
  <div class="table-scroll thin-scrollbar" role="region" aria-label="Scrollable table" tabindex="0">
    <table :class="$attrs.class">
      <template v-if="rows && columns">
        <thead>
          <tr>
            <th v-for="column in columns" :key="column" scope="col">{{ column }}</th>
            <th scope="col" aria-hidden="true"></th>
          </tr>
        </thead>
        <Collapsible.Root v-for="(row, index) in rows" :key="index" as="tbody">
          <Collapsible.Trigger as="tr">
            <td v-for="(cell, i) in row.summary" :key="i" v-html="cell"></td>
            <td></td>
          </Collapsible.Trigger>
          <tr>
            <td :colspan="columns.length + 1">
              <Collapsible.Panel>
                <div>
                  <div v-for="item in row.detail" :key="item.label">
                    <span>{{ item.label }}:</span>
                    <span v-html="item.html"></span>
                  </div>
                </div>
              </Collapsible.Panel>
            </td>
          </tr>
        </Collapsible.Root>
      </template>
      <slot v-else />
    </table>
  </div>
</template>

<style scoped>
/* `Collapsible` parts in the reference rows carry this scope, so selectors reach
   them; nested under `.table-scroll` to beat the specificity of the shared `td`
   rules in prose.css. */
.table-scroll tbody {
  > tr:first-child {
    /* Safari ignores max-inline-size on cells in auto table layout; there the
       row falls back to the horizontal scroll of .table-scroll. */
    td {
      max-inline-size: var(--table-cell-max, 40ch);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    td:last-child {
      inline-size: calc(var(--spacing) * 10);
      /* The 0.4rem square rotated 45deg is 0.57rem wide, so its tip would
         overflow the last cell's zeroed padding and get clipped by the
         scroll container. */
      padding-inline-end: calc(var(--spacing) * 0.5);
      text-align: end;

      &::after {
        content: '';
        display: inline-block;
        inline-size: calc(var(--spacing) * 1.6);
        block-size: calc(var(--spacing) * 1.6);
        border-inline-end: 1.5px solid var(--color-gray-500);
        border-block-end: 1.5px solid var(--color-gray-500);
        transform: translateY(calc(var(--spacing) * -0.6)) rotate(45deg);
        transition: transform 150ms ease;

        @media (prefers-reduced-motion: reduce) {
          transition: none;
        }
      }
    }

    &[data-panel-open] td:last-child::after {
      transform: translateY(calc(var(--spacing) * 0.2)) rotate(225deg);
    }
  }

  > tr:last-child > td {
    padding: 0;

    > div {
      height: var(--collapsible-panel-height);
      overflow: hidden;
      transition: height 200ms ease;

      &[data-starting-style],
      &[data-ending-style] {
        height: 0;
      }

      &[hidden]:not([hidden='until-found']) {
        display: none;
      }

      @media (prefers-reduced-motion: reduce) {
        transition: none;
      }

      > div {
        max-inline-size: 68ch;
        padding: calc(var(--spacing) * 3) calc(var(--spacing) * 4) calc(var(--spacing) * 3.5) 0;
        white-space: normal;
        text-wrap: pretty;

        > div + div {
          margin-block-start: calc(var(--spacing) * 2);
        }

        > div > span:first-child {
          margin-inline-end: calc(var(--spacing) * 1.5);
          font-weight: 500;
          color: var(--color-foreground);
        }
      }
    }
  }
}
</style>
