![](docs/public/favicon.svg)

# @shardsui/vue

Headless, accessible UI components for **Vue 3**.

Unstyled, composable component parts with full ARIA, keyboard, and focus management.

[Documentation](https://vue.shardsui.com)

## Install

```sh
npm i @shardsui/vue
```

Requires `vue@^3.5`

## Usage

```vue
<script setup>
import { Dialog } from '@shardsui/vue/dialog'
</script>

<template>
  <Dialog.Root>
    <Dialog.Trigger>Open</Dialog.Trigger>
    <Dialog.Portal>
      <Dialog.Backdrop />
      <Dialog.Popup>
        <Dialog.Title>Title</Dialog.Title>
        <Dialog.Close>Close</Dialog.Close>
      </Dialog.Popup>
    </Dialog.Portal>
  </Dialog.Root>
</template>
```

## Browser support

Chrome and Edge 121, Firefox 97, and Safari 18.2 or later.

## License

MIT — see [LICENSE](./LICENSE). Adapted from [Base UI](https://base-ui.com) (MIT © Material-UI SAS)
and rebuilt on the Composition API with a Vue-native API; `internal/floating/` derives from
[Floating UI](https://floating-ui.com) (MIT © Floating UI contributors).
