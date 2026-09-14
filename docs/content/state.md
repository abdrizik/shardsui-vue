# State

Controlled state, direction, disabled, and read-only.

Every component manages its own state by default. Props let you take over when you need to: hold the state yourself, set the reading direction, or take parts out of play. Appearance lives on the [Styling](/styling) page.

## Uncontrolled by default

A trigger toggles a dialog, a click expands an accordion item. Nothing to wire up on your side.

```vue title="Uncontrolled dialog"
<script setup>
import { Dialog } from '@shardsui/vue/dialog'
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
  </Dialog.Root>
</template>
```

The starting state is the initial value of the state prop. There's no separate `defaultValue`. Render `<Accordion.Root :value="['overview']">` and that panel opens first; the component takes ownership from there. Pass a literal (or a ref you never write) so the component stays in charge; to drive it yourself, use one of the two patterns below.

## Taking control with `v-model`

State props — `open`, `value`, `checked` — are models, so `v-model:open` keeps your ref and the component in sync both ways: write it and the component reflects the change, or the component writes it and your ref updates.

Open a dialog after a timeout, with no trigger at all:

```vue title="Controlled dialog"
<script setup>
import { onMounted, onUnmounted, shallowRef } from 'vue'
import { Dialog } from '@shardsui/vue/dialog'

const open = shallowRef(false)

let id
onMounted(() => {
  id = setTimeout(() => (open.value = true), 1000)
})
onUnmounted(() => clearTimeout(id))
</script>

<template>
  <Dialog.Root v-model:open="open">...</Dialog.Root>
</template>
```

Binding also lets you _read_ the component's state anywhere in the parent: gate a save button on `value.length`, mirror `open` into a heading.

## Reacting to changes

Alongside the state prop, each component emits a change event: `update:open`, `update:value`, `update:checked`. These are the component's own events, not native DOM ones. One listener catches every interaction that can move the state, whether that's a pointer, a keypress, an outside click or an escape. Writing to your own bound ref doesn't emit it; the event reports what the component decided.

Use it to run a side effect when the state moves:

```vue title="update:value"
<script setup lang="ts">
import { shallowRef } from 'vue'
import { Accordion } from '@shardsui/vue/accordion'

const value = shallowRef<string[]>([])
</script>

<template>
  <!-- [!code word:@update:value] -->
  <Accordion.Root :value="value" @update:value="(next) => (value = next)">...</Accordion.Root>
</template>
```

Pairing the state prop with its event — `:open` plus `@update:open` — is one-way control, an alternative to `v-model` when you'd rather own the write. Nothing changes until your listener updates the ref.

Components with a popup add an `openChangeComplete` event — bound as `@open-change-complete` — which fires once the open or close [animation](/animation) has finished.

## Vetoing a change

Change events carry one argument. The component reports the new state and asks you to commit it. To _prevent_ a change (say, keep a dialog open while a confirmation prompt is shown), use one-way control: pass the prop and listen to its event, and simply don't write the ref. The prop keeps its old value, so the component stays put.

```vue title="Keep a dialog open through a close attempt"
<!-- [!code word:hasUnsavedChanges] -->
<script setup>
import { shallowRef } from 'vue'
import { Dialog } from '@shardsui/vue/dialog'

const open = shallowRef(true)
const hasUnsavedChanges = shallowRef(true)

function onOpenChange(next) {
  if (!next && hasUnsavedChanges.value) return // veto: don't commit, dialog stays open
  open.value = next
}
</script>

<template>
  <Dialog.Root :open="open" @update:open="onOpenChange">...</Dialog.Root>
</template>
```

The same pattern vetoes any model prop — `open`, `value`, `checked` — on any component, since the listener is where you decide whether to accept the new value. With `v-model` the write is automatic, so switch to the explicit pair wherever you need a say.

## Reading direction

Every component that navigates with arrow keys or slides content sideways assumes left-to-right. Wrap a subtree — or the whole app — in the Direction Provider to flip that to right-to-left:

```vue title="RTL subtree"
<script setup>
import { DirectionProvider } from '@shardsui/vue/direction-provider'
</script>

<template>
  <DirectionProvider direction="rtl">
    <!-- Your app or a group of components -->
  </DirectionProvider>
</template>
```

It changes component behavior only: which arrow key moves focus, which side a positioner flips to, which way a slider or scrollbar tracks. It never touches the DOM's own text direction, so you still flip the actual text yourself with `dir="rtl"` on an element or `direction: rtl` in CSS.

:demo{name="direction-provider/hero"}

Popups render through a portal, outside your app root and beyond the reach of a surrounding `dir` attribute. To pick up the active direction there, read it with `getDirection()` and apply it where the portal lands. See [Direction Provider](/direction-provider) for the full API.

## Disabling and read-only

Two ways to take a control out of play, with different intent.

**`disabled`** removes it from the interaction entirely: no pointer, no focus, out of the tab order, and in a form its value isn't submitted. It's on every interactive component, and on individual parts too: disable a single `Accordion.Item` or `Menu.Item` while the rest stay live. Where losing focus would be disorienting — an item inside a [Toolbar](/toolbar)'s single tab stop, a [Menu](/menu), [Select](/select) or [Combobox](/combobox) item, a [Tabs](/tabs) tab, an [Accordion](/accordion), [Collapsible](/collapsible) or [Navigation Menu](/navigation-menu) trigger — the part swaps the native `disabled` for `aria-disabled` so it stays reachable.

**`readOnly`** keeps the control focusable and its value visible and submittable, but blocks edits. Use it for a value the user should see in context but can't change yet. It's on the editable controls: [Checkbox](/checkbox), [Switch](/switch), [Radio](/radio) and Radio Group, [Select](/select), [Combobox](/combobox), and [Autocomplete](/autocomplete).

Both reflect as data attributes on the parts — `[data-disabled]`, `[data-readonly]` — so you can style each state, and both set the right accessibility semantics (a native `disabled`, an `aria-readonly`) so assistive tech announces it.

```css title="switch.css"
.switch[data-disabled] {
  opacity: 0.5;
  cursor: not-allowed;
}
```

## Per-component behavior props

Beyond the shared props, each component exposes props for the behavior only it has:

- **`loopFocus`** on list components ([Menu](/menu), [Menubar](/menubar), [Tabs](/tabs), [Toolbar](/toolbar), [Toggle Group](/toggle-group), [Combobox](/combobox)): whether arrow-key navigation wraps from the last item back to the first. On by default.
- **`orientation`**: `'horizontal'` or `'vertical'`; decides which arrow keys move focus, and reflects as `data-orientation` on the parts whose layout depends on it.
- **`modal`** on overlays: whether opening uses a **focus trap** and blocks the page behind it.
- **`openOnHover`** on a [Menu](/menu) or [Popover](/popover) trigger: open on pointer hover instead of click (submenu triggers hover-open by default). **`delay`** and **`closeDelay`** on the same trigger set how long the pointer must rest before it opens and how long it lingers after the pointer leaves. A [Tooltip](/tooltip) is hover-driven by nature: its **`delay`** sits on `Tooltip.Trigger`, and `Tooltip.Provider` supplies a shared one for a group.

The complete set for each component lives in its API reference.
