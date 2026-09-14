# Dialog

A focus-trapping overlay.

:demo{name="dialog/hero"}

## Anatomy

```vue title="Anatomy"
<script setup lang="ts">
import { Dialog } from '@shardsui/vue/dialog'
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger />
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Viewport>
        <Dialog.Popup>
          <Dialog.Title />
          <Dialog.Description />
          <Dialog.Close />
        </Dialog.Popup>
      </Dialog.Viewport>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

`Dialog.Viewport` is optional. It provides a scrollable positioning container for the popup. When not needed, use `Dialog.Popup` directly with fixed positioning.

## Usage guidelines

- **Dialog doesn't support gestures**: if you need gestures or snap points, use [Drawer](/drawer). A panel that slides in from the screen edge without gestures is just a positioned Dialog.

## Examples

### State

By default, Dialog manages its own open state, and no props are required.

```vue title="Uncontrolled dialog"
<template>
  <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Title>Example dialog</Dialog.Title>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

Drive open with `:open` / `@update:open`, or `v-model:open`.

```vue title="Controlled dialog"
<script setup>
import { shallowRef } from 'vue'

const open = shallowRef(false)
</script>

<template>
  <Dialog.Root :open="open" @update:open="(next) => (open = next)">
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Popup>
        <form
          @submit.prevent="
            async () => {
              // Close the dialog once the form data is submitted
              await submitData()
              open = false
            }
          "
        >
          ...
        </form>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

`@update:open` is also the place to run side effects when the dialog opens or closes. Prefer it over a watcher.

```vue title="Running code when dialog state changes"
<template>
  <Dialog.Root
    :open="open"
    @update:open="
      (next) => {
        // Do stuff when the dialog is closed
        if (!next) {
          doStuff()
        }
        // Set the new state
        open = next
      }
    "
  >
    ...
  </Dialog.Root>
</template>
```

### Open from a menu

To open a dialog from a menu, keep the dialog controlled and flip its state from the menu item's `@click` handler.

```vue title="Connecting a dialog to a menu"
<script setup>
import { Dialog } from '@shardsui/vue/dialog'
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
  <Dialog.Root v-model:open="dialogOpen">
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Popup>
        <!-- Rest of the dialog -->
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

### Nested dialogs

Dialogs can be nested. Style the parent through the `[data-nested-dialog-open]` selector and the `var(--nested-dialogs)` CSS variable. Child dialogs render their own backdrop, marked with `data-nested`. Hide it with `[data-nested] { opacity: 0 }` to keep the parent visible behind the one on top.

:demo{name="dialog/nested"}

### Close confirmation

A nested confirmation dialog guards against losing work: it opens when the text typed into the parent dialog is about to be discarded.

Veto the close by controlling `open` and deciding in the `@update:open` handler. When a close is requested the handler runs; if you don't commit the new value, the prop keeps the old one and the dialog stays open. Open the confirmation there instead, so the prompt appears whether the user clicks the backdrop, presses Esc, or hits a close button.

```vue
<template>
  <Dialog.Root
    :open="open"
    @update:open="
      (next) => {
        if (!next && hasUnsavedChanges) return // veto: don't commit, dialog stays open
        open = next
      }
    "
  >
    ...
  </Dialog.Root>
</template>
```

:demo{name="dialog/close-confirmation"}

### Custom focus management

Control where focus goes when the dialog opens and closes with the `initialFocus` and `finalFocus` props on `<Dialog.Popup>`.

:demo{name="dialog/focus-management"}

### Outside scroll dialog

For long content, make `<Dialog.Viewport>` the outer scrollable container and let `<Dialog.Popup>` extend past the bottom edge. The scrollable area draws custom scrollbars with the [Scroll Area component](/scroll-area).

:demo{name="dialog/outside-scroll"}

### Inside scroll dialog

Here the popup stays fully on screen and an inner container scrolls instead. `<Dialog.Viewport>` positions `<Dialog.Popup>`, and the inner scrollable area is built with the [Scroll Area component](/scroll-area).

:demo{name="dialog/inside-scroll"}

### Placing elements outside the popup

To place elements "outside" the colored popup area, still render them inside `<Dialog.Popup>` and move the popup styles onto a child element. This preserves tab order and correct screen-reader announcements.

`<Dialog.Popup>` uses `pointer-events: none` while its inner content — the colored popup and close button — uses `pointer-events: auto`, so backdrop clicks still register.

:demo{name="dialog/uncontained"}

### Detached triggers

Keep `<Dialog.Trigger>` inside the root, as in the example at the top of this page. When the trigger and the dialog's content can't sit together in the markup, detach them: connect the trigger to a `<Dialog.Root>` with a shared `handle` from `Dialog.createHandle()`, with no shared `open` state needed.

```vue title="Detached triggers"
<!-- [!code word::handle="myDialog"] -->
<script setup>
const myDialog = Dialog.createHandle()
</script>

<template>
  <!-- [!code highlight] -->
  <Dialog.Trigger :handle="myDialog">Open</Dialog.Trigger>

  <!-- [!code highlight] -->
  <Dialog.Root :handle="myDialog">...</Dialog.Root>
</template>
```

