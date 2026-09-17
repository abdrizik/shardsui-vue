# Composition

Slots, the as prop, and detached handles.

Each part keeps its behavior — ARIA, keyboard, focus, and `data-*` state — and leaves the rest to you: the tag it renders, its attributes, and its content.

## Nesting is the API

Parts talk to each other through Vue's provide/inject, not props. A `<Menu.Root>` provides its state; `<Menu.Trigger>`, `<Menu.Positioner>`, and `<Menu.Item>` inject it back. That's why you nest them instead of wiring `open`/`@update:open` between siblings by hand. The shared state never appears in your markup at all.

```vue title="Parts read state through provide/inject"
<script setup>
import { Menu } from '@shardsui/vue/menu'
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Song</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <Menu.Item>Add to Library</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
```

`Portal` moves the popup out to `<body>`, and nesting still holds — the part is written inside its Root, and provide/inject follows the markup, not the DOM. Use the Portal part rather than Vue's `<Teleport>`: the library marks its own portal element and reads that marker to decide what counts as inside the popup for outside-press and focus, so a `<Teleport>` it doesn't know about breaks those checks.

The only rule this imposes: a part must be a descendant of its Root. Depth and intervening markup don't matter, so wrap parts in your own layout elements as you like. When the nesting genuinely can't hold (a trigger that lives in a header, a popup that lives in a route), reach for a [handle](#detaching-parts-with-a-handle) instead.

## Content is a slot

Whatever you put between a part's tags is its default slot, rendered wherever the part decides its content belongs:

```vue title="Default slot"
<template>
  <Switch.Root v-model:checked="checked">
    <Switch.Thumb>
      <Icon name="check" />
    </Switch.Thumb>
  </Switch.Root>
</template>
```

Most parts hand their own state _back_ through that slot. Add `v-slot` to receive it and branch on it in markup:

```vue title="Stateful content"
<script setup>
import { Switch } from '@shardsui/vue/switch'
</script>

<template>
  <Switch.Root>
    <Switch.Thumb v-slot="{ checked }">
      <CheckedIcon v-if="checked" />
      <UncheckedIcon v-else />
    </Switch.Thumb>
  </Switch.Root>
</template>
```

The scoped form is otherwise identical to markup between the tags. It lets you name the payload. What a part passes is listed in its `default` row in the API reference. The same values are also emitted as `data-*` attributes, so reach for the slot when you need different markup; for styling alone, `data-*` in CSS is simpler.

`<Dialog.Root>` passes something other than its own state: the `payload` of whichever trigger opened it.

```vue title="A slot that receives the trigger's payload"
<script setup lang="ts">
import { Dialog } from '@shardsui/vue/dialog'

const confirm = Dialog.createHandle<{ name: string }>()
</script>

<template>
  <Dialog.Trigger :handle="confirm" :payload="{ name: 'billing' }">Delete</Dialog.Trigger>

  <Dialog.Root v-slot="{ payload }" :handle="confirm">
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Title>Delete {{ payload?.name }}?</Dialog.Title>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

## Changing the rendered element

Every part picks the element that's correct for its role, and the `as` prop swaps it. `<Menu.Item>` renders a `<div>` by default; render it as an `<a>` and it behaves like a real link while keeping its menu-item semantics:

```vue title="Item as a link"
<template>
  <!-- [!code word:as="a"] -->
  <Menu.Item as="a" href="https://example.com">Add to Library</Menu.Item>
</template>
```

Reach for a tag only when a case like the anchor above calls for a different one.

## Rendering a component of your own

`as` also takes a component, for when the element belongs to your design system or to your router:

```vue title="Trigger as your own button"
<script setup>
import { Menu } from '@shardsui/vue/menu'
import MyButton from './MyButton.vue'
</script>

<template>
  <!-- [!code word::as="MyButton"] -->
  <Menu.Trigger :as="MyButton" size="md">Song</Menu.Trigger>
</template>
```

Props the part doesn't declare go through to your component — `size` above lands on `MyButton` — and so do the part's own attributes, its `data-*` state and its event handlers. Two things are asked of the component: it renders a single root element, and it lets the attributes it receives reach that element. Vue already does the second unless the component sets `inheritAttrs: false`. Give a part a component with two root nodes and there's no element for it to drive — Vue warns that it could not apply the attributes.

A part keeps the semantics of the tag it documents, whatever you render it as. `<Menu.Trigger>` renders a `<button>`, so it keeps `type="button"` and a button's keyboard behavior — right when your component renders a button, wrong when it renders something else, and the part warns in development when the element it ends up with disagrees. Parts that render an `<a>` or a `<div>` — `<NavigationMenu.Link>`, `<Menu.LinkItem>`, `<Menu.Item>` — take a router's link directly:

```vue title="Link as a router link"
<template>
  <!-- [!code word::as="RouterLink"] -->
  <NavigationMenu.Link :as="RouterLink" to="/docs">Docs</NavigationMenu.Link>
</template>
```

One part can render another, which is how a single element carries two behaviors — a toolbar button that also opens a menu:

```vue title="A trigger inside a toolbar"
<template>
  <Menu.Root>
    <Toolbar.Root>
      <!-- [!code word::as="Menu.Trigger"] -->
      <Toolbar.Button :as="Menu.Trigger">Open</Toolbar.Button>
    </Toolbar.Root>
    ...
  </Menu.Root>
</template>
```

Where the part renders a `<button>` and you need a link, pass the tag instead and keep your component's behavior around it, so the element stays a real anchor and the part's semantics follow the tag:

```vue title="Router link in a part that renders a button"
<template>
  <!-- [!code word:custom] -->
  <RouterLink v-slot="{ href, navigate }" to="/overview" custom>
    <Tabs.Tab as="a" :href="href" value="overview" @click="navigate">Overview</Tabs.Tab>
  </RouterLink>
</template>
```

A plain `<a href>` navigates with a full page load, so reach for one of these whenever the destination is inside your app.

## Merging your own attributes

Any attribute that isn't one of a part's own props falls through to the element it renders. In the link above, `href` isn't a `Menu.Item` prop, so it lands on the `<a>`. The same path carries event listeners, ARIA, `data-*`, and styling hooks:

```vue title="Forwarded attributes"
<template>
  <Menu.Item data-section="billing" aria-label="Open billing" @click="console.log('selected')">
    Billing
  </Menu.Item>
</template>
```

A listener doesn't replace the part's: for every event a part handles, yours runs first and the part's runs after, so its ARIA, keyboard handling, and `data-*` state all survive.

When you need the part to stand down for one event, call `preventShardsUIHandler()` on it, an escape hatch for cases no prop covers yet:

```vue title="Suppressing the part's handler"
<template>
  <!-- [!code word:preventShardsUIHandler] -->
  <Menu.Item
    @click="
      (event) => {
        if (!ready) event.preventShardsUIHandler()
      }
    "
  >
    Billing
  </Menu.Item>
</template>
```

## Getting the DOM node

A part renders one element, so a template `ref` on the part resolves to a component instance whose `$el` is that element. It's populated after the element mounts, so read it from a watcher or an event handler, never during setup:

```vue title="Reading the element"
<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'
import { Popover } from '@shardsui/vue/popover'

const trigger = useTemplateRef('trigger')

onMounted(() => {
  const element = trigger.value?.$el as HTMLElement | undefined
  if (element) console.log(element.getBoundingClientRect())
})
</script>

<template>
  <Popover.Root>
    <Popover.Trigger ref="trigger">Open</Popover.Trigger>
    ...
  </Popover.Root>
</template>
```

Every part that renders its own element exposes it as `$el`. Pure providers like `Dialog.Root` don't.

## Wrapping a part in your own component

To build a styled component out of a part, render the part and let your attributes fall through — `as` is for handing a part an element, not for wrapping one. A single-root component forwards everything it doesn't declare, and a caller's `class` merges with yours rather than replacing it:

```vue title="MenuLink.vue"
<script setup lang="ts">
import { Menu } from '@shardsui/vue/menu'
</script>

<template>
  <Menu.Item as="a" class="menu-link" />
</template>
```

To accept exactly the part's props with types, declare them from the part's own prop type. See [TypeScript](/typescript) for typing a wrapper.

## Detaching parts with a handle

When a trigger and the thing it opens can't sit together in the markup — a toolbar button and a dialog defined in a different route, say — a **handle** connects them without any shared `open` state threaded through props. Create one with the component's `createHandle()`, pass it to both ends, and they find each other:

```vue title="Detached trigger"
<!-- [!code word::handle="settings"] -->
<script setup>
import { Dialog } from '@shardsui/vue/dialog'

const settings = Dialog.createHandle()
</script>

<template>
  <Dialog.Trigger :handle="settings">Open settings</Dialog.Trigger>

  <!-- ...anywhere else in the tree... -->
  <Dialog.Root :handle="settings">...</Dialog.Root>
</template>
```

A handle also drives the component from your own code, no trigger required: `settings.open(triggerId)`, `settings.close()`, and a readonly `settings.isOpen`. `open` takes the `id` of a registered detached trigger so the popup knows what it was opened from. Popover, Menu, Tooltip, and Preview Card throw if no trigger with that id is registered, while Dialog, Alert Dialog, and Drawer also accept `null` for "no trigger" and add `openWithPayload(payload)`. `Dialog.createHandle<Payload>()` types the payload that flows through the trigger and into the root's default slot. See [TypeScript](/typescript) for the details.

Handles are available on the overlay components where a detached trigger makes sense: `Dialog`, `AlertDialog`, `Drawer`, `Popover`, `Menu`, `Tooltip`, and `PreviewCard`.

## Providers

A provider renders no element of its own — it only provides context to everything nested inside it. `DirectionProvider` is the one that applies to every component: wrap a subtree, or the whole app, and the components inside navigate and lay out for right-to-left reading.

```vue title="Right-to-left subtree"
<script setup>
import { DirectionProvider } from '@shardsui/vue/direction-provider'
</script>

<template>
  <DirectionProvider direction="rtl">
    <!-- components here read RTL -->
  </DirectionProvider>
</template>
```

It changes component behavior only, never the DOM's own text direction. See [Reading direction](/state#reading-direction) for what that leaves you to do.

Three components ship a provider of their own: `<Tooltip.Provider>` shares one delay across the tooltips inside it, so the next one opens instantly; `<Toast.Provider>` holds the toast queue; and `<Drawer.Provider>` tracks which drawers are open, driving `<Drawer.Indent>` and `<Drawer.IndentBackground>`.
