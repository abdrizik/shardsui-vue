# Direction Provider

Sets LTR or RTL direction.

:demo{name="direction-provider/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { DirectionProvider } from '@shardsui/vue/direction-provider'
</script>

<template>
  <DirectionProvider>
    <!-- Your app or a group of components -->
  </DirectionProvider>
</template>
```

With `direction="rtl"`, the ShardsUI components inside lay out and navigate for right-to-left reading. The provider changes component behavior only — it never touches the DOM's own direction, so flip the text yourself with `dir="rtl"` on an element or `direction: rtl` in CSS.

## API reference

### DirectionProvider

Doesn't render its own HTML element.

::table{columns="Prop,Type,Default"}

| Prop        | Type            | Default | Description                        |
| :---------- | :-------------- | :------ | :--------------------------------- |
| `direction` | `TextDirection` | `'ltr'` | The reading direction of the text. |
| `default`   | `Slot`          | —       | Content.                           |

::

### getDirection

Read the current text direction. Useful for portaled content, which renders outside your app root and so escapes a surrounding `dir` attribute.

```vue title="Portaled popup direction"
<script setup>
import { getDirection } from '@shardsui/vue/direction-provider'

const direction = getDirection()
</script>

<template>
  <Popover.Portal>
    <Popover.Positioner>
      <Popover.Popup :dir="direction">...</Popover.Popup>
    </Popover.Positioner>
  </Popover.Portal>
</template>
```

Call it in `<script setup>`: it returns a readonly ref that stays live, so read `direction.value` in script and `direction` in the template. Reading `.value` once during setup keeps whatever direction was active at initialization.

**Return value**

```ts
type ReturnValue = Readonly<Ref<TextDirection>>
```

## Additional types

### TextDirection

```ts
type TextDirection = 'ltr' | 'rtl'
```