:demo{name="dialog/detached-triggers-simple"}

### Multiple triggers

Several triggers can open the same dialog. Share one `handle` across detached triggers, or drop multiple `<Dialog.Trigger>` components inside a single `<Dialog.Root>`.

```vue title="Multiple triggers within the Root part"
<template>
  <Dialog.Root>
    <Dialog.Trigger>Trigger 1</Dialog.Trigger>
    <Dialog.Trigger>Trigger 2</Dialog.Trigger>
    ...
  </Dialog.Root>
</template>
```

```vue title="Multiple detached triggers"
<script setup>
const demoDialog = Dialog.createHandle()
</script>

<template>
  <Dialog.Trigger :handle="demoDialog">Trigger 1</Dialog.Trigger>
  <Dialog.Trigger :handle="demoDialog">Trigger 2</Dialog.Trigger>
  <Dialog.Root :handle="demoDialog">...</Dialog.Root>
</template>
```

To show different content depending on which trigger opened the dialog, pass a `payload` to each `<Dialog.Trigger>` and read it through the default slot on `<Dialog.Root>`. Give `Dialog.createHandle()` a type argument to type the payload:

```vue title="Detached triggers with payload"
<script setup lang="ts">
// [!code highlight]
const demoDialog = Dialog.createHandle<{ text: string }>()
</script>

<template>
  <!-- [!code word:payload] -->
  <!-- [!code highlight] -->
  <Dialog.Trigger :handle="demoDialog" :payload="{ text: 'Trigger 1' }">Trigger 1</Dialog.Trigger>

  <!-- [!code word:payload] -->
  <!-- [!code highlight] -->
  <Dialog.Trigger :handle="demoDialog" :payload="{ text: 'Trigger 2' }">Trigger 2</Dialog.Trigger>

  <!-- [!code word:payload] -->
  <Dialog.Root v-slot="{ payload }" :handle="demoDialog">
    <Dialog.Portal>
      <Dialog.Popup>
        <Dialog.Title>Dialog</Dialog.Title>
        <!-- [!code word:payload] -->
        <Dialog.Description v-if="payload !== undefined">
          This has been opened by {{ payload.text }}
        </Dialog.Description>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

### Controlled mode with multiple triggers

With multiple triggers, track the active one with `v-model:trigger-id` on `<Dialog.Root>` and the `id` prop on each `<Dialog.Trigger>`. The dialog writes back the `id` of the trigger that opened it.

:demo{name="dialog/detached-triggers-controlled"}

## API reference

### Root

Groups all parts of the dialog.
Doesn't render its own HTML element.

::table{columns="Prop,Type,Default"}

| Prop                      | Type                      | Default | Description                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| :------------------------ | :------------------------ | :------ | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `open`                    | `boolean`                 | `false` | Whether the dialog is currently open.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `modal`                   | `boolean \| 'trap-focus'` | `true`  | Determines if the dialog enters a modal state when open. `true`: user interaction is limited to just the dialog: focus is trapped, document page scroll is locked, and pointer interactions on outside elements are disabled. `false`: user interaction with the rest of the document is allowed. `'trap-focus'`: focus is trapped inside the dialog, but document page scroll is not locked and pointer interactions outside of it remain enabled. |
| `disablePointerDismissal` | `boolean`                 | `false` | Whether to prevent the dialog from closing on outside presses.                                                                                                                                                                                                                                                                                                                                                                                      |
| `update:open`             | `(open: boolean) => void` | —       | Emitted when the dialog is opened or closed (use `v-model:open`).                                                                                                                                                                                                                                                                                                                                                                                   |
| `openChangeComplete`      | `(open: boolean) => void` | —       | Called after any animations complete when the dialog is opened or closed.                                                                                                                                                                                                                                                                                                                                                                           |
| `handle`                  | `Dialog.Handle<Payload>`  | —       | A handle to associate the dialog with a trigger. If specified, allows external triggers to control the dialog's open state. Create one with `Dialog.createHandle()`.                                                                                                                                                                                                                                                                                |
| `triggerId`               | `string \| null`          | `null`  | ID of the trigger that the dialog is associated with (use `v-model:trigger-id`). This is useful in conjunction with the `open` prop to create a controlled dialog.                                                                                                                                                                                                                                                                                  |
| `default`                 | `Slot<{ payload }>`       | —       | Content; receives the active trigger's `payload`.                                                                                                                                                                                                                                                                                                                                                                                                   |

::

### Trigger

A button that opens the dialog.
Renders a `<button>` element.

::table{columns="Prop,Type,Default"}

| Prop       | Type                          | Default    | Description                                                                                                                                           |
| :--------- | :---------------------------- | :--------- | :---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`       | `keyof HTMLElementTagNameMap` | `'button'` | HTML element to render.                                                                                                                               |
| `class`    | `string`                      | —          | CSS class applied to the element.                                                                                                                     |
| `style`    | `string`                      | —          | Inline style applied to the element.                                                                                                                  |
| `disabled` | `boolean`                     | `false`    | Whether the trigger is disabled.                                                                                                                      |
| `id`       | `string`                      | auto       | Custom element ID. Matched against `<Dialog.Root triggerId>`.                                                                                         |
| `handle`   | `Dialog.Handle<Payload>`      | —          | A handle created with `Dialog.createHandle()`. When supplied, this trigger does not need to live inside `<Dialog.Root>` (detached trigger pattern).   |
| `payload`  | `Payload`                     | —          | Per-trigger payload forwarded to the Root's default slot when this trigger opens the dialog. Used with the `handle` prop for multi-trigger scenarios. |
| `default`  | `Slot<{ disabled, open }>`    | —          | Content; receives the trigger state.                                                                                                                  |

