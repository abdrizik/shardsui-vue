# Select

A single-select listbox.

:demo{name="select/hero"}

## Anatomy

```vue title="Anatomy"
<script setup>
import { Select } from '@shardsui/vue/select'
</script>

<template>
  <Select.Root>
    <Select.Label />
    <Select.Trigger>
      <Select.Value />
      <Select.Icon />
    </Select.Trigger>
    <Select.Portal>
      <Select.Backdrop />
      <Select.Positioner>
        <Select.Popup>
          <Select.ScrollUpArrow />
          <Select.Arrow />

          <Select.List>
            <Select.Item>
              <Select.ItemIndicator />
            </Select.Item>

            <Select.Separator />

            <Select.Group>
              <Select.GroupLabel />
            </Select.Group>
          </Select.List>
          <Select.ScrollDownArrow />
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
```

## Usage guidelines

- **Prefer Combobox for large lists**: Select has no filtering beyond typeahead (typing jumps to the matching item). Once the list grows long enough to need filtering, switch to [Combobox](/combobox).
- **Positioning**: the popup anchors to the trigger through `<Select.Positioner>`. Set `side`, `align` and the offsets there, and size the popup against the anchor CSS variables it publishes (see [Styling](/styling)).
- **Give the control an accessible name**: add a `<Select.Label>`, or set an `aria-label` on `<Select.Trigger>` when there's no visible label. See the [forms guide](/forms).

## TypeScript

`<Select.Root>` infers its item type from the `value` prop, so every `<Select.Item>`'s `value` (and each entry in the `items` array) must share that type. Adding `multiple` flips that type to an array.

