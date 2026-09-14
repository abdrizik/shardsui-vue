<script setup lang="ts">
import { createApp, onWatcherCleanup, useTemplateRef, watchPostEffect } from 'vue'
import FocusManagerIframePopover from './focus-manager-iframe-popover.vue'

const innerRoot = useTemplateRef<HTMLDivElement>('innerRoot')

// The about:blank navigation replaces the initial document asynchronously, so the popover is
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

      app = createApp(FocusManagerIframePopover)
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
  <a href="#">Outside link 1</a>
  <div ref="innerRoot"></div>
  <a href="#">Outside link 2</a>
</template>
