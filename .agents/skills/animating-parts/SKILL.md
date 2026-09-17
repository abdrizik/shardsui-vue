---
name: shardsui-vue-animating-parts
description: Animate @shardsui/vue parts on enter and exit — transitions over keyframes, the `data-starting-style` / `data-ending-style` pair, why the exit check only sees the part's own element and `<Transition>` cannot drive it, animating height from auto, JS animation from a template ref, `data-instant`, and reduced motion. Use when adding or reviewing motion on @shardsui/vue components.
---

# Animating ShardsUI parts

Nothing animates on its own. A closing element stays in the DOM until its animation finishes, so
motion is entirely yours to write.

## How the exit is detected — the rule everything else follows from

A closing element gains `[data-closed]` and `[data-ending-style]`, then is removed a frame later once
every animation **on that element** has finished. The library calls `element.getAnimations()` on the
part's own element, **not its subtree**.

Three consequences, all absolute:

- Animate the **part's own element**. An animation on a child is invisible to the check, so the popup
  is removed while that child is still animating.
- Vue's `<Transition>` **never works** on a part. It has to own the mount and unmount of what it
  wraps, but the part decides when its element leaves — and whatever you wrap is a child, invisible
  to the check.
- An element with **no** animation is removed immediately. That is what makes an unstyled component
  feel instant rather than delayed — it is not a bug to fix.

CSS transitions, CSS keyframes and Web Animations API calls all register with `getAnimations()`.

## Choosing the technique

```
What kind of motion?
├── Enter/exit that can be expressed as a state change (fade, scale, slide)
│   └── CSS transition + [data-starting-style] / [data-ending-style]   ← default, always prefer
├── Motion a transition cannot express (spin, bounce, multi-step ease)
│   └── @keyframes keyed off [data-open] / [data-closed]
└── Physics, gestures, or a JS animation library
    └── a template ref on the part + a watcher, plus keep-mounted on the Portal
```

Prefer a transition to a keyframe animation. A transition is **reversible mid-flight**: a popup
dismissed before it finished opening glides straight back to closed. A keyframe animation must run to
completion, so it visibly snaps when interrupted.

## Transitions: resting styles on the element, extremes behind the two attributes

```css
.popup {
  transform-origin: var(--transform-origin);
  transition:
    transform 150ms,
    opacity 150ms;

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

Both attributes are present **only while the element is in motion** — `[data-starting-style]` the
frame it mounts, `[data-ending-style]` the moment before it unmounts.

Set `transform-origin: var(--transform-origin)` on any scaling popup. It points the scale at the
trigger, so the popup grows out of the element that spawned it instead of its own center.

## Animating height from `auto`

Browsers can't interpolate to an intrinsic size, so Collapsible and Accordion measure the content and
publish it. Transition between `0` and the measured value, and clip the overflow so contents don't
spill mid-open:

```css
.panel {
  overflow: hidden;
  height: var(--collapsible-panel-height); /* --accordion-panel-height on Accordion */
  transition: height 150ms ease-out;
}
.panel[data-starting-style],
.panel[data-ending-style] {
  height: 0;
}
```

## JS animation

Put a template ref on the part and animate from a watcher — the instance's `$el` is exactly where
`getAnimations()` looks, and watching `open` lets one watcher play both directions:

```vue
<script setup lang="ts">
import { shallowRef, useTemplateRef, watch } from 'vue'
import { animate } from 'motion'
import { Popover } from '@shardsui/vue/popover'

const open = shallowRef(false)
const popup = useTemplateRef<InstanceType<typeof Popover.Popup>>('popup')

watch(open, (isOpen) => {
  const node = popup.value?.$el
  if (node) animate(node, isOpen ? { opacity: 1, scale: 1 } : { opacity: 0.9999, scale: 0.9 })
})
</script>

<template>
  <Popover.Root v-model:open="open">
    <Popover.Trigger>Details</Popover.Trigger>
    <Popover.Portal keep-mounted>
      <Popover.Positioner>
        <Popover.Popup ref="popup">Popup</Popover.Popup>
      </Popover.Positioner>
    </Popover.Portal>
  </Popover.Root>
</template>
```

Two requirements, both mandatory:

- **`keep-mounted` on the Portal.** The popup must survive the close so the next open animates from
  the values the exit left behind. Without it, a freshly mounted element sits at its resting style
  with nothing to animate from.
- **Animate `opacity` too**, even when the motion is purely positional — to a barely-perceptible
  `0.9999` if you must. Not every library reports every property to `getAnimations()`; a drawer that
  only translates can have nothing to report at removal time and will vanish without its exit.

## `[data-instant]` — the library marks, you cancel

Some changes must not animate: a tooltip opened by keyboard focus, a popup dismissed with Escape, a
menubar handing its menu between triggers. The library only sets the attribute. Cancelling the motion
is yours:

```css
.popup[data-instant] {
  transition-duration: 0s;
}
```

Omit this and those interactions animate when they shouldn't — nothing warns you.

## Reduced motion

Author resting styles with **no** motion, then layer transitions in only when motion is welcome:

```css
.popup {
  transform-origin: var(--transform-origin);

  @media (prefers-reduced-motion: no-preference) {
    transition:
      transform 150ms,
      opacity 150ms;
  }

  &[data-starting-style],
  &[data-ending-style] {
    opacity: 0;
    transform: scale(0.9);
  }
}
```

With no transition the element snaps between states and there is nothing to wait on, so unmount stays
immediate. Strip the transforms that move things across the screen; keep an opacity or color shift if
you still want a fade.
