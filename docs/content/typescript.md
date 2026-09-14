# TypeScript

Inferring props, refs, and value types.

ShardsUI is written in TypeScript, so types flow through `v-model`, event payloads, and scoped slots with no annotations. The cases below are the ones where you do name a type.

## Inferring a component's props

Each part declares its props inline, so there's no props interface to import. When you build a wrapper that should accept exactly what the underlying part accepts, index the part's instance type for its `$props`:

```vue title="Wrapping a part"
<script setup lang="ts">
import { Tooltip } from '@shardsui/vue/tooltip'

const props = defineProps<InstanceType<typeof Tooltip.Root>['$props']>()
</script>

<template>
  <Tooltip.Root v-bind="props" />
</template>
```

`InstanceType<typeof X>['$props']` resolves to the full prop surface of `X`: `as`, the model props, and every part-specific prop. `class` and `style` aren't props — they fall through as attributes and need no declaration. Index into it to reuse or narrow one of them:

```ts title="Reusing one prop's type"
import { Tooltip } from '@shardsui/vue/tooltip'

type TooltipDelay = InstanceType<typeof Tooltip.Trigger>['$props']['delay']
```

## Typing controlled state

A stateful prop does double duty: pass a value without `v-model` and the part owns the state; add `v-model` and you own it:

```vue title="Controlled value"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Switch } from '@shardsui/vue/switch'

const checked = shallowRef(false)
</script>

<template>
  <Switch.Root v-model:checked="checked" />
</template>
```

The ref's inferred type is usually enough. `shallowRef(false)` is already `Ref<boolean>`. Annotate it when the value is a union, so an invalid value is caught at the binding site instead of at runtime:

```vue title="Controlled select value"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Select } from '@shardsui/vue/select'

const value = shallowRef<'sans' | 'serif' | 'mono'>('sans')
</script>

<template>
  <Select.Root v-model:value="value">
    <!-- … -->
  </Select.Root>
</template>
```

## Value types for generic parts

`Select.Root` and `Combobox.Root` are generic over the item they hold and over whether selection is single or multiple, but `items` never infers it: Combobox types it `readonly NoInfer<Value>[]` and Select's entries are `unknown`. Annotate the bound `value` instead. The item type flows from there into `update:value`, `itemToStringLabel`, the item slots, and Combobox's `itemHighlighted` event, with no casts. Without an annotated `value`, the type has to come from a typed wrapper (see below).

In single mode (the default) the value is the item, or `null` when nothing is chosen:

```vue title="Single-select value"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@shardsui/vue/combobox'

type Fruit = {
  id: string
  label: string
}

const fruits: Fruit[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'cherry', label: 'Cherry' }
]

const value = shallowRef<Fruit | null>(null)
</script>

<template>
  <Combobox.Root :items="fruits" v-model:value="value">
    <!-- … -->
  </Combobox.Root>
</template>
```

Add `multiple` and the value type flips to an array of items:

```vue title="Multi-select value"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@shardsui/vue/combobox'

type Fruit = {
  id: string
  label: string
}

const fruits: Fruit[] = [
  { id: 'apple', label: 'Apple' },
  { id: 'cherry', label: 'Cherry' }
]

const value = shallowRef<Fruit[] | null>([])
</script>

<template>
  <Combobox.Root :items="fruits" multiple v-model:value="value">
    <!-- … -->
  </Combobox.Root>
</template>
```

`Autocomplete.Root` is generic over its item too, but only for `items`, `filter` and the item slots. Its `value` is the input's text, so it is always a `string`.

To wrap a generic part, forward its type parameter with `<script setup generic="…">` so the item type keeps flowing from your call site through the wrapper into the part:

```vue title="Wrapping a generic part"
<script setup lang="ts" generic="Item">
import { Combobox } from '@shardsui/vue/combobox'

const props = defineProps<InstanceType<typeof Combobox.Root<Item>>['$props']>()
</script>

<template>
  <Combobox.Root v-bind="props" />
</template>
```

`Form` is generic over the values object it collects, defaulting to `Record<string, unknown>` keyed by each field's `name`. It can't infer what your fields hold, so annotate the `formSubmit` handler's parameter and the type flows back into the component — or skip the annotation and parse the values instead (see the [Zod example](/vue/forms#schema-validation-with-zod), where the schema is what produces the typed object):

```vue title="Typing the submitted values"
<script setup lang="ts">
import { Form } from '@shardsui/vue/form'
import { Field } from '@shardsui/vue/field'

type SignUpValues = {
  email: string
  password: string
}

function onFormSubmit({ email, password }: SignUpValues) {
  console.log(email, password)
}
</script>

<template>
  <Form @form-submit="onFormSubmit">
    <Field.Root name="email">
      <Field.Control type="email" />
    </Field.Root>
    <Field.Root name="password">
      <Field.Control type="password" />
    </Field.Root>
  </Form>
</template>
```

The `errors` prop is typed as `FormErrors` — `Record<string, string | string[]>`, keyed by the same field `name` — exported from `@shardsui/vue/form` alongside `FormValidationMode`:

```vue title="Holding server errors"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Form } from '@shardsui/vue/form'
import type { FormErrors } from '@shardsui/vue/form'

const errors = shallowRef<FormErrors>({})
</script>

<template>
  <Form :errors="errors">
    <!-- … -->
  </Form>
</template>
```

## Change events and listeners

A change event carries one argument, the new value. Let it infer from the emit, or annotate it when the handler lives away from the markup:

```ts title="Change handlers"
function onCheckedChange(checked: boolean) {
  console.log(checked)
}

function onValueChange(value: string) {
  console.log(value)
}
```

The component reports the new value; with `v-model` it is committed for you, so there is nothing to cancel in the listener. To veto a change, bind the prop and the event separately and decline to write the ref (see [State](/vue/state#vetoing-a-change)).

Native DOM events reach you through ordinary listeners and keep their standard DOM types:

```ts title="Native event handler"
function onSubmit(event: SubmitEvent) {
  event.preventDefault()
}
```

## Imperative handles

When a trigger and its content can't sit together in the markup, detach them with a handle. `Dialog.createHandle()` constructs one; the type argument makes the handle's own methods generic over the payload you carry:

```vue title="Typed dialog handle"
<script setup lang="ts">
import { Dialog } from '@shardsui/vue/dialog'

const dialog = Dialog.createHandle<{ text: string }>()
</script>

<template>
  <Dialog.Trigger :handle="dialog" :payload="{ text: 'From the toolbar' }">Open</Dialog.Trigger>

  <Dialog.Root v-slot="{ payload }" :handle="dialog">
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Description v-if="payload">Opened by {{ payload.text }}</Dialog.Description>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

The handle drives the dialog from your own code — `dialog.open(triggerId)`, `dialog.close()`, `dialog.openWithPayload(payload)`, and the readonly `dialog.isOpen` — with `openWithPayload` typed against the `{ text: string }` you declared. `open` takes the `id` of a registered detached trigger, or `null` to open with no trigger at all; `Dialog`, `AlertDialog` and `Drawer` accept `null` and carry `openWithPayload`, while the `Popover`, `Menu`, `Tooltip` and `PreviewCard` handles require an id.

The same type argument flows through `<Dialog.Trigger>`'s `payload` prop and into the default slot, where `payload` arrives as `{ text: string } | undefined`. Guard the `undefined`, which means no trigger has opened the dialog yet. To pass a handle across module boundaries, annotate it with the `Dialog.Handle` type:

```ts title="Annotating a handle"
import { Dialog } from '@shardsui/vue/dialog'

let dialog: Dialog.Handle<{ text: string }>
```

## Template refs and `$el`

A template `ref` on a part resolves to the part's component instance, and `$el` on it is the element the part rendered, typed `HTMLElement`: `as` makes the tag a runtime value, so the type can't narrow to a concrete element. Narrow with an `instanceof` check where you need a tag-specific API. The ref is `null` until the element mounts, so a prop that wants a non-null element, like `initialFocus`, takes a getter instead:

```vue title="Typing a part ref"
<script setup lang="ts">
import { useTemplateRef } from 'vue'
import { Dialog } from '@shardsui/vue/dialog'

const popup = useTemplateRef('popup')
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup ref="popup" :initial-focus="() => popup?.$el">
        <!-- … -->
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

`useTemplateRef` follows the same rule: typed to the component on a component instance, to the element on a plain element:

```vue title="Typing a ref on an element"
<script setup lang="ts">
import { useTemplateRef } from 'vue'

const button = useTemplateRef<HTMLButtonElement>('button')
</script>

<template>
  <button ref="button">Click</button>
</template>
```

## Slots

When a part hands its default slot its state, destructure it. The payload type comes from the part:

```vue title="Slot payload"
<script setup lang="ts">
import { Switch } from '@shardsui/vue/switch'
</script>

<template>
  <Switch.Root>
    <Switch.Thumb v-slot="{ checked }">
      {{ checked ? 'On' : 'Off' }}
    </Switch.Thumb>
  </Switch.Root>
</template>
```

To accept a slot in your own component, declare it with `defineSlots` and type the props object your slot receives:

```vue title="Accepting a typed slot"
<script setup lang="ts">
defineSlots<{ default(props: { count: number }): any }>()
</script>

<template>
  <slot :count="1" />
</template>
```

A slot that takes nothing is `default(): any`; one that receives a payload object is `default(props: { payload: SomeType }): any`.

## Other exported types

The toast object your toast content receives carries its `id`, `title`, `description`, `priority`, transition status and your own `data`; it is `ToastObject<Data>`, exported from `@shardsui/vue/toast` along with `ToastManagerAddOptions`, `ToastManagerUpdateOptions` and `ToastManagerPromiseOptions` for the `Toast.Manager` queue. See [Toast](/vue/toast).

`Combobox.createFilter` returns a `ComboboxFilter` and takes `ComboboxFilterOptions`, both exported from `@shardsui/vue/combobox`. See [Combobox](/vue/combobox).
