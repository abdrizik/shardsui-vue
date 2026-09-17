---
name: shardsui-vue-composing-parts
description: Compose @shardsui/vue parts correctly — nesting rules, overlay structure, detached handles, slot payloads, the `as` prop with a tag or a component, handler precedence, and wrapping parts in your own components. Use when building or reviewing UI that imports from @shardsui/vue.
---

# Composing ShardsUI parts

## The one structural rule

A part must be a **descendant of its Root**. Depth and intervening markup never matter — a Root
`provide`s its state and the parts beneath `inject` it back, never through props.

Never thread `open` / `@update:open` between sibling parts by hand. If you find yourself passing
state between two parts, the nesting is wrong or you need a handle (below).

## Which overlay structure?

```
Does the popup position itself against a trigger element?
├── Yes — Popover, Menu, Tooltip, Select, Combobox, Autocomplete, PreviewCard,
│         ContextMenu, NavigationMenu
│   └── Root > Trigger > Portal > Positioner > Popup
└── No — it fills or centers the screen: Dialog, AlertDialog, Drawer
    └── Root > Trigger > Portal > [Backdrop] > Viewport > Popup     ← never a Positioner
```

The Positioner owns the floating math and publishes `--anchor-width` / `--anchor-height`,
`--available-width` / `--available-height` and `--transform-origin` for the Popup to inherit. A modal
has no anchor, so it has no Positioner — adding one to a Dialog is always a mistake.

`Toast` is neither: it requires `<Toast.Provider>` (it holds the queue, built with
`Toast.createManager()`) and nests `Provider > Portal > Viewport > Root`.

## Trigger and content can't sit together?

```
Can the Trigger be a descendant of the Root — at any depth, inside any of your own markup?
├── Yes → nest them. Always prefer this.
└── No — different route, different layout region
    └── const handle = Dialog.createHandle()
        pass :handle="handle" to BOTH <Dialog.Trigger> and <Dialog.Root>
```

Handles exist only on the overlay components where a detached trigger makes sense: `Dialog`,
`AlertDialog`, `Drawer`, `Popover`, `Menu`, `Tooltip`, `PreviewCard`. Each exposes `createHandle()`;
`Dialog.Handle` is the matching _type_.

A handle also drives the component from code: `handle.open(triggerId)`, `handle.close()`, readonly
`handle.isOpen`.

- `Popover`, `Menu`, `Tooltip`, `PreviewCard` **throw** if no trigger with that id is registered —
  an anchored popup cannot open without something to anchor to.
- `Dialog`, `AlertDialog`, `Drawer` also accept `null` for "no trigger", and add
  `openWithPayload(payload)`.

Type the payload at creation — `Dialog.createHandle<{ name: string }>()` — and it flows from the
trigger into the Root's default slot.

## Reading a part's state in markup

Take the default slot's payload with `v-slot`:

```vue
<script setup lang="ts">
import { Switch } from '@shardsui/vue/switch'
import CheckIcon from './check-icon.vue'
</script>

<template>
  <Switch.Root>
    <Switch.Thumb v-slot="{ checked }">
      <CheckIcon v-if="checked" />
      <span v-else />
    </Switch.Thumb>
  </Switch.Root>
</template>
```

**Only when you need different markup.** Every value the slot passes is also emitted as a `data-*`
attribute, and CSS against the attribute is simpler than a slot plus a branch. Reach for the slot
when the two branches render different elements, never for styling.

## Changing the rendered element

`as` takes an HTML tag name — `'a'`, `'button'`, `'span'` — or a component of yours. Every part
already renders the element that is correct for its role, so change it only when the semantics
genuinely differ:

```vue
<script setup lang="ts">
import { Menu } from '@shardsui/vue/menu'
</script>

<template>
  <Menu.Item as="a" href="/library">Add to Library</Menu.Item>
  <Menu.Trigger :as="MyButton" size="md">Song</Menu.Trigger>
  <NavigationMenu.Link :as="RouterLink" to="/docs">Docs</NavigationMenu.Link>
</template>
```

Two rules decide whether a component works there:

- **It renders one root element and lets attributes reach it.** Vue forwards them unless the
  component sets `inheritAttrs: false`; two root nodes leave the part with no element to drive, and
  Vue warns that it could not apply the attributes.
- **The part keeps the semantics of the tag it documents.** `<Tabs.Tab>` renders a `<button>`, so it
  applies `type="button"` and a button's keyboard handling to whatever `as` names — right for a
  button component, wrong for a link. The part warns in development when the element disagrees. When
  those semantics matter, pass the tag and wrap your component around the part instead:

```vue
<template>
  <RouterLink v-slot="{ href, navigate }" to="/overview" custom>
    <Tabs.Tab as="a" :href="href" value="overview" @click="navigate">Overview</Tabs.Tab>
  </RouterLink>
</template>
```

One part can render another, so a single element carries both behaviours:

```vue
<template>
  <Toolbar.Button :as="Menu.Trigger">Open</Toolbar.Button>
</template>
```

Five parts stay tag-only, because their behaviour **is** their element: `Field.Control` and
`Combobox.Input` take `'input' | 'textarea'`, and the checkbox, radio and switch roots take
`'span' | 'button'`.

## Your handlers and the part's

Any attribute that isn't one of the part's own props falls through to the element it renders —
`href`, ARIA, `data-*`, listeners.

For every event a part handles, **your handler runs first and the part's runs after**, so its
keyboard handling, ARIA and `data-*` state survive your handler.

To make the part stand down for one event, call `preventShardsUIHandler()` on the event. It sits
only on the events the part chains, and not on the TypeScript event type, so it needs a cast:

```vue
<script setup lang="ts">
import { Menu } from '@shardsui/vue/menu'

const ready = false

function onBillingClick(event: MouseEvent) {
  if (!ready) (event as MouseEvent & { preventShardsUIHandler(): void }).preventShardsUIHandler()
}
</script>

<template>
  <Menu.Item @click="onBillingClick">Billing</Menu.Item>
</template>
```

## Getting the DOM node

A template `ref` on a part resolves to its component instance, whose `$el` is the element the part
rendered — populated **after** mount, so read it from a lifecycle hook or an event handler, never
during setup. Every part that renders its own element exposes `$el`; pure providers like
`Dialog.Root` do not, and `initialFocus` takes a getter for the same timing reason.

## Wrapping a part in your own component

`as` hands a part an element of yours. Building a styled component _out of_ a part is the other
direction: render the part as your component's single root and declare nothing —
fallthrough carries the caller's `class`, listeners and the part's own props through.

```vue
<script setup lang="ts">
import { Menu } from '@shardsui/vue/menu'
</script>

<template>
  <Menu.Item as="a" class="menu-link">
    <slot />
  </Menu.Item>
</template>
```

Three rules this example encodes:

- **Keep it single-root.** Wrap the part in an element and fallthrough lands there instead — then
  `defineOptions({ inheritAttrs: false })` and `v-bind="$attrs"` on the part.
- **Forward content with `<slot />`.** Attributes fall through on their own; slots never do. Re-emit
  a stateful part's payload: `<Menu.Item v-slot="state"><slot v-bind="state" /></Menu.Item>`.
- **Take prop types from the part** — `defineProps<InstanceType<typeof Menu.Item>['$props']>()` plus
  `v-bind="props"` — never re-declare them, or what you declare stops falling through.
