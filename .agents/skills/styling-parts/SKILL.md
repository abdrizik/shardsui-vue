---
name: shardsui-vue-styling-parts
description: Style @shardsui/vue parts with CSS or Tailwind — why Vue's scoped `<style>` does reach a part, the traps that creates, `:deep()` as the escape hatch, styling from `data-*` state attributes, and reading the CSS variables parts publish. Use when writing or reviewing styles for @shardsui/vue components.
---

# Styling ShardsUI parts

Every part renders a real element with no styles of its own, and mirrors its state onto `data-*`
attributes and CSS variables.

## Scoped `<style>` does reach a part — start here

`<style scoped>` stamps a `data-v-xxxxxx` attribute onto every element in your template — the
**root element of each child component you write** included — and appends `[data-v-xxxxxx]` to the
last selector of every rule. A part renders exactly one element, so a `class` you hand it already
matches, with nothing further to do. Portalled parts too — the scope follows the markup, not the DOM
position.

This holds even for a root behind `v-if`: the id is applied when the element renders, not at compile
time. And because the id sits on a child's root, a **structural** selector reaches in —
`Accordion.Root` renders a `<div>`, `Switch.Root` and `Switch.Thumb` a `<span>`, so `nav > span`
tints them. Target a class, not a position.

So reach for an escape hatch only for markup you did not write:

```
Where are you writing the rule?
├── A .css file, or an unscoped <style> → works as-is. Nothing further to do.
└── <style scoped> → a part you wrote is already matched by your class;
    for markup you did not write — a wrapped component's internals, or
    anything injected as HTML — use .wrapper :deep(.thing) { … }
```

`:deep()` must head its own rule. Nested inside another `:deep()` rule, Vue emits the scope id a
second time as a descendant (`nav[data-v-x] [data-v-x] .thing`) — it matches nothing and silently
drops every rule under it. Heading a `@media` block is fine. The argument-less block form keeps
several rules together:

```vue
<style scoped>
.faq :deep() {
  .accordion-panel {
    overflow: hidden;
  }
  .accordion-trigger {
    font-weight: 600;
  }
}
</style>
```

Anchor it to a wrapper you author: Vue scopes the leading `.faq`, so nothing leaks page-wide.

## Style from state, never from a class you compute

Each part already publishes its state. Write **one static class** and select on the attribute:

```css
.switch-thumb {
  transform: translateX(0);
  transition: transform 150ms;
}
.switch-thumb[data-checked] {
  transform: translateX(1rem);
}
```

Never mirror a part's state into your own ref to compute a class — the attribute is already there,
always correct, and lands with the same patch.

Attributes are consistent across the library:

- **On/off**: `[data-open]` / `[data-closed]`, `[data-checked]` / `[data-unchecked]`,
  `[data-disabled]`, `[data-selected]`, `[data-highlighted]` (the item the keyboard or pointer has
  highlighted).
- **Resolved position**: `[data-side]`, `[data-align]` — where a floating element landed _after_
  collision handling, so style the edge nearest the trigger from these, never from the `side` prop
  you passed.
- **Enter/exit**: `[data-starting-style]`, `[data-ending-style]` — see the animating-parts skill.

Each component's API reference lists what its own parts expose.

## CSS variables carry the numbers

Where an attribute can't hold a value, the part publishes a variable that updates with layout:

| Variable                                                  | Set on       | Use it for                                                     |
| --------------------------------------------------------- | ------------ | -------------------------------------------------------------- |
| `--anchor-width` / `--anchor-height`                      | positioner   | matching the trigger's size (`min-width: var(--anchor-width)`) |
| `--available-width` / `--available-height`                | positioner   | capping to the room left before the viewport edge              |
| `--transform-origin`                                      | positioner   | scaling out of the trigger rather than the popup's own center  |
| `--accordion-panel-height` / `--collapsible-panel-height` | panel        | animating a height that would otherwise be `auto`              |
| `--nested-dialogs`                                        | dialog popup | shrinking or dimming a parent as children stack                |

Positioner variables inherit down, so read them on the Popup.

## The `class` and `style` attributes

Both fall through to the element the part renders, so `:class` and `:style` work on a part exactly
as on an element — string, array and object forms all:

```vue
<template>
  <Switch.Thumb :class="['switch-thumb', tone]" :style="{ transform: `translateX(${x}px)` }" />
</template>
```

A part binds its own inline styles _after_ yours, so for a property it writes itself — a
positioner's `transform`, a panel's height variable — its value wins and yours is dropped. Style
around what a part owns.

## Tailwind

Pass utilities through `class`, key variants off the same attributes (`data-highlighted:bg-gray-950`,
`data-starting-style:opacity-0`), and read a published variable with the `(--var)` shorthand:

```vue
<template>
  <Menu.Popup class="origin-(--transform-origin) data-ending-style:opacity-0" />
</template>
```

Tailwind's classes are global, so neither the scope id nor `:deep()` enters into it.
