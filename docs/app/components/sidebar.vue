<script setup lang="ts">
import GitHub from '~/components/icons/github.vue'
import Npm from '~/components/icons/npm.vue'
import Logo from '~/components/logo.vue'
import { useClipboard } from '~/utils/clipboard'
import { github, installCommand, npm } from '~/utils/site'
import { version } from '~/utils/version'

const { copied, copy } = useClipboard()
</script>

<template>
  <aside>
    <div>
      <h1>
        <Logo />
        <span>
          <span>ShardsUI.</span> Unstyled, accessible UI components for
          <span>
            <svg viewBox="0 0 261.76 226.69" aria-hidden="true">
              <path
                fill="var(--color-vue)"
                d="M161.096.001l-30.225 52.351L100.647.001H-.005l130.877 226.688L261.749.001z"
              />
              <path
                fill="#34495e"
                d="M161.096.001l-30.225 52.351L100.647.001H52.346l78.526 136.01L209.398.001z"
              />
            </svg>
            Vue
          </span>
        </span>
      </h1>
      <p>
        Keyboard interaction, focus management, and ARIA on every part. You compose them and bring
        the CSS. Adapted from
        <a href="https://base-ui.com" rel="external noopener noreferrer">Base&nbsp;UI</a>.
      </p>
      <div>
        <button type="button" :data-copied="copied ? '' : undefined" @click="copy(installCommand)">
          <span>{{ installCommand }}</span>
          <span class="sr-only" role="status">{{ copied ? 'Copied' : '' }}</span>
          <span>
            <span aria-hidden="true">
              <svg viewBox="0 0 14 14" fill="currentcolor">
                <path
                  d="M1.5 1C0.675781 1 0 1.67578 0 2.5V10.5C0 11.3242 0.675781 12 1.5 12H3V12.5C3 13.3242 3.67578 14 4.5 14H12.5C13.3242 14 14 13.3242 14 12.5V4.5C14 3.67578 13.3242 3 12.5 3H11V2.5C11 1.67578 10.3242 1 9.5 1H1.5ZM1.5 2H9.5C9.78125 2 10 2.21875 10 2.5V10.5C10 10.7812 9.78125 11 9.5 11H1.5C1.21875 11 1 10.7812 1 10.5V2.5C1 2.21875 1.21875 2 1.5 2ZM11 4H12.5C12.7812 4 13 4.21875 13 4.5V12.5C13 12.7812 12.7812 13 12.5 13H4.5C4.21875 13 4 12.7812 4 12.5V12H9.5C10.3242 12 11 11.3242 11 10.5V4Z"
                  transform="translate(0 -1)"
                />
              </svg>
            </span>
            <span aria-hidden="true">
              <svg viewBox="0 0 10 10" fill="none">
                <path
                  d="M0.833008 4.64229L3.8336 8.12297L9.53471 1.50968"
                  stroke="currentcolor"
                  stroke-width="1.25"
                />
              </svg>
            </span>
          </span>
        </button>
        <NuxtLink to="/vue/quick-start">Get started</NuxtLink>
      </div>
    </div>

    <nav aria-label="Site">
      <div>
        <a :href="npm" rel="external noopener noreferrer" aria-label="npm">
          <Npm />
        </a>
        <a :href="github" rel="external noopener noreferrer" aria-label="GitHub">
          <GitHub />
        </a>
      </div>
      <span>v{{ version }}</span>
    </nav>
  </aside>
</template>

