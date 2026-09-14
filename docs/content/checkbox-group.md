# Checkbox Group

Checkboxes sharing one value.

:demo{name="checkbox-group/hero"}

## Anatomy

A Checkbox Group wraps a set of [Checkbox](/vue/checkbox) parts. Import both and nest the checkboxes inside the group:

```vue title="Anatomy"
<script setup>
import { Checkbox } from '@shardsui/vue/checkbox'
import { CheckboxGroup } from '@shardsui/vue/checkbox-group'
</script>

<template>
  <CheckboxGroup>
    <Checkbox.Root />
  </CheckboxGroup>
</template>
```

## Usage guidelines

- **Form controls must have an accessible name**: name them with `<label>` elements, or with the `Field` and `Fieldset` components.

## Examples

### Labeling a checkbox group

Point the group at a sibling label with `aria-labelledby`:

```vue title="Using aria-labelledby to label a checkbox group"
<template>
  <div id="protocols-label">Allowed network protocols</div>
  <CheckboxGroup aria-labelledby="protocols-label">
    <!-- checkboxes -->
  </CheckboxGroup>
</template>
```

For the individual checkboxes, the simplest option is to wrap each one in a `<label>`:

```vue title="Using an enclosing label to label a checkbox"
<template>
  <!-- [!code highlight] -->
  <label>
    <Checkbox.Root value="http" />
    HTTP
    <!-- [!code highlight] -->
  </label>
</template>
```

### Rendering as a native button

`Checkbox.Root` renders a `<span>` by default so it can live inside a `<label>`. When each checkbox has its own label tied to it with `for`/`id`, render it as a native button with `as="button"`:

```vue title="Sibling label pattern with a native button"
<template>
  <div id="protocols-label">Allowed network protocols</div>
  <CheckboxGroup aria-labelledby="protocols-label">
    <div>
      <label for="protocol-http">HTTP</label>
      <Checkbox.Root id="protocol-http" value="http" as="button">
        <Checkbox.Indicator />
      </Checkbox.Root>
    </div>
  </CheckboxGroup>
</template>
```

### Form integration

Combine Field and Fieldset to label the group and hook it into a form:

```vue title="Using Checkbox Group in a form"
<template>
  <!-- [!code highlight] -->
  <Field.Root name="allowedNetworkProtocols">
    <Fieldset.Root>
      <Fieldset.Legend>Allowed network protocols</Fieldset.Legend>
      <CheckboxGroup>
        <label>
          <Checkbox.Root value="http" />
          HTTP
        </label>
        <label>
          <Checkbox.Root value="https" />
          HTTPS
        </label>
        <label>
          <Checkbox.Root value="ssh" />
          SSH
        </label>
      </CheckboxGroup>
    </Fieldset.Root>
  </Field.Root>
</template>
```

## API reference

::table{columns="Prop,Type,Default"}

| Prop               | Type                                                         | Default | Description                                                                                         |
| :----------------- | :----------------------------------------------------------- | :------ | :-------------------------------------------------------------------------------------------------- |
| `as`               | `keyof HTMLElementTagNameMap`                                | `'div'` | HTML element to render.                                                                             |
| `class`            | `string`                                                     | —       | CSS class applied to the element.                                                                   |
| `style`            | `string`                                                     | —       | Inline style applied to the element.                                                                |
| `id`               | `string`                                                     | —       | Custom element ID.                                                                                  |
| `value`            | `string[]`                                                   | `[]`    | The checked values. Pass an initial array for uncontrolled use, or `v-model:value` to control it.   |
| `update:value`     | `(value: string[]) => void`                                  | —       | Emitted when the checked values change.                                                             |
| `disabled`         | `boolean`                                                    | `false` | Whether the component should ignore user interaction.                                               |
| `aria-labelledby`  | `string`                                                     | —       | Accessible name for the group. Replaces the `Field.Label` association when wrapped in `Field.Root`. |
| `aria-describedby` | `string`                                                     | —       | Description IDs; merged with Field message IDs when wrapped in `Field.Root`.                        |
| `default`          | `Slot<{ touched, dirty, filled, focused, valid, disabled }>` | —       | Content; receives the group's `disabled` state and the enclosing field's state.                     |

::

| Attribute       | Description                                                                               |
| :-------------- | :---------------------------------------------------------------------------------------- |
| `data-disabled` | Present when the group is disabled.                                                       |
| `data-valid`    | Present when the field is valid (when wrapped in `Field.Root`).                           |
| `data-invalid`  | Present when the field is invalid (when wrapped in `Field.Root`).                         |
| `data-touched`  | Present when the field has been touched (when wrapped in `Field.Root`).                   |
| `data-dirty`    | Present when the value has changed from its initial value (when wrapped in `Field.Root`). |
| `data-filled`   | Present when at least one checkbox is checked (when wrapped in `Field.Root`).             |
| `data-focused`  | Present when the group is focused (when wrapped in `Field.Root`).                         |
