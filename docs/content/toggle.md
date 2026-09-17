# Toggle

A pressable on/off button.

:demo{name="toggle/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { Toggle } from '@shardsui/vue/toggle'
</script>

<template>
  <Toggle />
</template>
```

To let several toggles share a selection, wrap them in a [Toggle Group](/toggle-group).

## API reference

::table{columns="Prop,Type,Default"}

| Prop             | Type                                       | Default    | Description                                                                                                                                            |
| :--------------- | :----------------------------------------- | :--------- | :----------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`             | `keyof HTMLElementTagNameMap \| Component` | `'button'` | Element to render. `"button"` uses native button semantics; other tags get `role="button"` and keyboard handlers.                                      |
| `class`          | `string`                                   | —          | CSS class applied to the element.                                                                                                                      |
| `style`          | `string`                                   | —          | Inline style applied to the element.                                                                                                                   |
| `pressed`        | `boolean`                                  | `false`    | Pressed state. Pass an initial value for uncontrolled use, or `v-model:pressed` to control it. A wrapping `ToggleGroup` owns the state and ignores it. |
| `disabled`       | `boolean`                                  | `false`    | Disables interaction. Cascades from a wrapping `ToggleGroup`.                                                                                          |
| `value`          | `string`                                   | auto       | The string this toggle contributes to a `ToggleGroup`'s `value`. Defaults to a generated id, so set it explicitly inside a group.                      |
| `update:pressed` | `(pressed: boolean) => void`               | —          | Emitted when the pressed state changes.                                                                                                                |
| `default`        | `Slot<{ pressed, disabled }>`              | —          | Toggle content; receives the toggle state.                                                                                                             |

::

| Attribute       | Description                          |
| :-------------- | :----------------------------------- |
| `data-pressed`  | Present when the toggle is pressed.  |
| `data-disabled` | Present when the toggle is disabled. |