<style scoped>
aside {
  display: flex;
  flex-direction: column;
  gap: calc(var(--spacing) * 8);

  > div {
    display: flex;
    flex-direction: column;
    gap: calc(var(--spacing) * 5);

    > h1 {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: var(--text-4xl);
      font-weight: var(--font-weight-semibold);
      letter-spacing: var(--tracking-tight);
      line-height: var(--leading-tight);
      text-wrap: balance;
      color: var(--color-gray-900);

      > span:last-child {
        margin-block-start: calc(var(--spacing) * 14);
        font-size: var(--text-3xl);
        line-height: var(--leading-tight);
        text-wrap: pretty;
        color: var(--color-gray-500);

        > span:first-child {
          color: var(--color-gray-900);
        }

        > span:last-child {
          color: var(--color-vue);
          display: inline-flex;
          align-items: center;
          gap: 0.28em;
          white-space: nowrap;
          vertical-align: baseline;
        }

        svg {
          /* Tailwind's preflight makes every svg display: block, which breaks the line */
          display: inline-block;
          /* an svg with no width attribute defaults to 100%; auto lets the viewBox's
             ratio size it against the height instead */
          inline-size: auto;
          block-size: 0.9em;
          vertical-align: -0.08em;
        }
      }
    }

    > p {
      line-height: var(--leading-snug);
      text-wrap: pretty;
      color: var(--color-gray-600);

      a {
        color: var(--color-gray-900);
        text-decoration: underline;
        text-decoration-thickness: from-font;
        text-underline-position: from-font;
        text-decoration-skip-ink: auto;
        text-decoration-color: var(--color-gray-300);
        text-underline-offset: 0.16em;
        transition: text-decoration-color 150ms var(--ease-out);

        &:hover {
          text-decoration-color: var(--color-gray-900);
        }

        &:focus-visible {
          border-radius: var(--radius-xs);
        }
      }
    }

    > div {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: calc(var(--spacing) * 2);

      button,
      a {
        position: relative;
        display: flex;
        block-size: calc(var(--spacing) * 9);
        flex-shrink: 0;
        align-items: center;
        gap: calc(var(--spacing) * 2);
        border: 1px solid;
        border-radius: var(--radius-md);
        padding-inline: calc(var(--spacing) * 3.5);
        font-size: var(--text-xs);
        white-space: nowrap;
      }

      /* 36px of shell, 44px of target — block-only so the two never overlap */
      button::before,
      a::before {
        content: '';
        position: absolute;
        inset-block: calc(var(--spacing) * -1);
        inset-inline: 0;
      }

      button {
        flex-grow: 1;
        /* trailing icon: 2px less on its side reads as even */
        padding-inline-end: calc(var(--spacing) * 3);
        border-color: var(--color-gray-950);
        background-color: var(--color-gray-950);
        font-family: var(--font-mono);
        color: var(--color-content);
        transition: background-color 150ms var(--ease-out);

        &:hover {
          border-color: var(--color-gray-800);
          background-color: var(--color-gray-800);
        }

        > span:nth-child(3) {
          position: relative;
          margin-inline-start: auto;
          flex-shrink: 0;
          inline-size: calc(var(--spacing) * 3.5);
          block-size: calc(var(--spacing) * 3.5);

          > span {
            position: absolute;
            inset: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            transition:
              opacity 150ms var(--ease-out),
              transform 150ms var(--ease-out);

            @media (prefers-reduced-motion: reduce) {
              transition: none;
            }
          }

          svg {
            inline-size: calc(var(--spacing) * 3);
            block-size: calc(var(--spacing) * 3);
          }

          > span:last-child {
            opacity: 0;
            transform: scale(0.7);
          }
        }

        &[data-copied] > span:nth-child(3) {
          > span:first-child {
            opacity: 0;
            transform: scale(0.7);
          }

          > span:last-child {
            opacity: 1;
            transform: scale(1);
          }
        }
      }

      a {
        border-color: var(--color-gray-200);
        background-color: var(--color-content);
        font-weight: var(--font-weight-medium);
        color: var(--color-gray-800);
        transition: background-color 150ms var(--ease-out);

        &:hover {
          background-color: var(--color-gray-100);
        }
      }
    }
  }

  button:focus-visible,
  a:focus-visible {
    outline: 2px solid var(--color-gray-900);
    outline-offset: calc(var(--spacing) * 0.5);
  }

  nav {
    display: flex;
    margin-block-start: auto;
    margin-inline-start: calc(var(--spacing) * -1.5);
    align-items: center;
    justify-content: space-between;
    gap: calc(var(--spacing) * 3);
    padding-block-start: calc(var(--spacing) * 8);

    > div {
      display: flex;
      align-items: center;
    }

    a {
      display: inline-flex;
      padding: calc(var(--spacing) * 1.5);
      color: var(--color-gray-700);
      transition: color 150ms var(--ease-out);

      &:hover {
        color: var(--color-gray-950);
      }

      &:focus-visible {
        border-radius: var(--radius-xs);
      }
    }

    span {
      font-family: var(--font-mono);
      font-size: var(--text-xs);
      font-variant-numeric: tabular-nums;
      color: var(--color-gray-400);
    }
  }

  @media (width >= 40rem) {
    max-inline-size: var(--width-rail);
  }

  @media (width >= 64rem) {
    position: sticky;
    inset-block-start: calc(var(--spacing) * 12);
    align-self: start;
    block-size: calc(100dvh - calc(var(--spacing) * 24));
    min-block-size: max-content;
  }
}
</style>
