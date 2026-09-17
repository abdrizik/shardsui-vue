# Switch

An on/off form control.

:demo{name="switch/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { Switch } from '@shardsui/vue/switch'
</script>

<template>
  <Switch.Root>
    <Switch.Thumb />
  </Switch.Root>
</template>
```

## Usage guidelines

- **Form controls must have an accessible name**: provide a wrapping `<label>` (recommended), an `aria-label`, or use the [Field](/field) component. See [Labeling a switch](#examples-labeling-a-switch).

## Examples

### Labeling a switch

The simplest way to name a switch is to wrap it in a `<label>`:

```vue title="Wrapping a label around a switch"
<template>
  <!-- [!code highlight] -->
  <label>
    <Switch.Root>
      <Switch.Thumb />
    </Switch.Root>
    Autoplay
    <!-- [!code highlight] -->
  </label>
</template>
```

`Switch.Root` renders a `<span>` by default so the wrapping `<label>` toggles the hidden `<input type="checkbox">` natively.

### Rendering as a native button

When you point a separate label at the switch with `for`/`id` instead of wrapping it, render it as a native button with `as="button"`:

```vue title="Sibling label pattern with a native button"
<template>
  <div>
    <label for="wifi-switch">Wi-Fi</label>
    <Switch.Root id="wifi-switch" as="button">
      <Switch.Thumb />
    </Switch.Root>
  </div>
</template>
```

### Form integration

[Field](/field) wires the label and form association:

```vue title="Using Switch in a form"
<template>
  <Form>
    <!-- [!code highlight] -->
    <Field.Root name="autoplay">
      <Field.Label>
        <Switch.Root>
          <Switch.Thumb />
        </Switch.Root>
        Autoplay
      </Field.Label>
    </Field.Root>
  </Form>
</template>
```

When wrapped in `Field.Root`, toggling the switch runs the field's validation.

## API reference

### Root

Represents the switch itself.
Renders a `<span>` element and a hidden `<input>` beside.

::table{columns="Prop,Type,Default"}

| Prop               | Type                                                                                      | Default  | Description                                                                                    |
| :----------------- | :---------------------------------------------------------------------------------------- | :------- | :--------------------------------------------------------------------------------------------- |
| `as`               | `'span' \| 'button'`                                                                      | `'span'` | HTML element to render.                                                                        |
| `class`            | `string`                                                                                  | —        | CSS class applied to the element.                                                              |
| `style`            | `string`                                                                                  | —        | Inline style applied to the element.                                                           |
| `id`               | `string`                                                                                  | auto     | Custom element ID. Applied to the hidden input, or to the root when `as="button"`.             |
| `checked`          | `boolean`                                                                                 | `false`  | Checked state. Pass an initial value for uncontrolled use, or `v-model:checked` to control it. |
| `disabled`         | `boolean`                                                                                 | `false`  | Disables interaction. Cascades from `Field.Root` if wrapped.                                   |
| `readOnly`         | `boolean`                                                                                 | `false`  | User can't toggle.                                                                             |
| `required`         | `boolean`                                                                                 | `false`  | Marks the underlying input required for form submission.                                       |
| `name`             | `string`                                                                                  | —        | Form-submission key. Field's `name` overrides this if wrapped.                                 |
| `value`            | `string`                                                                                  | —        | Submitted value when on. Unset submits `"on"`, matching a native checkbox.                     |
| `form`             | `string`                                                                                  | —        | Form id when the switch is rendered outside its form.                                          |
| `aria-labelledby`  | `string`                                                                                  | —        | Accessible name for the switch.                                                                |
| `aria-describedby` | `string`                                                                                  | —        | Additional description IDs; merged with Field message IDs when wrapped in `Field.Root`.        |
| `update:checked`   | `(checked: boolean) => void`                                                              | —        | Emitted whenever the switch toggles.                                                           |
| `default`          | `Slot<{ checked, disabled, readOnly, required, touched, dirty, filled, focused, valid }>` | —        | Switch content; receives the switch state.                                                     |

::

| Attribute        | Description                                                             |
| :--------------- | :---------------------------------------------------------------------- |
| `data-checked`   | Present when the switch is on.                                          |
| `data-unchecked` | Present when the switch is off.                                         |
| `data-disabled`  | Present when disabled.                                                  |
| `data-readonly`  | Present when read-only.                                                 |
| `data-required`  | Present when required.                                                  |
| `data-valid`     | Present when the field is valid (when wrapped in `Field.Root`).         |
| `data-invalid`   | Present when the field is invalid (when wrapped in `Field.Root`).       |
| `data-touched`   | Present when the field has been touched (when wrapped in `Field.Root`). |
| `data-dirty`     | Present when the value has changed (when wrapped in `Field.Root`).      |
| `data-filled`    | Present when checked (when wrapped in `Field.Root`).                    |
| `data-focused`   | Present when focused (when wrapped in `Field.Root`).                    |

### Thumb

The movable part that indicates whether the switch is on or off.
Renders a `<span>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                                                                      | Default  | Description                               |
| :-------- | :---------------------------------------------------------------------------------------- | :------- | :---------------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap \| Component`                                                | `'span'` | HTML element to render.                   |
| `class`   | `string`                                                                                  | —        | CSS class applied to the element.         |
| `style`   | `string`                                                                                  | —        | Inline style applied to the element.      |
| `default` | `Slot<{ checked, disabled, readOnly, required, touched, dirty, filled, focused, valid }>` | —        | Thumb content; receives the switch state. |

::

| Attribute        | Description                                                             |
| :--------------- | :---------------------------------------------------------------------- |
| `data-checked`   | Present when the switch is on.                                          |
| `data-unchecked` | Present when the switch is off.                                         |
| `data-disabled`  | Present when disabled.                                                  |
| `data-readonly`  | Present when read-only.                                                 |
| `data-required`  | Present when required.                                                  |
| `data-valid`     | Present when the field is valid (when wrapped in `Field.Root`).         |
| `data-invalid`   | Present when the field is invalid (when wrapped in `Field.Root`).       |
| `data-touched`   | Present when the field has been touched (when wrapped in `Field.Root`). |
| `data-dirty`     | Present when the value has changed (when wrapped in `Field.Root`).      |
| `data-filled`    | Present when checked (when wrapped in `Field.Root`).                    |
| `data-focused`   | Present when focused (when wrapped in `Field.Root`).                    |
