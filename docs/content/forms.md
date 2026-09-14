# Forms

Validation, Field, and submission.

Form, Field, and Fieldset build on the browser's [constraint validation API](https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#the-constraint-validation-api), so `required`, `pattern`, and other native rules work without extra wiring. `<Form>` renders a real `<form>` with `novalidate`: it validates itself and shows messages through `<Field.Error>` instead of the browser bubble, so the copy is yours to style and translate. Field state — `value`, `invalid`, `dirty`, `touched` — is controllable, so a field can sit under a schema validator or an external form library.

:demo{name="form/hero"}

## The shape of a field

A field is a control plus everything that describes it. `<Field.Root>` groups them and threads the accessible wiring — `for`/`id`, `aria-describedby`, `aria-invalid` — between the parts so you never hand-match an `id`.

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
      <Field.Description />
      <Field.Error />
    </Field.Root>
  </Form>
</template>
```

The `name` on `<Field.Root>` identifies the value on submit. It takes precedence over a `name` on the control itself, so put it on the root and let it cascade. That same `name` is the key the `errors` prop and schema validators match against later.

As the field moves through its lifecycle it reflects state onto every part as `data-*` attributes: `data-invalid`, `data-valid`, `data-touched`, `data-dirty`, `data-filled`, `data-focused`, `data-disabled`. Style against those instead of tracking validity in your own refs:

```vue title="Styling from field state"
<template>
  <Field.Control class="border-gray-200 data-focused:outline-2 data-invalid:border-red-600" />
</template>
```

## Giving every control a name

A control with no accessible name is invisible to a screen reader. How you supply it depends on the control.

**Plain inputs** — `Input`, `Autocomplete`, the input half of `Combobox`, and the checkable controls `Checkbox` / `Radio` / `Switch` — take `<Field.Label>`. The control can sit _inside_ its label:

```vue title="Implicitly labeling a switch"
<script setup>
import { Field } from '@shardsui/vue/field'
import { Switch } from '@shardsui/vue/switch'
</script>

<template>
  <Field.Root>
    <Field.Label>
      <Switch.Root />
      Developer mode
    </Field.Label>
    <Field.Description>Enables extra tools for web developers.</Field.Description>
  </Field.Root>
</template>
```

**Trigger-based controls** carry their own label part, because the thing you click isn't a native `<input>`:

- `Select` → `<Select.Label>`
- `Combobox` with the input inside the popup → `<Combobox.Label>`
- `Slider` → `<Slider.Label>`; on a multi-thumb slider, add an `aria-label` to each `<Slider.Thumb>` so the thumbs are told apart.

`for` only points at native form controls, so when the field's control is a `<button>`, set `as="span"` on `<Field.Label>`: it drops the `for` and forwards a click to the registered control instead.

**No visible label at all?** Put `aria-label` directly on the control.

`<Field.Description>` is registered as the control's accessible description automatically:

```vue title="Labeling a select and a slider"
<script setup>
import { Form } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'
import { Select } from '@shardsui/vue/select'
import { Slider } from '@shardsui/vue/slider'
</script>

<template>
  <Form>
    <Field.Root>
      <Select.Root>
        <Select.Label>Time zone</Select.Label>
        <Select.Trigger />
      </Select.Root>
      <Field.Description>Used for notifications and reminders.</Field.Description>
    </Field.Root>

    <Field.Root>
      <Slider.Root :value="50">
        <Slider.Label>Zoom level</Slider.Label>
        <Field.Description>Adjust the size of the interface.</Field.Description>
        <Slider.Control>
          <Slider.Track>
            <Slider.Thumb />
          </Slider.Track>
        </Slider.Control>
      </Slider.Root>
    </Field.Root>
  </Form>
</template>
```

## Grouping controls under one legend

When a single label covers several controls — a price range with two thumbs, a set of radio options — reach for [Fieldset](/vue/fieldset). `<Fieldset.Root>` renders a `<fieldset>`, and `<Fieldset.Legend>` names it with no `aria-labelledby` to wire up. A `RadioGroup` nested inside adopts that legend as its own accessible name; other composites keep their own label part, so a multi-thumb slider still needs an `aria-label` per `<Slider.Thumb>`:

```vue title="A range slider and a radio group, each under a legend"
<script setup>
import { Form } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'
import { Fieldset } from '@shardsui/vue/fieldset'
import { Radio } from '@shardsui/vue/radio'
import { RadioGroup } from '@shardsui/vue/radio-group'
import { Slider } from '@shardsui/vue/slider'
</script>

