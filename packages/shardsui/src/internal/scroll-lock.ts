import { onWatcherCleanup, toValue, watchPostEffect, type MaybeRefOrGetter } from 'vue'
import { createAnimationFrame } from './animation-frame'
import { isIOS, isWebKit } from './detect-browser'
import { isOverflowElement, listen } from './dom'

function ownerDocument(node: Element | null): Document {
  return node?.ownerDocument ?? document
}

function ownerWindow(node: Element | Document): Window & typeof globalThis {
  const doc = 'defaultView' in node ? node : node.ownerDocument
  return doc.defaultView ?? window
}

function getViewportScroller(html: HTMLElement, body: HTMLElement): HTMLElement {
  return isOverflowElement(html) ? html : body
}

function isPageScrollLocked(win: Window, html: HTMLElement, body: HTMLElement): boolean {
  return /hidden|clip/.test(win.getComputedStyle(getViewportScroller(html, body)).overflowY)
}

function hasInsetScrollbars(referenceElement: Element | null): boolean {
  const doc = ownerDocument(referenceElement)
  const win = ownerWindow(doc)
  return win.innerWidth - doc.documentElement.clientWidth > 0
}

function preventScrollOverlayScrollbars(referenceElement: Element | null): () => void {
  const doc = ownerDocument(referenceElement)
  const html = doc.documentElement
  const body = doc.body

  // A lock on <body> has no effect while <html> carries an `overflow` style; locking <html>
  // when <body> carries one instead shifts sticky elements.
  const elementToLock = getViewportScroller(html, body)
  const originalElementToLockStyles = {
    overflowY: elementToLock.style.overflowY,
    overflowX: elementToLock.style.overflowX
  }

  Object.assign(elementToLock.style, {
    overflowY: 'hidden',
    overflowX: 'hidden'
  })

  return () => {
    Object.assign(elementToLock.style, originalElementToLockStyles)
  }
}

function preventScrollInsetScrollbars(referenceElement: Element | null): () => void {
  const doc = ownerDocument(referenceElement)
  const html = doc.documentElement
  const body = doc.body
  const win = ownerWindow(html)

  let originalHtmlStyles: Partial<CSSStyleDeclaration> = {}
  let originalBodyStyles: Partial<CSSStyleDeclaration> = {}
  const resizeFrame = createAnimationFrame()

  // Pinch-zoom in Safari causes a shift.
  if (isWebKit && (win.visualViewport?.scale ?? 1) !== 1) {
    return () => {}
  }

  function lockScroll() {
    const htmlScrollbarGutterValue = win.getComputedStyle(html).scrollbarGutter || ''
    const hasBothEdges = htmlScrollbarGutterValue.includes('both-edges')
    const scrollbarGutterValue = hasBothEdges ? 'stable both-edges' : 'stable'

    originalHtmlStyles = {
      scrollbarGutter: html.style.scrollbarGutter,
      overflowY: html.style.overflowY,
      overflowX: html.style.overflowX
    }

    const elementToLock = getViewportScroller(html, body)
    originalBodyStyles = {
      overflowY: body.style.overflowY,
      overflowX: body.style.overflowX
    }

    html.style.scrollbarGutter = scrollbarGutterValue
    elementToLock.style.overflowY = 'hidden'
    elementToLock.style.overflowX = 'hidden'
  }

  function cleanup() {
    Object.assign(html.style, originalHtmlStyles)
    Object.assign(body.style, originalBodyStyles)
  }

  function onresize() {
    cleanup()
    resizeFrame.request(lockScroll)
  }

  lockScroll()
  const off = listen(win, 'resize', onresize)

  return () => {
    resizeFrame.cancel()
    cleanup()
    off()
  }
}

type ScrollLocker = {
  acquire: (referenceElement: Element | null) => () => void
  release: () => void
}

function createScrollLocker(): ScrollLocker {
  let lockCount = 0
  let restore: (() => void) | null = null
  let lockTimeout: ReturnType<typeof setTimeout> | undefined
  let unlockTimeout: ReturnType<typeof setTimeout> | undefined

  function unlock(): void {
    if (lockCount === 0 && restore) {
      restore()
      restore = null
    }
  }

  function lock(referenceElement: Element | null): void {
    if (lockCount === 0 || restore !== null) {
      return
    }

    const doc = ownerDocument(referenceElement)
    const html = doc.documentElement
    const body = doc.body
    const win = ownerWindow(html)
    if (isPageScrollLocked(win, html, body)) {
      const observer = new win.MutationObserver(() => {
        if (isPageScrollLocked(win, html, body)) return
        observer.disconnect()
        restore = null
        lock(referenceElement)
      })
      const options: MutationObserverInit = { attributes: true }
      observer.observe(html, options)
      observer.observe(body, options)

      restore = () => observer.disconnect()
      return
    }

    const hasOverlayScrollbars = isIOS || !hasInsetScrollbars(referenceElement)

    // On iOS, scroll locking does not work if the navbar is collapsed.
    restore = hasOverlayScrollbars
      ? preventScrollOverlayScrollbars(referenceElement)
      : preventScrollInsetScrollbars(referenceElement)
  }

  function release(): void {
    lockCount -= 1
    if (lockCount === 0 && restore) {
      clearTimeout(unlockTimeout)
      unlockTimeout = setTimeout(unlock, 0)
    }
  }

  return {
    // Lock and unlock are deferred a tick so one popup closing as another opens keeps the existing
    // lock instead of unlocking and relocking, which would lose the scroll position.
    acquire(referenceElement) {
      lockCount += 1
      if (lockCount === 1 && restore === null) {
        clearTimeout(lockTimeout)
        lockTimeout = setTimeout(() => lock(referenceElement), 0)
      }
      return release
    },

    release
  }
}

const SCROLL_LOCKER = createScrollLocker()

type ScrollLockOptions = {
  enabled: MaybeRefOrGetter<boolean>
  referenceElement?: MaybeRefOrGetter<Element | null | undefined>
}

export function useScrollLock(options: ScrollLockOptions): void {
  watchPostEffect(() => {
    const enabled = toValue(options.enabled)
    const referenceElement = toValue(options.referenceElement)
    if (!enabled) return

    onWatcherCleanup(SCROLL_LOCKER.acquire(referenceElement ?? null))
  })
}
