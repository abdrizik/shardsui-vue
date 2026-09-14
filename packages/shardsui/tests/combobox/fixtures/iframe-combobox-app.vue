<script setup lang="ts">
import { createApp, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import IframeModalCombobox from './iframe-modal-combobox.vue'

const innerRoot = useTemplateRef<HTMLDivElement>('innerRoot')

// The about:blank navigation replaces the initial document asynchronously, so the combobox is
// mounted once the frame has loaded.
watchPostEffect(() => {
  const container = innerRoot.value
  if (!container) return

  const iframe = document.createElement('iframe')
  iframe.setAttribute('data-testid', 'iframe')
  iframe.src = 'about:blank'
  iframe.style.height = '300px'

  let app: ReturnType<typeof createApp> | undefined

  iframe.addEventListener(
    'load',
    () => {
      const iframeDocument = iframe.contentWindow?.document
      if (!iframeDocument) return

      const root = iframeDocument.createElement('div')
      root.id = 'rootIframe'
      iframeDocument.body.appendChild(root)

      app = createApp(IframeModalCombobox)
      app.mount(root)
    },
    { once: true }
  )

  container.appendChild(iframe)

  onWatcherCleanup(() => {
    app?.unmount()
    iframe.remove()
  })
})
</script>

<template>
  <div ref="innerRoot"></div>
</template>