<template>
  <Form>
    <Field.Root>
      <!-- [!code highlight] -->
      <Fieldset.Root>
        <Fieldset.Legend>Price range</Fieldset.Legend>
        <Slider.Root :value="[25, 75]">
          <Slider.Control>
            <Slider.Track>
              <Slider.Indicator />
              <Slider.Thumb :index="0" aria-label="Minimum price" />
              <Slider.Thumb :index="1" aria-label="Maximum price" />
            </Slider.Track>
          </Slider.Control>
        </Slider.Root>
        <!-- [!code highlight] -->
      </Fieldset.Root>
    </Field.Root>

    <Field.Root>
      <!-- [!code highlight] -->
      <Fieldset.Root>
        <Fieldset.Legend>Storage type</Fieldset.Legend>
        <RadioGroup>
          <Radio.Root value="ssd" />
          <Radio.Root value="hdd" />
        </RadioGroup>
        <!-- [!code highlight] -->
      </Fieldset.Root>
    </Field.Root>
  </Form>
</template>
```

When each option in a checkbox or radio group needs its _own_ label and description, wrap it in `<Field.Item>`:

```vue title="Labeling each checkbox in a group"
<script setup>
import { Field } from '@shardsui/vue/field'
import { Fieldset } from '@shardsui/vue/fieldset'
import { Checkbox } from '@shardsui/vue/checkbox'
import { CheckboxGroup } from '@shardsui/vue/checkbox-group'
</script>

<template>
  <Field.Root>
    <Fieldset.Root>
      <Fieldset.Legend>Backup schedule</Fieldset.Legend>
      <CheckboxGroup>
        <!-- [!code highlight] -->
        <Field.Item>
          <Checkbox.Root value="daily" />
          <Field.Label>Daily</Field.Label>
          <Field.Description>Every day at 00:00.</Field.Description>
          <!-- [!code highlight] -->
        </Field.Item>
        <!-- [!code highlight] -->
        <Field.Item>
          <Checkbox.Root value="monthly" />
          <Field.Label>Monthly</Field.Label>
          <Field.Description>On the 5th at 23:59.</Field.Description>
          <!-- [!code highlight] -->
        </Field.Item>
      </CheckboxGroup>
    </Fieldset.Root>
  </Field.Root>
</template>
```

Non-native controls (Select, Slider, a checkbox or radio group) submit through a hidden input whose `name` comes from the surrounding `<Field.Root>`.

## Native constraint validation

`<Field.Control>` forwards standard HTML validation attributes, and the field reads their result straight from the constraint validation API:

- `required`: the field must have a value.
- `minlength` / `maxlength`: bounds on text length.
- `pattern`: a regular expression the value must match.
- `step`: a numeric increment the value must be a multiple of.

```vue title="Constraints on a URL field"
<script setup>
import { Field } from '@shardsui/vue/field'
</script>

<template>
  <Field.Root name="website">
    <Field.Control type="url" required pattern="https?://.*" />
    <Field.Error />
  </Field.Root>
</template>
```

An empty `<Field.Error>` renders the browser's own message for whichever constraint failed.

## Custom validation

Hand `<Field.Root>` a `validate` function for logic the native attributes can't express. It receives the field's value and the full form values, and returns an error string, an array of strings, or `null` when valid. It's allowed to be async, but an async result never holds up a submission: the form submits before a pending `validate` resolves. Checks that must gate the submit belong on the server, fed back through [`errors`](#server-returned-errors).

`validationMode` decides _when_ it fires:

- `onSubmit` (default): validate every field when the `<Form>` submits; after that first attempt, each field revalidates as its value changes.
- `onBlur`: validate when focus leaves the field.
- `onChange`: validate on every value change, e.g. each keystroke.

For `onChange` against a network call, `validationDebounceTime` (milliseconds) debounces the callback.

```vue title="Async username check, debounced per keystroke"
<script setup>
import { Field } from '@shardsui/vue/field'

