# Fieldset

Related fields under one legend.

:demo{name="fieldset/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { Fieldset } from '@shardsui/vue/fieldset'
</script>

<template>
  <Fieldset.Root>
    <Fieldset.Legend />
  </Fieldset.Root>
</template>
```

## API reference

### Root

Groups a shared legend with related controls.
Renders a `<fieldset>` element.

::table{columns="Prop,Type,Default"}

| Prop       | Type                          | Default      | Description                                                            |
| :--------- | :---------------------------- | :----------- | :--------------------------------------------------------------------- |
| `as`       | `keyof HTMLElementTagNameMap` | `'fieldset'` | HTML element to render.                                                |
| `class`    | `string`                      | —            | CSS class applied to the element.                                      |
| `style`    | `string`                      | —            | Inline style applied to the element.                                   |
| `disabled` | `boolean`                     | `false`      | Disables the fieldset, every field inside it, and any nested fieldset. |
| `default`  | `Slot<{ disabled }>`          | —            | Content; receives the fieldset's `disabled` state.                     |

::

| Attribute       | Description                            |
| :-------------- | :------------------------------------- |
| `data-disabled` | Present when the fieldset is disabled. |

### Legend

An accessible label, automatically associated with the fieldset.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                          | Default | Description                                                   |
| :-------- | :---------------------------- | :------ | :------------------------------------------------------------ |
| `as`      | `keyof HTMLElementTagNameMap` | `'div'` | HTML element to render.                                       |
| `class`   | `string`                      | —       | CSS class applied to the element.                             |
| `style`   | `string`                      | —       | Inline style applied to the element.                          |
| `id`      | `string`                      | auto    | Custom element ID. Used for the fieldset's `aria-labelledby`. |
| `default` | `Slot<{ disabled }>`          | —       | Content; receives the fieldset's `disabled` state.            |

::

| Attribute       | Description                                      |
| :-------------- | :----------------------------------------------- |
| `data-disabled` | Present when the enclosing fieldset is disabled. |