See the [TypeScript guide](/typescript#value-types-for-generic-parts) for generic roots, typed wrappers, and template ref patterns.

## Examples

### Formatting the value

With no `items`, `<Select.Value>` stringifies the selected `value`. Give `<Select.Root>` an `items` prop and it renders the matching label instead:

```vue title="items prop"
<script setup lang="ts">
// [!code word:items]
const items = [
  { value: null, label: 'Select theme' },
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]
</script>

<template>
  <!-- [!code word:items] -->
  <Select.Root :items="items">
    <Select.Value />
  </Select.Root>
</template>
```

For richer output, take the default slot of `<Select.Value>` and format the value yourself:

```vue title="Formatted value"
<script setup lang="ts">
const items = {
  monospace: 'Monospace',
  serif: 'Serif',
  'sans-serif': 'Sans-serif'
}
</script>

<template>
  <!-- [!code highlight:5] -->
  <Select.Value v-slot="{ value }">
    <span :style="{ fontFamily: value as string }">
      {{ items[value as keyof typeof items] }}
    </span>
  </Select.Value>
</template>
```

Giving each item an [object value](#examples-object-values) skips the lookup.

### Labeling a select

Add a visible label for the trigger with `<Select.Label>`:

```vue title="Using Select.Label to label a select"
<template>
  <Select.Root>
    <!-- [!code highlight] -->
    <Select.Label>Theme</Select.Label>
    <!-- ... -->
  </Select.Root>
</template>
```

Clicking the label moves focus to the trigger without opening the popup.

### Placeholder values

Show prompt text before anything is chosen with the `placeholder` prop on `<Select.Value>`:

```vue title="Placeholder item"
<script setup lang="ts">
const items = [
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]
</script>

<template>
  <Select.Root :items="items">
    <!-- [!code highlight] -->
    <Select.Value placeholder="Select theme" />
  </Select.Root>
</template>
```

A placeholder alone gives no way back to the empty state from the select itself. To make it clearable from the popup rather than a separate reset button, add a `null` item to the list:

```vue title="Clearable item"
<script setup lang="ts">
const items = [
  // [!code highlight]
  { value: null, label: 'Select theme' },
  { value: 'system', label: 'System default' },
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' }
]
</script>

<template>
  <Select.Root :items="items">
    <Select.Value />
  </Select.Root>
</template>
```

An entry that labels `null` doubles as the empty-state text, so `<Select.Value>` renders it in place of any `placeholder`.

### Multiple selection

Set the `multiple` prop on `<Select.Root>` and the `value` becomes an array of every chosen item. Render that array through the `<Select.Value>` default slot.

:demo{name="select/multiple"}

### Object values

Item values can be objects, not just primitives. The `<Select.Value>` default slot then receives the full object, so you can format the display from any of its fields without an `items` lookup. Pass `isItemEqualToValue` so the select matches the selected object against the list by a stable field like `id`.

:demo{name="select/object-values"}

### Grouped

Break a long list into labeled sections with `<Select.Group>` and a `<Select.GroupLabel>` for each heading. Model the data as an array of group objects, each with its own `items` array plus a field such as `label` for the heading text, and render one `<Select.Group>` per entry.

:demo{name="select/grouped"}

### Scrolling a long list

The scrolling container is `<Select.List>`, or `<Select.Popup>` when no list is rendered. Cap it with `--available-height` so it never outgrows the viewport:

```css title="Capping the list height"
.select-list {
  max-height: var(--available-height);
  overflow-y: auto;
}
```

`<Select.ScrollUpArrow>` and `<Select.ScrollDownArrow>` become visible when there is more to scroll in that direction, and scroll the list while the pointer rests on them. Both render with `position: absolute`, so give the popup a positioning context and place them against its edges:

```vue title="Scroll arrows"
<template>
  <Select.Popup class="select-popup">
    <Select.ScrollUpArrow class="select-scroll-arrow-up" />
    <Select.List class="select-list">
      <!-- ... -->
    </Select.List>
    <Select.ScrollDownArrow class="select-scroll-arrow-down" />
  </Select.Popup>
</template>
```

Mounting either arrow hides the list's scrollbar. Neither arrow becomes visible when the popup was opened by touch, where the scrollbar stays.

## API reference

### Root

Groups all parts of the select.
Doesn't render its own HTML element, but renders a hidden `<input>` beside.

::table{columns="Prop,Type,Default"}

| Prop                   | Type                                                                                      | Default                                                  | Description                                                                                                                 |
| :--------------------- | :---------------------------------------------------------------------------------------- | :------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------- |
| `value`                | `unknown`                                                                                 | `null` (`[]` when `multiple`)                            | The selected value (use `v-model:value`).                                                                                   |
| `update:value`         | `(value: unknown) => void`                                                                | —                                                        | Emitted when the selected value changes.                                                                                    |
| `open`                 | `boolean`                                                                                 | `false`                                                  | The open state (use `v-model:open`).                                                                                        |
| `update:open`          | `(open: boolean) => void`                                                                 | —                                                        | Emitted when the open state changes.                                                                                        |
| `openChangeComplete`   | `(open: boolean) => void`                                                                 | —                                                        | Fires after the open/close animation completes.                                                                             |
| `name`                 | `string`                                                                                  | —                                                        | Names the value in form submission; applied to the hidden input.                                                            |
| `disabled`             | `boolean`                                                                                 | `false`                                                  | Disables the select.                                                                                                        |
| `readOnly`             | `boolean`                                                                                 | `false`                                                  | Prevents the popup from opening and the value from changing. The value still submits.                                       |
| `required`             | `boolean`                                                                                 | `false`                                                  | Marks the select required for form submission.                                                                              |
| `autoComplete`         | `string`                                                                                  | —                                                        | Browser autofill hint applied to the hidden input.                                                                          |
| `form`                 | `string`                                                                                  | —                                                        | Associates the hidden input with a form by its `id` (use when the select is rendered outside the form).                     |
| `modal`                | `boolean`                                                                                 | `true`                                                   | Renders a backdrop that blocks interaction outside the popup and locks page scroll while open.                              |
| `multiple`             | `boolean`                                                                                 | `false`                                                  | Allows several items to be selected; `value` becomes an array.                                                              |
| `highlightItemOnHover` | `boolean`                                                                                 | `true`                                                   | Highlights items as the pointer moves over them. Turn it off to keep CSS `:hover` distinct from `data-highlighted`.         |
| `items`                | `readonly { value, label }[] \| readonly { items: Value[] }[] \| Record<string, unknown>` | —                                                        | Items `Select.Value` resolves labels from: `{ value, label }` entries, groups of those, or a record mapping value to label. |
| `itemToStringLabel`    | `(item) => string`                                                                        | reads `label` / `value` / JSON-serializes                | Converts an item to its display label.                                                                                      |
| `itemToStringValue`    | `(item) => string`                                                                        | reads `value` when paired with `label` / JSON-serializes | Converts an item to its form value string.                                                                                  |
| `isItemEqualToValue`   | `(item, value) => boolean`                                                                | `Object.is`                                              | Compares an item to the current value.                                                                                      |
| `id`                   | `string`                                                                                  | auto                                                     | Base id for the trigger and the generated part ids.                                                                         |

::

### Label

An accessible label that is automatically associated with the select trigger.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                                         | Default | Description                              |
| :-------- | :----------------------------------------------------------- | :------ | :--------------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap \| Component`                   | `'div'` | HTML element to render.                  |
| `class`   | `string`                                                     | —       | CSS class applied to the element.        |
| `style`   | `string`                                                     | —       | Inline style applied to the element.     |
| `default` | `Slot<{ touched, dirty, filled, focused, valid, disabled }>` | —       | Label content; receives the field state. |

::

| Attribute      | Description                                                              |
| :------------- | :----------------------------------------------------------------------- |
| `data-valid`   | Present when the field is valid (when wrapped in Field.Root).            |
| `data-invalid` | Present when the field is invalid (when wrapped in Field.Root).          |
| `data-touched` | Present when the field has been touched (when wrapped in Field.Root).    |
| `data-dirty`   | Present when the field's value has changed (when wrapped in Field.Root). |
| `data-filled`  | Present when the select has a value (when wrapped in Field.Root).        |
| `data-focused` | Present when the trigger is focused (when wrapped in Field.Root).        |

### Trigger

A button that opens the select popup.
Renders a `<button>` element.
Typing while it is focused and closed selects the first item whose label matches, unless `multiple` is set.

::table{columns="Prop,Type,Default"}

| Prop       | Type                                                                                                        | Default         | Description                                    |
| :--------- | :---------------------------------------------------------------------------------------------------------- | :-------------- | :--------------------------------------------- |
| `as`       | `keyof HTMLElementTagNameMap \| Component`                                                                  | `'button'`      | HTML element to render.                        |
| `class`    | `string`                                                                                                    | —               | CSS class applied to the element.              |
| `style`    | `string`                                                                                                    | —               | Inline style applied to the element.           |
| `disabled` | `boolean`                                                                                                   | `false`         | Whether the trigger is disabled.               |
| `id`       | `string`                                                                                                    | the Root's `id` | Custom element ID.                             |
| `default`  | `Slot<{ touched, dirty, filled, focused, valid, open, disabled, readOnly, popupSide, value, placeholder }>` | —               | Trigger content; receives the trigger's state. |

::

| Attribute          | Description                                                                        |
| :----------------- | :--------------------------------------------------------------------------------- |
| `data-popup-open`  | Present when the select is open.                                                   |
| `data-popup-side`  | Indicates which side the corresponding popup is positioned relative to its anchor. |
| `data-pressed`     | Present while the popup is open, so the trigger can render as held down.           |
| `data-disabled`    | Present when disabled.                                                             |
| `data-readonly`    | Present when the select is readonly.                                               |
| `data-valid`       | Present when the select is in a valid state (when wrapped in Field.Root).          |
| `data-invalid`     | Present when the select is in an invalid state (when wrapped in Field.Root).       |
| `data-touched`     | Present when the select has been touched (when wrapped in Field.Root).             |
| `data-dirty`       | Present when the select's value has changed (when wrapped in Field.Root).          |
| `data-filled`      | Present when the select has a value (when wrapped in Field.Root).                  |
| `data-focused`     | Present when the select trigger is focused (when wrapped in Field.Root).           |
| `data-placeholder` | Present when the select doesn't have a value.                                      |

### Value

A text label of the currently selected item.
Renders a `<span>` element.

::table{columns="Prop,Type,Default"}

| Prop          | Type                                       | Default  | Description                                                                                 |
| :------------ | :----------------------------------------- | :------- | :------------------------------------------------------------------------------------------ |
| `as`          | `keyof HTMLElementTagNameMap \| Component` | `'span'` | HTML element to render.                                                                     |
| `class`       | `string`                                   | —        | CSS class applied to the element.                                                           |
| `style`       | `string`                                   | —        | Inline style applied to the element.                                                        |
| `placeholder` | `string`                                   | —        | Text shown when no value is selected. An `items` entry that labels `null` takes precedence. |
| `default`     | `Slot<{ value: unknown }>`                 | —        | Receives the current value. Without it, the resolved label is rendered.                     |

::

| Attribute          | Description                                            |
| :----------------- | :----------------------------------------------------- |
| `data-placeholder` | Present when no value is selected (placeholder shown). |

### Icon

An icon that indicates that the trigger button opens a select popup.
Renders a `<span>` element, containing a ▼ glyph when given no children.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                       | Default  | Description                                        |
| :-------- | :----------------------------------------- | :------- | :------------------------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap \| Component` | `'span'` | HTML element to render.                            |
| `class`   | `string`                                   | —        | CSS class applied to the element.                  |
| `style`   | `string`                                   | —        | Inline style applied to the element.               |
| `default` | `Slot<{ open }>`                           | —        | Icon content; receives whether the select is open. |

::

| Attribute         | Description                                   |
| :---------------- | :-------------------------------------------- |
| `data-popup-open` | Present when the corresponding popup is open. |

### Backdrop

An overlay displayed beneath the popup.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                       | Default | Description                           |
| :-------- | :----------------------------------------- | :------ | :------------------------------------ |
| `as`      | `keyof HTMLElementTagNameMap \| Component` | `'div'` | HTML element to render.               |
| `class`   | `string`                                   | —       | CSS class applied to the element.     |
| `style`   | `string`                                   | —       | Inline style applied to the element.  |
| `default` | `Slot<{ open, transitionStatus }>`         | —       | Content; receives the backdrop state. |

::

| Attribute             | Description                                 |
| :-------------------- | :------------------------------------------ |
| `data-open`           | Present when the select is open.            |
| `data-closed`         | Present when the select is closed.          |
| `data-starting-style` | Present when the backdrop is animating in.  |
| `data-ending-style`   | Present when the backdrop is animating out. |

### Portal

A portal that moves the popup out to `<body>`, clear of ancestor clipping and stacking.
Renders a `<div>` element.
The portal renders while the popup is mounted, and stays rendered from the first time the trigger is focused, so the items exist for closed-trigger typeahead. `keepMounted` keeps it rendered beyond that.

::table{columns="Prop,Type,Default"}

| Prop          | Type                  | Default | Description                                                                                                   |
| :------------ | :-------------------- | :------ | :------------------------------------------------------------------------------------------------------------ |
| `keepMounted` | `boolean`             | `false` | Whether to keep the contents mounted while the popup is closed.                                               |
| `container`   | `HTMLElement \| null` | —       | Parent element to render the portal into. Defaults to the nearest ancestor portal, otherwise `document.body`. |

::

### Positioner

Positions the select popup.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop                    | Type                                                                       | Default                        | Description                                                       |
| :---------------------- | :------------------------------------------------------------------------- | :----------------------------- | :---------------------------------------------------------------- |
| `as`                    | `keyof HTMLElementTagNameMap \| Component`                                 | `'div'`                        | HTML element to render.                                           |
| `class`                 | `string`                                                                   | —                              | CSS class applied to the element.                                 |
| `style`                 | `string`                                                                   | —                              | Inline style applied to the element.                              |
| `side`                  | `'top' \| 'bottom' \| 'left' \| 'right' \| 'inline-start' \| 'inline-end'` | `'bottom'`                     | Side to position the popup on.                                    |
| `align`                 | `'start' \| 'center' \| 'end'`                                             | `'center'`                     | Alignment of the popup along the side.                            |
| `sideOffset`            | `number \| OffsetFunction`                                                 | `0`                            | Distance in px from the anchor.                                   |
| `alignOffset`           | `number \| OffsetFunction`                                                 | `0`                            | Offset in px along the alignment axis.                            |
| `collisionBoundary`     | `'clipping-ancestors' \| Element \| Element[] \| { x, y, width, height }`  | `'clipping-ancestors'`         | Boundary for collision detection.                                 |
| `collisionPadding`      | `number \| Padding`                                                        | `5`                            | Padding around the collision boundary.                            |
| `collisionAvoidance`    | `CollisionAvoidance`                                                       | `{ fallbackAxisSide: 'none' }` | Strategy to avoid collisions.                                     |
| `sticky`                | `boolean`                                                                  | `false`                        | Whether to keep the popup in view when the anchor is scrolled.    |
| `arrowPadding`          | `number`                                                                   | `5`                            | Padding between the arrow and the popup edges.                    |
| `disableAnchorTracking` | `boolean`                                                                  | `false`                        | Whether to disable tracking of the anchor's position as it moves. |
| `anchor`                | `Element \| VirtualAnchorElement \| null`                                  | trigger element                | Element to anchor the positioner to.                              |
| `positionMethod`        | `'absolute' \| 'fixed'`                                                    | `'absolute'`                   | CSS position strategy to use.                                     |
| `default`               | `Slot<{ open, side, align, anchorHidden }>`                                | —                              | Positioner content; receives the positioner's state.              |

::

| Attribute            | Description                                    |
| :------------------- | :--------------------------------------------- |
| `data-open`          | Present when the popup is open.                |
| `data-closed`        | Present when the popup is closed.              |
| `data-side`          | Which side of the anchor the popup is on.      |
| `data-align`         | How the popup is aligned relative to the side. |
| `data-anchor-hidden` | Present when the anchor is hidden.             |

| CSS Variable         | Description                                                |
| :------------------- | :--------------------------------------------------------- |
| `--available-width`  | Available width between the anchor and the viewport edge.  |
| `--available-height` | Available height between the anchor and the viewport edge. |
| `--anchor-width`     | Width of the anchor element.                               |
| `--anchor-height`    | Height of the anchor element.                              |
| `--transform-origin` | Transform origin for scale animations.                     |

### Popup

A container for the select list.
Renders a `<div>` element.
It carries the `listbox` role itself when no `<Select.List>` is rendered.

::table{columns="Prop,Type,Default"}

| Prop         | Type                                                                                   | Default | Description                                                                                                                                        |
| :----------- | :------------------------------------------------------------------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------- |
| `as`         | `keyof HTMLElementTagNameMap \| Component`                                             | `'div'` | HTML element to render.                                                                                                                            |
| `class`      | `string`                                                                               | —       | CSS class applied to the element.                                                                                                                  |
| `style`      | `string`                                                                               | —       | Inline style applied to the element.                                                                                                               |
| `id`         | `string`                                                                               | —       | Custom element ID. With no `<Select.List>` rendered, the popup falls back to the generated list id and the trigger's `aria-controls` points at it. |
| `finalFocus` | `boolean \| HTMLElement \| ((type: string) => HTMLElement \| boolean \| null \| void)` | —       | Element to focus when the popup closes, or a function receiving the interaction type. `false` to skip; defaults to the trigger.                    |
| `default`    | `Slot<{ open, transitionStatus, side, align }>`                                        | —       | Popup content; receives the popup's state.                                                                                                         |

::

| Attribute             | Description                                    |
| :-------------------- | :--------------------------------------------- |
| `data-open`           | Present when the select is open.               |
| `data-closed`         | Present when the select is closed.             |
| `data-side`           | Which side of the anchor the popup is on.      |
| `data-align`          | How the popup is aligned relative to the side. |
| `data-starting-style` | Present when the popup is animating in.        |
| `data-ending-style`   | Present when the popup is animating out.       |

### List

The `listbox` and the element that scrolls the items. Optional. Without it the popup takes both roles.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop    | Type                                       | Default | Description                          |
| :------ | :----------------------------------------- | :------ | :----------------------------------- |
| `as`    | `keyof HTMLElementTagNameMap \| Component` | `'div'` | HTML element to render.              |
| `class` | `string`                                   | —       | CSS class applied to the element.    |
| `style` | `string`                                   | —       | Inline style applied to the element. |
| `id`    | `string`                                   | auto    | Custom element ID.                   |

::

### Arrow

Displays an element positioned against the anchor.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop      | Type                                       | Default | Description                          |
| :-------- | :----------------------------------------- | :------ | :----------------------------------- |
| `as`      | `keyof HTMLElementTagNameMap \| Component` | `'div'` | HTML element to render.              |
| `class`   | `string`                                   | —       | CSS class applied to the element.    |
| `style`   | `string`                                   | —       | Inline style applied to the element. |
| `default` | `Slot<{ open, side, align, uncentered }>`  | —       | Content; receives the arrow state.   |

::

| Attribute         | Description                                    |
| :---------------- | :--------------------------------------------- |
| `data-open`       | Present when the popup is open.                |
| `data-closed`     | Present when the popup is closed.              |
| `data-side`       | Which side of the anchor the popup is on.      |
| `data-align`      | How the popup is aligned relative to the side. |
| `data-uncentered` | Present when the arrow cannot be centered.     |

### Item

An individual item in the select popup.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop       | Type                                        | Default | Description                              |
| :--------- | :------------------------------------------ | :------ | :--------------------------------------- |
| `as`       | `keyof HTMLElementTagNameMap \| Component`  | `'div'` | HTML element to render.                  |
| `class`    | `string`                                    | —       | CSS class applied to the element.        |
| `style`    | `string`                                    | —       | Inline style applied to the element.     |
| `value`    | `unknown`                                   | `null`  | The value this item represents.          |
| `disabled` | `boolean`                                   | `false` | Whether this item is disabled.           |
| `default`  | `Slot<{ selected, highlighted, disabled }>` | —       | Item content; receives the item's state. |

::

| Attribute          | Description                                   |
| :----------------- | :-------------------------------------------- |
| `data-selected`    | Present when this item is the selected value. |
| `data-highlighted` | Present when the item is highlighted.         |
| `data-disabled`    | Present when disabled.                        |

### ItemIndicator

Indicates whether the select item is selected.
Renders a `<span>` element, containing a ✔️ glyph when given no children.

::table{columns="Prop,Type,Default"}

| Prop          | Type                                       | Default  | Description                                                 |
| :------------ | :----------------------------------------- | :------- | :---------------------------------------------------------- |
| `as`          | `keyof HTMLElementTagNameMap \| Component` | `'span'` | HTML element to render.                                     |
| `class`       | `string`                                   | —        | CSS class applied to the element.                           |
| `style`       | `string`                                   | —        | Inline style applied to the element.                        |
| `keepMounted` | `boolean`                                  | `false`  | Whether to keep the indicator in the DOM when not selected. |
| `default`     | `Slot<{ selected, transitionStatus }>`     | —        | Indicator content; receives the indicator's state.          |

::

| Attribute             | Description                                  |
| :-------------------- | :------------------------------------------- |
| `data-selected`       | Present when the item is selected.           |
| `data-starting-style` | Present when the indicator is animating in.  |
| `data-ending-style`   | Present when the indicator is animating out. |

### Group

Groups related select items with the corresponding label.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop    | Type                                       | Default | Description                          |
| :------ | :----------------------------------------- | :------ | :----------------------------------- |
| `as`    | `keyof HTMLElementTagNameMap \| Component` | `'div'` | HTML element to render.              |
| `class` | `string`                                   | —       | CSS class applied to the element.    |
| `style` | `string`                                   | —       | Inline style applied to the element. |

::

### GroupLabel

An accessible label that is automatically associated with its parent group.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop    | Type                                       | Default | Description                          |
| :------ | :----------------------------------------- | :------ | :----------------------------------- |
| `as`    | `keyof HTMLElementTagNameMap \| Component` | `'div'` | HTML element to render.              |
| `class` | `string`                                   | —       | CSS class applied to the element.    |
| `style` | `string`                                   | —       | Inline style applied to the element. |
| `id`    | `string`                                   | auto    | Custom element ID.                   |

::

### ScrollUpArrow

An element that scrolls the list up while hovered. Never visible when the popup was opened by touch.
Renders an absolutely positioned `<div>` element, containing a ▲ glyph when given no children.

::table{columns="Prop,Type,Default"}

| Prop          | Type                                                   | Default | Description                                            |
| :------------ | :----------------------------------------------------- | :------ | :----------------------------------------------------- |
| `as`          | `keyof HTMLElementTagNameMap \| Component`             | `'div'` | HTML element to render.                                |
| `class`       | `string`                                               | —       | CSS class applied to the element.                      |
| `style`       | `string`                                               | —       | Inline style applied to the element.                   |
| `keepMounted` | `boolean`                                              | `false` | Whether to keep the arrow in the DOM when not visible. |
| `default`     | `Slot<{ direction, visible, side, transitionStatus }>` | —       | Arrow content; receives the scroll arrow's state.      |

::

| Attribute             | Description                                           |
| :-------------------- | :---------------------------------------------------- |
| `data-direction`      | Indicates the direction of the scroll arrow (`'up'`). |
| `data-side`           | Which side of the anchor the popup is on.             |
| `data-visible`        | Present when the scroll arrow is visible.             |
| `data-starting-style` | Present when the scroll arrow is animating in.        |
| `data-ending-style`   | Present when the scroll arrow is animating out.       |

### ScrollDownArrow

An element that scrolls the list down while hovered. Never visible when the popup was opened by touch.
Renders an absolutely positioned `<div>` element, containing a ▼ glyph when given no children.

::table{columns="Prop,Type,Default"}

| Prop          | Type                                                   | Default | Description                                            |
| :------------ | :----------------------------------------------------- | :------ | :----------------------------------------------------- |
| `as`          | `keyof HTMLElementTagNameMap \| Component`             | `'div'` | HTML element to render.                                |
| `class`       | `string`                                               | —       | CSS class applied to the element.                      |
| `style`       | `string`                                               | —       | Inline style applied to the element.                   |
| `keepMounted` | `boolean`                                              | `false` | Whether to keep the arrow in the DOM when not visible. |
| `default`     | `Slot<{ direction, visible, side, transitionStatus }>` | —       | Arrow content; receives the scroll arrow's state.      |

::

| Attribute             | Description                                             |
| :-------------------- | :------------------------------------------------------ |
| `data-direction`      | Indicates the direction of the scroll arrow (`'down'`). |
| `data-side`           | Which side of the anchor the popup is on.               |
| `data-visible`        | Present when the scroll arrow is visible.               |
| `data-starting-style` | Present when the scroll arrow is animating in.          |
| `data-ending-style`   | Present when the scroll arrow is animating out.         |

### Separator

A visual divider between groups of items. Rendered as `role="presentation"`, because
`role="separator"` is not valid inside a `listbox`.
Renders a `<div>` element.

::table{columns="Prop,Type,Default"}

| Prop          | Type                                       | Default        | Description                          |
| :------------ | :----------------------------------------- | :------------- | :----------------------------------- |
| `as`          | `keyof HTMLElementTagNameMap \| Component` | `'div'`        | HTML element to render.              |
| `class`       | `string`                                   | —              | CSS class applied to the element.    |
| `style`       | `string`                                   | —              | Inline style applied to the element. |
| `orientation` | `'horizontal' \| 'vertical'`               | `'horizontal'` | The orientation of the separator.    |

::

| Attribute          | Description                                 |
| :----------------- | :------------------------------------------ |
| `data-orientation` | Indicates the orientation of the separator. |
