# Separator

A semantic dividing line.

:demo{name="separator/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { Separator } from '@shardsui/vue/separator'
</script>

<template>
  <Separator />
</template>
```

## API reference

::table{columns="Prop,Type,Default"}

| Prop          | Type                          | Default        | Description                          |
| :------------ | :---------------------------- | :------------- | :----------------------------------- |
| `as`          | `keyof HTMLElementTagNameMap` | `'div'`        | HTML element to render.              |
| `class`       | `string`                      | —              | CSS class applied to the element.    |
| `style`       | `string`                      | —              | Inline style applied to the element. |
| `orientation` | `'horizontal' \| 'vertical'`  | `'horizontal'` | The orientation of the separator.    |

::

| Attribute          | Description                                 |
| :----------------- | :------------------------------------------ |
| `data-orientation` | Indicates the orientation of the separator. |
