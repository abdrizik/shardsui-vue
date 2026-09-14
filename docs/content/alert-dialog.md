# Alert Dialog

A dialog requiring a response.

:demo{name="alert-dialog/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { AlertDialog } from '@shardsui/vue/alert-dialog'
</script>

<template>
  <AlertDialog.Root>
    <AlertDialog.Trigger />
    <AlertDialog.Portal>
      <AlertDialog.Backdrop />
      <AlertDialog.Viewport>
        <AlertDialog.Popup>
          <AlertDialog.Title />
          <AlertDialog.Description />
          <AlertDialog.Close />
        </AlertDialog.Popup>
      </AlertDialog.Viewport>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
```

## Examples

### Open from a menu

To open an alert dialog from a menu, keep the alert dialog controlled and flip its state from the menu item's `@click` handler.

```vue title="Connecting a dialog to a menu"
<script setup>
import { AlertDialog } from '@shardsui/vue/alert-dialog'
import { Menu } from '@shardsui/vue/menu'
import { shallowRef } from 'vue'

const dialogOpen = shallowRef(false)
</script>

<template>
  <Menu.Root>
    <Menu.Trigger>Open menu</Menu.Trigger>
    <Menu.Portal>
      <Menu.Positioner>
        <Menu.Popup>
          <!-- Open the dialog when the menu item is clicked -->
          <!-- [!code highlight] -->
          <Menu.Item @click="dialogOpen = true">Open dialog</Menu.Item>
        </Menu.Popup>
      </Menu.Positioner>
    </Menu.Portal>
  </Menu.Root>

  <!-- Control the dialog state -->
  <!-- [!code highlight] -->
  <AlertDialog.Root v-model:open="dialogOpen">
    <AlertDialog.Portal>
      <AlertDialog.Backdrop />
      <AlertDialog.Popup>
        <!-- Rest of the dialog -->
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
```

### Close confirmation

A nested confirmation dialog guards against losing work: it opens when the text typed into the parent dialog is about to be discarded.

Veto the close by controlling `open` and deciding in the `@update:open` handler. When a close is requested the handler runs; if you don't commit the new value, the prop keeps the old one and the dialog stays open. Open the confirmation there instead, so the prompt appears whether the user presses Esc or hits a close button. An alert dialog is never dismissed by clicking the backdrop.

```vue
<template>
  <AlertDialog.Root
    :open="open"
    @update:open="
      (next) => {
        if (!next && hasUnsavedChanges) return // veto: don't commit, dialog stays open
        open = next
      }
    "
  >
    ...
  </AlertDialog.Root>
</template>
```

Style the parent dialog through the `[data-nested-dialog-open]` selector and the `var(--nested-dialogs)` CSS variable. Child dialogs render their own backdrop, marked with `data-nested`. Hide it with `[data-nested] { opacity: 0 }` to keep the parent visible behind the one on top.

The demo below uses [Dialog](/dialog). The same pattern applies to AlertDialog.

:demo{name="dialog/close-confirmation"}

### Detached triggers

`<AlertDialog.Trigger>` normally sits inside the root. When the trigger and the alert dialog's content can't share a spot in the markup, render `<AlertDialog.Trigger>` wherever it fits and connect it to the root with a shared `handle` from `AlertDialog.createHandle()`.

The handle's imperative methods — `open()`, `openWithPayload()` and `close()` — only take effect while an `<AlertDialog.Root>` using the same handle is mounted. Calls made before a root mounts or after it unmounts are ignored, not queued: each mount starts from fresh state.

```vue title="Detached triggers"
<!-- [!code word::handle="h"] -->
<script setup>
const h = AlertDialog.createHandle()
</script>

<template>
  <!-- [!code highlight] -->
  <AlertDialog.Trigger :handle="h">Open</AlertDialog.Trigger>

  <!-- [!code highlight] -->
  <AlertDialog.Root :handle="h">...</AlertDialog.Root>
</template>
```

:demo{name="alert-dialog/detached-triggers-simple"}

### Multiple triggers

Several triggers can open the same alert dialog. Share one `handle` across detached triggers, or drop multiple `<AlertDialog.Trigger>` components inside a single `<AlertDialog.Root>`.

```vue title="Multiple triggers within the Root part"
<template>
  <AlertDialog.Root>
    <AlertDialog.Trigger>Trigger 1</AlertDialog.Trigger>
    <AlertDialog.Trigger>Trigger 2</AlertDialog.Trigger>
    ...
  </AlertDialog.Root>
</template>
```

```vue title="Multiple detached triggers"
<script setup>
const h = AlertDialog.createHandle()
</script>

<template>
  <AlertDialog.Trigger :handle="h">Trigger 1</AlertDialog.Trigger>
  <AlertDialog.Trigger :handle="h">Trigger 2</AlertDialog.Trigger>
  <AlertDialog.Root :handle="h">...</AlertDialog.Root>
</template>
```

To show different content depending on which trigger opened the alert dialog, pass a `payload` to each `<AlertDialog.Trigger>` and read it through the default slot on `<AlertDialog.Root>`. Give `AlertDialog.createHandle()` a type argument to type the payload:

```vue title="Detached triggers with payload"
<!-- [!code word:payload] -->
<script setup lang="ts">
// [!code highlight]
const h = AlertDialog.createHandle<{ message: string }>()
</script>

<template>
  <!-- [!code word:payload] -->
  <!-- [!code highlight] -->
  <AlertDialog.Trigger :handle="h" :payload="{ message: 'Trigger 1' }"
    >Trigger 1</AlertDialog.Trigger
  >

  <!-- [!code word:payload] -->
  <!-- [!code highlight] -->
  <AlertDialog.Trigger :handle="h" :payload="{ message: 'Trigger 2' }"
    >Trigger 2</AlertDialog.Trigger
  >

  <AlertDialog.Root v-slot="{ payload }" :handle="h">
    <AlertDialog.Portal>
      <AlertDialog.Popup>
        <AlertDialog.Title>Alert dialog</AlertDialog.Title>
        <!-- [!code word:payload] -->
        <AlertDialog.Description v-if="payload !== undefined">
          Confirming {{ payload.message }}
        </AlertDialog.Description>
      </AlertDialog.Popup>
    </AlertDialog.Portal>
  </AlertDialog.Root>
</template>
```

### Controlled mode with multiple triggers

When the alert dialog's visibility depends on your app's state, drive it with `v-model:open` on `<AlertDialog.Root>`. With multiple triggers, give each `<AlertDialog.Trigger>` an `id` and add `v-model:trigger-id` to `<AlertDialog.Root>`: each trigger publishes its own `id` when it opens the dialog, and setting `triggerId` yourself associates the dialog with that trigger.

:demo{name="alert-dialog/detached-triggers-controlled"}

## API reference

### Root

Groups all parts of the alert dialog.
Doesn't render its own HTML element.

::table{columns="Prop,Type,Default"}

| Prop                 | Type                      | Default | Description                                                                                                                                                                           |
| :------------------- | :------------------------ | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `open`               | `boolean`                 | `false` | Whether the dialog is currently open (use `v-model:open`).                                                                                                                            |
| `update:open`        | `(open: boolean) => void` | —       | Emitted when the alert dialog is opened or closed (use `v-model:open`).                                                                                                               |
| `openChangeComplete` | `(open: boolean) => void` | —       | Called after any animations complete when the dialog is opened or closed.                                                                                                             |
| `handle`             | `AlertDialog.Handle`      | —       | A handle to associate the alert dialog with a trigger. If specified, allows external triggers to control the alert dialog's open state. Create one with `AlertDialog.createHandle()`. |
| `triggerId`          | `string \| null`          | `null`  | Active trigger id in multi-trigger scenarios (use `v-model:trigger-id`).                                                                                                              |
| `default`            | `Slot<{ payload }>`       | —       | Content; receives the active trigger's `payload`.                                                                                                                                     |

::

### Trigger

A button that opens the alert dialog.
Renders a `<button>` element.

::table{columns="Prop,Type,Default"}

| Prop       | Type                          | Default    | Description                                                                                                                   |
| :--------- | :---------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------- |
| `as`       | `keyof HTMLElementTagNameMap` | `'button'` | HTML element to render.                                                                                                       |
| `class`    | `string`                      | —          | CSS class applied to the element.                                                                                             |
| `style`    | `string`                      | —          | Inline style applied to the element.                                                                                          |
| `disabled` | `boolean`                     | `false`    | Whether the trigger is disabled.                                                                                              |
| `id`       | `string`                      | auto       | Custom element ID. Matched against `<AlertDialog.Root triggerId>`.                                                            |
| `handle`   | `AlertDialog.Handle`          | —          | A handle created with `AlertDialog.createHandle()` for detached trigger usage (outside the Root).                             |
| `payload`  | `Payload`                     | —          | Per-trigger payload forwarded to the dialog when this trigger opens it. Accessible via the default slot's `{ payload }` prop. |
| `default`  | `Slot<{ disabled, open }>`    | —          | Content; receives the trigger state.                                                                                          |

::

| Attribute         | Description                                               |
| :---------------- | :-------------------------------------------------------- |
| `data-popup-open` | Present while the alert dialog is open from this trigger. |
| `data-disabled`   | Present when the trigger is disabled.                     |

### Portal

A portal that moves the popup out to `<body>`, clear of ancestor clipping and stacking.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop          | Type                  | Default | Description                                                                                                   |
| :------------ | :-------------------- | :------ | :------------------------------------------------------------------------------------------------------------ |
| `container`   | `HTMLElement \| null` | —       | Parent element to render the portal into. Defaults to the nearest ancestor portal, otherwise `document.body`. |
| `keepMounted` | `boolean`             | `false` | Whether to keep the contents mounted while the popup is closed.                                               |
| `default`     | `Slot`                | —       | Content.                                                                                                      |

::

### Backdrop

An overlay displayed beneath the popup.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                               | Default | Description                           |
| :-------- | :--------------------------------- | :------ | :------------------------------------ |
| `as`      | `keyof HTMLElementTagNameMap`      | `'div'` | HTML element to render.               |
| `class`   | `string`                           | —       | CSS class applied to the element.     |
| `style`   | `string`                           | —       | Inline style applied to the element.  |
| `default` | `Slot<{ open, transitionStatus }>` | —       | Content; receives the backdrop state. |

::

| Attribute                 | Description                                                         |
| :------------------------ | :------------------------------------------------------------------ |
| `data-open`               | Present when the alert dialog is open.                              |
| `data-closed`             | Present when the alert dialog is closed.                            |
| `data-nested`             | Present when the alert dialog is nested within another dialog.      |
| `data-nested-dialog-open` | Present when the alert dialog has other open dialogs nested within. |
| `data-starting-style`     | Present when the backdrop is animating in.                          |
| `data-ending-style`       | Present when the backdrop is animating out.                         |

### Viewport

A positioning container for the dialog popup that can be made scrollable.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                                         | Default | Description                           |
| :-------- | :----------------------------------------------------------- | :------ | :------------------------------------ |
| `as`      | `keyof HTMLElementTagNameMap`                                | `'div'` | HTML element to render.               |
| `class`   | `string`                                                     | —       | CSS class applied to the element.     |
| `style`   | `string`                                                     | —       | Inline style applied to the element.  |
| `default` | `Slot<{ open, transitionStatus, nested, nestedDialogOpen }>` | —       | Content; receives the viewport state. |

::

| Attribute                 | Description                                                         |
| :------------------------ | :------------------------------------------------------------------ |
| `data-open`               | Present when the alert dialog is open.                              |
| `data-closed`             | Present when the alert dialog is closed.                            |
| `data-starting-style`     | Present when the alert dialog is animating in.                      |
| `data-ending-style`       | Present when the alert dialog is animating out.                     |
| `data-nested`             | Present when the alert dialog is nested within another dialog.      |
| `data-nested-dialog-open` | Present when the alert dialog has other open dialogs nested within. |

### Popup

A container for the dialog contents.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop           | Type                                                                                   | Default | Description                                                                                                                                                                                                                                                                         |
| :------------- | :------------------------------------------------------------------------------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`           | `keyof HTMLElementTagNameMap`                                                          | `'div'` | HTML element to render.                                                                                                                                                                                                                                                             |
| `class`        | `string`                                                                               | —       | CSS class applied to the element.                                                                                                                                                                                                                                                   |
| `style`        | `string`                                                                               | —       | Inline style applied to the element.                                                                                                                                                                                                                                                |
| `id`           | `string`                                                                               | auto    | Custom element ID. Referenced by the trigger's `aria-controls`.                                                                                                                                                                                                                     |
| `initialFocus` | `HTMLElement \| boolean \| ((type: string) => HTMLElement \| boolean \| null \| void)` | —       | Element to focus when the alert dialog opens, or a function receiving the interaction type (`'mouse'`, `'keyboard'`, `'touch'`, `'pen'`). `false` to skip; `true` focuses the first tabbable child. Defaults to the first tabbable child, or the popup itself when opened by touch. |
| `finalFocus`   | `HTMLElement \| boolean \| ((type: string) => HTMLElement \| boolean \| null \| void)` | —       | Element to focus when the alert dialog closes, or a function receiving the interaction type. `false` to skip; `true` (default) returns focus to the trigger.                                                                                                                        |
| `default`      | `Slot<{ open, transitionStatus, nested, nestedDialogOpen }>`                           | —       | Content; receives the popup state.                                                                                                                                                                                                                                                  |

::

| Attribute                 | Description                                                         |
| :------------------------ | :------------------------------------------------------------------ |
| `data-open`               | Present when the alert dialog is open.                              |
| `data-closed`             | Present when the alert dialog is closed.                            |
| `data-starting-style`     | Present when the alert dialog is animating in.                      |
| `data-ending-style`       | Present when the alert dialog is animating out.                     |
| `data-nested`             | Present when the alert dialog is nested within another dialog.      |
| `data-nested-dialog-open` | Present when the alert dialog has other open dialogs nested within. |

| CSS Variable       | Description                              |
| :----------------- | :--------------------------------------- |
| `--nested-dialogs` | Number of nested dialogs currently open. |

### Title

A heading that labels the alert dialog.
Renders an `<h2>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                          | Default | Description                          |
| :-------- | :---------------------------- | :------ | :----------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap` | `'h2'`  | HTML element to render.              |
| `class`   | `string`                      | —       | CSS class applied to the element.    |
| `style`   | `string`                      | —       | Inline style applied to the element. |
| `id`      | `string`                      | auto    | Custom element ID.                   |
| `default` | `Slot`                        | —       | Content.                             |

::

### Description

A paragraph with additional information about the alert dialog.
Renders a `<p>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                          | Default | Description                          |
| :-------- | :---------------------------- | :------ | :----------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap` | `'p'`   | HTML element to render.              |
| `class`   | `string`                      | —       | CSS class applied to the element.    |
| `style`   | `string`                      | —       | Inline style applied to the element. |
| `id`      | `string`                      | auto    | Custom element ID.                   |
| `default` | `Slot`                        | —       | Content.                             |

::

### Close

A button that closes the dialog.
Renders a `<button>` element.

::table{columns="Prop,Type,Default"}

| Prop       | Type                          | Default    | Description                                       |
| :--------- | :---------------------------- | :--------- | :------------------------------------------------ |
| `as`       | `keyof HTMLElementTagNameMap` | `'button'` | HTML element to render.                           |
| `class`    | `string`                      | —          | CSS class applied to the element.                 |
| `style`    | `string`                      | —          | Inline style applied to the element.              |
| `disabled` | `boolean`                     | `false`    | Whether the button is disabled.                   |
| `default`  | `Slot<{ disabled }>`          | —          | Content; receives whether the button is disabled. |

::

| Attribute       | Description                          |
| :-------------- | :----------------------------------- |
| `data-disabled` | Present when the button is disabled. |

## Handle

Connects an `<AlertDialog.Root>` with detached `<AlertDialog.Trigger>` components, and controls the alert dialog imperatively. Pass a type argument to type the `payload`.

```ts
const alertDialog = AlertDialog.createHandle<Payload>()
```

::table{columns="Member,Type"}

| Member                     | Type                           | Description                                                                                     |
| :------------------------- | :----------------------------- | :---------------------------------------------------------------------------------------------- |
| `isOpen`                   | `boolean`                      | Whether the alert dialog is currently open (readonly).                                          |
| `open(triggerId)`          | `(id: string \| null) => void` | Opens the alert dialog. Pass a trigger `id` to associate it, or `null` to open with no trigger. |
| `openWithPayload(payload)` | `(payload: Payload) => void`   | Opens the alert dialog with a payload for the default slot.                                     |
| `close()`                  | `() => void`                   | Closes the alert dialog.                                                                        |

::
