# Avatar

A user image with a fallback.

:demo{name="avatar/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { Avatar } from '@shardsui/vue/avatar'
</script>

<template>
  <Avatar.Root>
    <Avatar.Image />
    <Avatar.Fallback />
  </Avatar.Root>
</template>
```

## API reference

### Root

Groups the image and its fallback. Renders a `<span>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                       | Default  | Description                                 |
| :-------- | :----------------------------------------- | :------- | :------------------------------------------ |
| `as`      | `keyof HTMLElementTagNameMap \| Component` | `'span'` | HTML element to render.                     |
| `class`   | `string`                                   | —        | CSS class applied to the element.           |
| `style`   | `string`                                   | —        | Inline style applied to the element.        |
| `default` | `Slot<{ imageLoadingStatus }>`             | —        | Content; receives the image loading status. |

::

### Image

Renders an `<img>` element.

The component preloads the image — applying the same `src`, `srcset`, `sizes`, `crossorigin` and `referrerpolicy` — so the loading status is known from the first render. Those five are declared props rather than fallthrough attributes, so changing any of them restarts the preload. The `<img>` mounts only once the image has loaded, which is why it can be animated in with `data-starting-style`; see [Animation](/animation).

::table{columns="Prop,Type,Default"}

| Prop                  | Type                                       | Default | Description                                                                     |
| :-------------------- | :----------------------------------------- | :------ | :------------------------------------------------------------------------------ |
| `as`                  | `keyof HTMLElementTagNameMap \| Component` | `'img'` | HTML element to render.                                                         |
| `class`               | `string`                                   | —       | CSS class applied to the element.                                               |
| `style`               | `string`                                   | —       | Inline style applied to the element.                                            |
| `src`                 | `string`                                   | —       | Image URL.                                                                      |
| `srcset`              | `string`                                   | —       | Responsive image source set. Enough on its own — `src` may be omitted.          |
| `sizes`               | `string`                                   | —       | Layout widths the browser matches `srcset` against.                             |
| `crossorigin`         | `'anonymous' \| 'use-credentials' \| ''`   | —       | CORS mode used to fetch the image.                                              |
| `referrerpolicy`      | `ReferrerPolicy`                           | —       | Referrer sent when fetching the image.                                          |
| `alt`                 | `string`                                   | —       | Alternative text. Use `alt=""` when the user's name already appears next to it. |
| `loadingStatusChange` | `(status: ImageLoadingStatus) => void`     | —       | Emitted when the loading status changes. Never emitted with `'idle'`.           |

::

| Attribute             | Description                              |
| :-------------------- | :--------------------------------------- |
| `data-starting-style` | Present when the image is animating in.  |
| `data-ending-style`   | Present when the image is animating out. |

### Fallback

Rendered while the image is missing, still loading, or failed. Renders a `<span>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                       | Default  | Description                                                              |
| :-------- | :----------------------------------------- | :------- | :----------------------------------------------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap \| Component` | `'span'` | HTML element to render.                                                  |
| `class`   | `string`                                   | —        | CSS class applied to the element.                                        |
| `style`   | `string`                                   | —        | Inline style applied to the element.                                     |
| `delay`   | `number`                                   | `0`      | How long to wait before showing the fallback. Specified in milliseconds. |
| `default` | `Slot<{ imageLoadingStatus }>`             | —        | Content; receives the image loading status.                              |

::

## Additional types

### ImageLoadingStatus

The status carried by `loadingStatusChange`, and passed to the `default` slot of `Root` and `Fallback` as `imageLoadingStatus`.

```ts
type ImageLoadingStatus = 'idle' | 'loading' | 'loaded' | 'error'
```