async function validateUsername(value) {
  if (value === 'admin') {
    return 'Reserved for system use.'
  }

  const result = await fetch(`https://api.example.com/usernames/${value}`)
  if (!result.ok) {
    return `${value} is unavailable.`
  }

  return null
}
</script>

<template>
  <Field.Root
    name="username"
    validation-mode="onChange"
    :validation-debounce-time="300"
    :validate="validateUsername"
  >
    <Field.Control required minlength="3" />
    <Field.Error />
  </Field.Root>
</template>
```

`validationMode` set on a field wins over the one on `<Form>`.

## Showing the error

`<Field.Error>` with no content shows the field's current message whenever it's invalid, or a `<ul>` of them when more than one applies. Give it a `match` prop to take control:

- a `ValidityState` key like `"valueMissing"` or `"patternMismatch"` renders only when that specific flag is set, giving you the hook for per-reason, translatable copy;
- `:match="true"` always renders; `:match="false"` (or omitted) renders whenever the field is invalid or carries a form error.

```vue title="Custom copy per validity reason"
<template>
  <Field.Root name="username">
    <Field.Control required minlength="3" />
    <Field.Error match="valueMissing">You must choose a username.</Field.Error>
    <Field.Error match="tooShort">At least 3 characters.</Field.Error>
  </Field.Root>
</template>
```

`<Field.Error>` participates in enter/exit animation. It exposes `data-starting-style` and `data-ending-style`.

For anything the `match` cases can't cover, `<Field.Validity>` hands you the raw validity state in a scoped slot:

```vue title="Rendering from raw validity state"
<template>
  <Field.Validity v-slot="{ errors }">
    <ul v-if="errors.length">
      <li v-for="message in errors" :key="message">{{ message }}</li>
    </ul>
  </Field.Validity>
</template>
```

The slot also receives `validity` (the `ValidityState` flags), `error` (the first message), `value`, `initialValue`, and `transitionStatus`.

## Submitting

Two listeners, depending on the shape you want the values in.

Reach for the native `submit` event when you want the raw `FormData`. It runs only after validation passes, and you own the `preventDefault()`:

```vue title="Native submission"
<script setup>
import { Form } from '@shardsui/vue/form'

async function onSubmit(event) {
  event.preventDefault()
  const formData = new FormData(event.currentTarget)
  await fetch('https://api.example.com', { method: 'POST', body: formData })
}
</script>

<template>
  <Form @submit="onSubmit" />
</template>
```

Reach for the `formSubmit` event — bound as `@form-submit` — when you'd rather reshape the values as a plain object before sending. It calls `preventDefault()` on the native submit event for you:

```vue title="Submission as a JavaScript object"
<script setup>
import { Form } from '@shardsui/vue/form'

async function onFormSubmit(values) {
  const payload = {
    product_id: values.id,
    order_quantity: values.quantity
  }
  await fetch('https://api.example.com', {
    method: 'POST',
    body: JSON.stringify(payload)
  })
}
</script>

<template>
  <Form @form-submit="onFormSubmit" />
</template>
```

## Server-returned errors

Validation that can only happen on the server — a promo code that's expired, a username already taken — comes back as an `errors` prop. Shape it as an object keyed by field `name`, each value one message or an array of them. The library merges those into the matching fields' state and focuses the first invalid one. As soon as a field's value changes, its server error drops out on its own.

```vue title="Merging server errors back into fields"
<script setup>
import { shallowRef } from 'vue'
import { Form } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'

async function submitToServer(payload) {
  return { errors: { promoCode: 'This promo code has expired.' } }
}

// [!code word:errors]
const errors = shallowRef({})

async function onSubmit(event) {
  event.preventDefault()
  const response = await submitToServer(/* … */)
  // [!code word:errors]
  errors.value = response.errors
}
</script>

<template>
  <!-- [!code word:errors] -->
  <Form :errors="errors" @submit="onSubmit">
    <Field.Root name="promoCode">
      <Field.Control />
      <Field.Error />
    </Field.Root>
  </Form>
