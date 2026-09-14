# Quick start

Install ShardsUI, set up portals, and compose a first component.

## Install

```bash title="Terminal"
npm install @shardsui/vue
```

ShardsUI requires Vue 3.5 or later. It ships as one package, and each component is its own entry point, so you import only what you use:

```vue
<script setup>
import { Popover } from '@shardsui/vue/popover'
</script>
```

### Browser support

ShardsUI supports Chrome and Edge 121, Firefox 97, and Safari 18.2 or later.

## Set up

### Portals

Overlay components render their content through a **portal** so they escape clipping or a parent **stacking context**: a `<Component.Portal>` part appends the contents to the document body. Pass `container` to send them somewhere else.

Give your layout root its own stacking context, and no `z-index` deeper in the tree can paint over a portalled overlay:

```vue title="App.vue"
<script setup>
import './app.css'
</script>

<template>
  <div class="root">
    <RouterView />
  </div>
</template>
```

```css title="app.css"
.root {
  isolation: isolate;
}
```

### Full-viewport backdrops

Some browsers now render content edge-to-edge beneath collapsing browser chrome (iOS 26+ Safari, for example), so a `position: fixed` backdrop — a dialog's, say — can leave a gap once the page scrolls. Switching such a backdrop to `position: absolute` covers the whole visual viewport, and it needs the body as its containing block to stay put after a scroll:

```css title="app.css"
body {
  position: relative;
}
```

## Compose a component

Parts ship behavior and accessibility; you assemble them and bring the styles. Nest a [Popover](/popover)'s parts and style them with Tailwind, plain CSS, or a global stylesheet:

:demo{name="popover/hero"}

## Wrap the parts once

Rather than repeat the same classes at every call site, [wrap each part once](/composition#wrapping-a-part-in-your-own-component) in a component of your own and import that instead.

## Next steps

The [Styling](/styling), [Animation](/animation), and [Composition](/composition) guides cover appearance and structure. Or jump straight to a [component](/accordion).