::

| Attribute         | Description                                         |
| :---------------- | :-------------------------------------------------- |
| `data-popup-open` | Present while the dialog is open from this trigger. |
| `data-disabled`   | Present when the trigger is disabled.               |

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

| Attribute                 | Description                                                      |
| :------------------------ | :--------------------------------------------------------------- |
| `data-open`               | Present when the dialog is open.                                 |
| `data-closed`             | Present when the dialog is closed.                               |
| `data-nested`             | Present when the dialog is nested within another dialog.         |
| `data-nested-dialog-open` | Present when the dialog has other open dialogs nested within it. |
| `data-starting-style`     | Present when the backdrop is animating in.                       |
| `data-ending-style`       | Present when the backdrop is animating out.                      |

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

| Attribute                 | Description                                                      |
| :------------------------ | :--------------------------------------------------------------- |
| `data-open`               | Present when the dialog is open.                                 |
| `data-closed`             | Present when the dialog is closed.                               |
| `data-nested`             | Present when the dialog is nested within another dialog.         |
| `data-nested-dialog-open` | Present when the dialog has other open dialogs nested within it. |
| `data-starting-style`     | Present when the dialog is animating in.                         |
| `data-ending-style`       | Present when the dialog is animating out.                        |

### Popup

A container for the dialog contents.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop           | Type                                                                                   | Default | Description                                                                                                                                                                                                                                                                   |
| :------------- | :------------------------------------------------------------------------------------- | :------ | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`           | `keyof HTMLElementTagNameMap`                                                          | `'div'` | HTML element to render.                                                                                                                                                                                                                                                       |
| `class`        | `string`                                                                               | —       | CSS class applied to the element.                                                                                                                                                                                                                                             |
| `style`        | `string`                                                                               | —       | Inline style applied to the element.                                                                                                                                                                                                                                          |
| `id`           | `string`                                                                               | auto    | Custom element ID. Referenced by the trigger's `aria-controls`.                                                                                                                                                                                                               |
| `initialFocus` | `HTMLElement \| boolean \| ((type: string) => HTMLElement \| boolean \| null \| void)` | —       | Element to focus when the dialog opens, or a function receiving the interaction type (`'mouse'`, `'keyboard'`, `'touch'`, `'pen'`). `false` to skip; `true` focuses the first tabbable child. Defaults to the first tabbable child, or the popup itself when opened by touch. |
| `finalFocus`   | `HTMLElement \| boolean \| ((type: string) => HTMLElement \| boolean \| null \| void)` | —       | Element to focus when the dialog closes, or a function receiving the interaction type. `false` to skip; `true` (default) to return focus to the trigger.                                                                                                                      |
| `default`      | `Slot<{ open, transitionStatus, nested, nestedDialogOpen }>`                           | —       | Content; receives the popup state.                                                                                                                                                                                                                                            |

::

| Attribute                 | Description                                                      |
| :------------------------ | :--------------------------------------------------------------- |
| `data-open`               | Present when the dialog is open.                                 |
| `data-closed`             | Present when the dialog is closed.                               |
| `data-nested`             | Present when the dialog is nested within another dialog.         |
| `data-nested-dialog-open` | Present when the dialog has other open dialogs nested within it. |
| `data-starting-style`     | Present when the dialog is animating in.                         |
| `data-ending-style`       | Present when the dialog is animating out.                        |

| CSS Variable       | Description                                   |
| :----------------- | :-------------------------------------------- |
| `--nested-dialogs` | Indicates how many dialogs are nested within. |

### Title

A heading that labels the dialog.
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

A paragraph with additional information about the dialog.
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

Connects a `<Dialog.Root>` with detached `<Dialog.Trigger>` components, and controls the dialog imperatively. Pass a type argument to type the `payload`.

```ts
const dialog = Dialog.createHandle<Payload>()
```

::table{columns="Member,Type"}

| Member                     | Type                           | Description                                                                               |
| :------------------------- | :----------------------------- | :---------------------------------------------------------------------------------------- |
| `isOpen`                   | `boolean`                      | Whether the dialog is currently open (readonly).                                          |
| `open(triggerId)`          | `(id: string \| null) => void` | Opens the dialog. Pass a trigger `id` to associate it, or `null` to open with no trigger. |
| `openWithPayload(payload)` | `(payload: Payload) => void`   | Opens the dialog with a payload for the default slot.                                     |
| `close()`                  | `() => void`                   | Closes the dialog.                                                                        |

::
