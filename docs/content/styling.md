# Styling

Style parts with CSS or Tailwind.

Every part renders a real HTML element with no styles of its own. You write the CSS; the library exposes its state as `data-*` attributes and CSS variables you can target.

## The `class` and `style` attributes

Every part that renders an element accepts `class`, applied to that element. Vue's string, array and object forms all work:

```vue title="Switch"
<template>
  <Switch.Thumb class="switch-thumb" />
</template>
```

Prefer a state selector over a class you compute yourself. Most on/off state is already a `data-*` attribute (below).

Parts take `style` too, for the values only the running app knows:

```vue title="Switch"
<template>
  <!-- [!code highlight] -->
  <Switch.Thumb :style="{ transform: `translateX(${x}px)` }" />
</template>
```

Parts are components, but `class` and `style` fall through to the element a part renders, so `:class` and `:style` bindings work on a part exactly as they do on an element, and merge with whatever the part sets itself.

## State as `data-*` attributes

Each part mirrors its state onto the element as `data-*` attributes. Write one static class and style against the attribute.

[Switch](/vue/switch) publishes `[data-checked]` and `[data-unchecked]`:

```css title="switch.css"
.switch-thumb {
  transform: translateX(0);
  transition: transform 150ms;
}

.switch-thumb[data-checked] {
  transform: translateX(1rem);
}
```

The attributes are consistent across the library:

- **On/off state**: `[data-open]` / `[data-closed]`, `[data-checked]` / `[data-unchecked]`, `[data-disabled]`, `[data-selected]`, and `[data-highlighted]` for the item the keyboard or pointer has highlighted in a list.
- **Resolved position**: `[data-side]` and `[data-align]` on a positioner and popup carry where a floating element landed _after_ collision handling, so a popup can style the edge nearest its trigger.
- **Enter and exit**: `[data-starting-style]` marks an element the frame it mounts; `[data-ending-style]` the moment before it unmounts. Set resting styles as the default and transitional styles behind these two attributes, and mount/unmount animate with a plain transition. See [Animation](/vue/animation).

Each component's API reference lists what its own parts expose.

## CSS variables: live measurements

Where an attribute can't carry a number, a part sets a CSS variable for sizing or transform math. It updates as the layout changes.

[Accordion](/vue/accordion) measures its panel and exposes `--accordion-panel-height`, which animates a height from `auto`:

```css title="accordion.css"
.accordion-panel {
  overflow: hidden;
  height: var(--accordion-panel-height);
  transition: height 200ms;
}

.accordion-panel[data-starting-style],
.accordion-panel[data-ending-style] {
  height: 0;
}
```

Floating parts publish measurements the same way. A [Select](/vue/select) or [Popover](/vue/popover) positioner sets `--anchor-width` / `--anchor-height` (the trigger's size), `--available-width` / `--available-height` (room before the viewport edge), and `--transform-origin` (the point nearest the anchor). They sit on the positioner and inherit down, so the popup can read them:

```css title="select.css"
.select-popup {
  min-width: var(--anchor-width);
  max-height: var(--available-height);
  transform-origin: var(--transform-origin);
}
```

Every [Dialog](/vue/dialog) popup sets `--nested-dialogs` — how many dialogs are open inside it — paired with `[data-nested-dialog-open]`, so a parent can shrink or dim as children stack on top.

## Tailwind

Pass utilities through each part's `class`, and key state variants off the same `data-*` attributes with Tailwind's `data-*` syntax (`data-highlighted:…`, `data-starting-style:…`). Read a CSS variable with the `(--var)` shorthand, as in `origin-(--transform-origin)`:

```vue title="Menu"
<script setup>
import { Menu } from '@shardsui/vue/menu'
</script>

<template>
  <Menu.Root>
    <Menu.Trigger
      class="flex h-8 items-center justify-center rounded-md border border-gray-950 bg-white px-3 text-sm text-gray-950 select-none hover:bg-gray-100 focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-gray-950 active:bg-gray-200 data-popup-open:bg-gray-100"
    >
      Song
    </Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner class="outline-hidden" :side-offset="8">
        <Menu.Popup
          class="origin-(--transform-origin) border border-gray-950 bg-white py-1 text-gray-950 outline-hidden transition data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0"
        >
          <Menu.Item
            class="flex py-2 pr-8 pl-4 text-sm/4 outline-hidden select-none data-highlighted:bg-gray-950 data-highlighted:text-white"
          >
            Add to Library
          </Menu.Item>
          <Menu.Item
            class="flex py-2 pr-8 pl-4 text-sm/4 outline-hidden select-none data-highlighted:bg-gray-950 data-highlighted:text-white"
          >
            Add to Playlist
          </Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
```

## Plain CSS

Give each part a `class`, then write the rules in a stylesheet. The same `data-*` attributes and CSS variables work from these selectors (`.menu-item[data-highlighted]`, `.menu-popup[data-starting-style]`):

```vue title="Menu"
<script setup>
import './menu.css'
import { Menu } from '@shardsui/vue/menu'
</script>

<template>
  <Menu.Root>
    <Menu.Trigger class="menu-trigger">Song</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner class="menu-positioner" :side-offset="8">
        <Menu.Popup class="menu-popup">
          <Menu.Item class="menu-item">Add to Library</Menu.Item>
          <Menu.Item class="menu-item">Add to Playlist</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>
</template>
```

```css title="menu.css"
.menu-trigger {
  display: flex;
  height: 2rem;
  align-items: center;
  border: 1px solid var(--color-gray-950);
  background-color: white;
  padding-inline: 0.75rem;
}

.menu-popup {
  transform-origin: var(--transform-origin);
  border: 1px solid var(--color-gray-950);
  background-color: white;
  padding-block: 0.25rem;
}

.menu-item {
  display: flex;
  padding: 0.5rem 2rem 0.5rem 1rem;
  user-select: none;
}

.menu-item[data-highlighted] {
  background-color: var(--color-gray-950);
  color: white;
}
```

## Scoped `<style>` reaches the parts you write

`<style scoped>` stamps a data attribute onto the elements in your template and adds it to every selector. A child component's root element receives the parent's attribute too, so a `class` you pass to a part that renders a single element is matched by your scoped rules — portalled or not. This works because each part is written in _your_ template; the scope follows the markup, not the DOM position.

```vue title="Accordion"
<template>
  <Accordion.Root>
    <Accordion.Item>
      <Accordion.Header>
        <Accordion.Trigger>Shipping</Accordion.Trigger>
      </Accordion.Header>
      <Accordion.Panel class="accordion-panel">Ships in 2–3 days.</Accordion.Panel>
    </Accordion.Item>
  </Accordion.Root>
</template>

<style scoped>
/* Matches: the Panel's element carries this component's scope attribute. */
.accordion-panel {
  overflow: hidden;
}
</style>
```

A few parts render a second element beside their own — a hidden input on `Checkbox.Root`, `Radio.Root` and `Switch.Root`, focus guards on `Menu.Trigger` and `Popover.Trigger`, a backdrop on the positioners. Vue applies the scope attribute only to a component that renders exactly one element, so scoped rules don't reach those. Style them from a stylesheet instead.