</template>
```

### With a Nuxt server route

Put the check in a [server route](https://nuxt.com/docs/guide/directory-structure/server), return failures keyed by field name, and let the page feed them back through `errors`. Because `<Form>` renders a genuine `<form>`, `method` and `action` pass straight through and the form works with JavaScript off; with it on, post the `FormData` from the `submit` listener instead.

```ts title="server/api/login.post.ts"
function authenticateUser(data: FormData): { success: boolean } {
  // your auth logic
}

export default defineEventHandler(async (event) => {
  const data = await readFormData(event)
  const result = authenticateUser(data)

  if (!result.success) {
    // [!code word:errors]
    return { errors: { password: 'Invalid username or password.' } }
  }
  return { errors: {} }
})
```

```vue title="pages/login.vue"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Form, type FormErrors } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'

const errors = shallowRef<FormErrors>({})

async function onSubmit(event: SubmitEvent) {
  event.preventDefault()
  const body = new FormData(event.currentTarget as HTMLFormElement)
  const response = await $fetch('/api/login', { method: 'POST', body })
  errors.value = response.errors
}
</script>

<template>
  <!-- [!code word:errors] -->
  <Form method="POST" action="/api/login" :errors="errors" @submit="onSubmit">
    <Field.Root name="password">
      <Field.Control type="password" />
      <Field.Error />
    </Field.Root>
  </Form>
</template>
```

The demo below simulates the server error shape on the client.

:demo{name="form/form-action"}

## Schema validation with Zod

Keep validation rules in one schema object. Parse the submitted values with `safeParse`, then map the schema's per-field errors onto `errors`. `z.flattenError(result.error).fieldErrors` is already keyed by field `name`, so it drops in with no remapping:

```vue title="Validating the submitted object with a schema"
<script setup>
import { shallowRef } from 'vue'
import { z } from 'zod'
import { Form } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  age: z.coerce.number('Age must be a number').positive('Age must be positive')
})

async function submitForm(values) {
  const result = schema.safeParse(values)
  if (!result.success) {
    // [!code word:fieldErrors]
    return { errors: z.flattenError(result.error).fieldErrors }
  }
  return { errors: {} }
}

const errors = shallowRef({})

async function onFormSubmit(values) {
  const response = await submitForm(values)
  errors.value = response.errors
}
</script>

<template>
  <!-- [!code word:errors] -->
  <Form :errors="errors" @form-submit="onFormSubmit">
    <!-- fields keyed by name -->
  </Form>
</template>
```

:demo{name="form/zod"}

## Driving a field from an external library

When something else owns form state — a dedicated form library, or your own store — a field becomes fully controlled. `<Field.Root>` accepts `invalid`, `dirty`, and `touched`; `<Field.Control>` accepts `v-model:value` and the native listeners the library needs to keep those in sync; and `<Field.Error :match="...">` lets it decide when the message shows:

```vue title="A field wired to external state"
<script setup lang="ts">
import { Field } from '@shardsui/vue/field'

// supplied by your form library
const { name, value, invalid, dirty, touched, error, onValueChange, onBlur } = defineProps<{
  name: string
  value: string
  invalid: boolean
  dirty: boolean
  touched: boolean
  error?: string
  onValueChange: (value: string) => void
  onBlur: (event: FocusEvent) => void
}>()
</script>

<template>
  <!-- [!code highlight] -->
  <Field.Root :name="name" :invalid="invalid" :dirty="dirty" :touched="touched">
    <Field.Label>Username</Field.Label>
    <Field.Description>
      May appear where you contribute or are mentioned. Remove it any time.
    </Field.Description>
    <!-- [!code highlight] -->
    <Field.Control
      placeholder="e.g. alice132"
      :value="value"
      @update:value="onValueChange"
      @blur="onBlur"
    />
    <!-- [!code highlight] -->
    <Field.Error :match="!!error">{{ error }}</Field.Error>
  </Field.Root>
</template>
```

When the library orchestrates validation and submission, `<Form>` is optional. A plain `<form>` works. To trigger validation yourself, a template ref on `<Form>` exposes a `validate()` that validates every field, or one of them when passed a field `name`.
