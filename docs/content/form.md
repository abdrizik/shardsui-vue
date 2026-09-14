# Form

A validated form.

:demo{name="form/hero"}

## Anatomy

Pair Form with [Field](/vue/field):

```vue title="Anatomy"
<script setup>
import { Form } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'
</script>

<template>
  <Form>
    <Field.Root>
      <Field.Label />
      <Field.Control />
      <Field.Error />
    </Field.Root>
  </Form>
</template>
```

## Examples

### Validating from code

A template ref on the component exposes `validate()` — call it with a field `name` to run just that
one.

```vue title="Triggering validation without submitting"
<script setup>
import { useTemplateRef } from 'vue'
import { Form } from '@shardsui/vue/form'

const form = useTemplateRef('form')
</script>

<template>
  <Form ref="form">
    <!-- fields -->
    <button type="button" @click="form?.validate('email')">Check email</button>
  </Form>
</template>
```

## API reference

Renders a `<form>` element. Submitting validates every field first; if one fails, the native submit
is cancelled and focus moves to the first invalid control, selecting its text when it is an
`<input>`.

::table{columns="Prop,Type,Default"}

| Prop             | Type                                   | Default      | Description                                                                                                                                  |
| :--------------- | :------------------------------------- | :----------- | :------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`             | `keyof HTMLElementTagNameMap`          | `'form'`     | HTML element to render.                                                                                                                      |
| `class`          | `string`                               | —            | CSS class applied to the element.                                                                                                            |
| `style`          | `string`                               | —            | Inline style applied to the element.                                                                                                         |
| `novalidate`     | `boolean`                              | `true`       | Disables native browser validation. Set `false` to re-enable it.                                                                             |
| `validationMode` | `'onSubmit' \| 'onBlur' \| 'onChange'` | `'onSubmit'` | When fields are validated. `validationMode` on `Field.Root` overrides it.                                                                    |
| `errors`         | `Record<string, string \| string[]>`   | —            | Errors supplied from outside, typically by a server or a form action. Keyed by field `name`; an error clears when its field's value changes. |
| `onSubmit`       | `(event: SubmitEvent) => void`         | —            | Native submit handler. Runs only after validation passes.                                                                                    |
| `formSubmit`     | `(values: FormValues) => void`         | —            | Emitted with every registered field's value as a plain object. Calls `preventDefault()` on the native submit event.                          |
| `default`        | `Slot`                                 | —            | Content.                                                                                                                                     |

::

`errors` is a one-way prop: the form copies it into its own state, and there is no `update:errors`
emit to bind to.

A template ref on the component exposes:

| Method                         | Description                                                                                            |
| :----------------------------- | :----------------------------------------------------------------------------------------------------- |
| `validate(fieldName?: string)` | Runs validation. With `fieldName`, only the field registered under that name. Without it, every field. |

`Form` is generic over `FormValues extends Record<string, unknown>`, which defaults to
`Record<string, unknown>`. Annotate the parameter of the `formSubmit` handler to type the object
it receives.

Other standard `<form>` attributes (`method`, `action`, `target`, `enctype`) pass through.
