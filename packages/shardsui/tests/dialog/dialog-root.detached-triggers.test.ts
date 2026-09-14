import { Dialog } from '@/components/dialog'
import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, type MockInstance, vi } from 'vitest'
import { nextTick } from 'vue'
import { isJSDOM } from '../test-utils'
import DetachedControlledOpen from './fixtures/detached-controlled-open.vue'
import DetachedMountAction from './fixtures/detached-mount-action.vue'
import DetachedNesting from './fixtures/detached-nesting.vue'
import DetachedOpenByIdOnMount from './fixtures/detached-open-by-id-on-mount.vue'
import DetachedPayload from './fixtures/detached-payload.vue'
import DetachedRootRemount from './fixtures/detached-root-remount.vue'
import MenuDialogDetachedTrigger from './fixtures/menu-dialog-detached-trigger.vue'
import DetachedSharedHandleRoots from './fixtures/detached-shared-handle-roots.vue'
import DetachedTriggerAfterRoot from './fixtures/detached-trigger-after-root.vue'
import DetachedTriggerReparenting from './fixtures/detached-trigger-reparenting.vue'
import ReactivePayloadDetached from './fixtures/reactive-payload-detached.vue'
import ThreeDetachedTriggers from './fixtures/three-detached-triggers.vue'
import TwoDetachedNonModal from './fixtures/two-detached-non-modal.vue'

async function openAndCloseDialog(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', { name: 'Trigger' }))
  await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
  await user.click(screen.getByText('Close'))
  await waitFor(() => expect(screen.queryByText('Dialog Content')).toBe(null))
}

function warningsMatching(spy: MockInstance<typeof console.warn>, text: string) {
  return spy.mock.calls.filter(([message]) => typeof message === 'string' && message.includes(text))
}

async function waitTwoFrames() {
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)))
}

type SharedHandleProps = { handle: Dialog.Handle; phase?: 'outgoing' | 'overlap' | 'incoming' }

async function handOff(
  rerender: (props: SharedHandleProps) => Promise<void>,
  handle: Dialog.Handle,
  final: 'incoming' | 'outgoing' = 'incoming'
) {
  await rerender({ handle, phase: 'overlap' })
  await rerender({ handle, phase: final })
}

describe('<Dialog.Root />', () => {
  describe('handle-backed root ownership', () => {
    it('ignores imperative handle calls made before a root is attached', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle<number>()

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      handle.open('trigger')
      handle.close()
      expect(handle.isOpen).toBe(false)
      expect(warningsMatching(warnSpy, 'no root using this handle is mounted')).toHaveLength(2)
      warnSpy.mockRestore()

      render(DetachedRootRemount, { props: { handle } })

      expect(screen.queryByText('Dialog Content')).toBe(null)
      expect(screen.getByTestId('payload').textContent).toBe('No payload')

      await user.click(screen.getByRole('button', { name: 'Trigger' }))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
      expect(screen.getByTestId('payload').textContent).toBe('1')
    })

    it('ignores imperative handle calls made after the root is detached', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle<number>()
      render(DetachedRootRemount, { props: { handle } })

      await user.click(screen.getByRole('button', { name: 'Trigger' }))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
      expect(screen.getByTestId('payload').textContent).toBe('1')

      await user.click(screen.getByRole('button', { name: 'Unmount Root' }))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).toBe(null))
      expect(handle.isOpen).toBe(false)

      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      handle.open('trigger')
      handle.close()
      warnSpy.mockRestore()
      expect(handle.isOpen).toBe(false)
      expect(screen.queryByText('Dialog Content')).toBe(null)

      await user.click(screen.getByRole('button', { name: 'Toggle Root' }))
      await waitFor(() => expect(screen.queryByTestId('payload')).not.toBe(null))
      expect(screen.getByTestId('payload').textContent).toBe('No payload')
      expect(screen.queryByText('Dialog Content')).toBe(null)

      await user.click(screen.getByRole('button', { name: 'Trigger' }))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
      expect(screen.getByTestId('payload').textContent).toBe('1')
    })

    it('opens from a descendant mount effect on initial mount', async () => {
      const handle = Dialog.createHandle<number>()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(DetachedMountAction, { props: { handle, action: () => handle.open(null) } })

      expect(warningsMatching(warnSpy, 'no root using this handle is mounted')).toHaveLength(0)
      warnSpy.mockRestore()
      expect(handle.isOpen).toBe(true)
    })

    it('opens with a payload from a descendant mount effect on initial mount', async () => {
      const handle = Dialog.createHandle<number>()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(DetachedMountAction, { props: { handle, action: () => handle.openWithPayload(8) } })
      await nextTick()

      expect(warningsMatching(warnSpy, 'no root using this handle is mounted')).toHaveLength(0)
      warnSpy.mockRestore()
      expect(handle.isOpen).toBe(true)
      expect(screen.getByTestId('payload').textContent).toBe('8')
    })

    it('closes from a descendant mount effect on an initially open root', async () => {
      const handle = Dialog.createHandle<number>()
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

      render(DetachedMountAction, { props: { handle, open: true, action: () => handle.close() } })

      expect(warningsMatching(warnSpy, 'no root using this handle is mounted')).toHaveLength(0)
      warnSpy.mockRestore()
      expect(handle.isOpen).toBe(false)
    })

    it('registers a detached trigger declared after the root', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle()
      render(DetachedTriggerAfterRoot, { props: { handle } })

      const trigger = screen.getByRole('button', { name: 'Trigger' })

      await user.click(trigger)
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))

      expect(trigger).toHaveAttribute('aria-expanded', 'true')
      expect(trigger.getAttribute('aria-controls')).toBe(
        screen.getByRole('dialog').getAttribute('id')
      )
    })

    it('associates the requested trigger when opened by id in the same commit a root attaches', async () => {
      const handle = Dialog.createHandle<number>()
      render(DetachedOpenByIdOnMount, { props: { handle } })

      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))

      const requestedTrigger = screen.getByText('Trigger')
      const otherTrigger = screen.getByText('Other')
      expect(requestedTrigger).toHaveAttribute('aria-expanded', 'true')
      expect(requestedTrigger.getAttribute('aria-controls')).toBe(
        screen.getByRole('dialog').getAttribute('id')
      )
      expect(otherTrigger).not.toHaveAttribute('aria-controls')
      expect(screen.getByTestId('payload').textContent).toBe('5')
    })

    it('associates an imperative open-by-id with a persistent detached trigger after the root remounts', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle<number>()
      render(DetachedRootRemount, { props: { handle } })
      const trigger = screen.getByRole('button', { name: 'Trigger' })

      await user.click(trigger)
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))

      await user.click(screen.getByRole('button', { name: 'Unmount Root' }))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).toBe(null))

      await user.click(screen.getByRole('button', { name: 'Toggle Root' }))
      await waitFor(() => expect(screen.queryByTestId('payload')).not.toBe(null))

      handle.open('trigger')
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
      expect(handle.isOpen).toBe(true)
      expect(screen.getByTestId('payload').textContent).toBe('1')
      expect(trigger).toHaveAttribute('aria-expanded', 'true')
    })

    describe('multiple roots sharing one handle', () => {
      it('does not warn when one root replaces another during a route transition', async () => {
        const handle = Dialog.createHandle()
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        const { rerender } = render(DetachedSharedHandleRoots, {
          props: { handle, phase: 'outgoing' }
        })
        await handOff(rerender, handle)

        await waitTwoFrames()

        expect(warningsMatching(warnSpy, 'more than one mounted root')).toHaveLength(0)
        warnSpy.mockRestore()
      })

      it('keeps the newer root attached after the older root unmounts', async () => {
        const handle = Dialog.createHandle()

        const { rerender } = render(DetachedSharedHandleRoots, {
          props: { handle, phase: 'outgoing' }
        })
        await handOff(rerender, handle)

        handle.open(null)
        await waitFor(() => expect(screen.queryByText('Incoming')).not.toBe(null))
        expect(screen.queryByText('Outgoing')).toBe(null)
        expect(handle.isOpen).toBe(true)
      })

      it('restores control to the previous root when a newer overlapping root detaches', async () => {
        const handle = Dialog.createHandle()

        const { rerender } = render(DetachedSharedHandleRoots, {
          props: { handle, phase: 'outgoing' }
        })
        await handOff(rerender, handle, 'outgoing')

        handle.open(null)
        await waitFor(() => expect(screen.queryByText('Outgoing')).not.toBe(null))
        expect(screen.queryByText('Incoming')).toBe(null)
        expect(handle.isOpen).toBe(true)
      })

      it('warns when a handle stays attached to more than one mounted root', async () => {
        const handle = Dialog.createHandle()
        const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

        render(DetachedSharedHandleRoots, { props: { handle, phase: 'overlap' } })
        await waitTwoFrames()

        expect(warningsMatching(warnSpy, 'more than one mounted root')).toHaveLength(1)
        warnSpy.mockRestore()
      })
    })
  })

  describe.skipIf(isJSDOM)('multiple detached triggers', () => {
    it('opens the dialog with any of multiple detached triggers', async () => {
      const user = userEvent.setup()
      render(ThreeDetachedTriggers)

      const trigger1 = screen.getByRole('button', { name: 'Trigger 1' })
      const trigger2 = screen.getByRole('button', { name: 'Trigger 2' })
      const trigger3 = screen.getByRole('button', { name: 'Trigger 3' })

      expect(screen.queryByText('Dialog Content')).toBe(null)

      await user.click(trigger1)
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
      await user.click(screen.getByText('Close'))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).toBe(null))

      await user.click(trigger2)
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
      await user.click(screen.getByText('Close'))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).toBe(null))

      await user.click(trigger3)
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))
    })

    it('keeps detached triggers clickable when the handle is recreated', async () => {
      const user = userEvent.setup()
      const { rerender } = render(DetachedNesting, {
        props: { handle: Dialog.createHandle(), nesting: 0 }
      })

      await openAndCloseDialog(user)

      await rerender({ handle: Dialog.createHandle(), nesting: 0 })
      await openAndCloseDialog(user)

      await rerender({ handle: Dialog.createHandle(), nesting: 0 })
      await openAndCloseDialog(user)
    })

    it('re-attaches the same handle when the root remounts', async () => {
      const user = userEvent.setup()
      render(DetachedRootRemount, { props: { handle: Dialog.createHandle<number>() } })

      await openAndCloseDialog(user)

      await user.click(screen.getByRole('button', { name: 'Toggle Root' }))
      await user.click(screen.getByRole('button', { name: 'Toggle Root' }))

      await openAndCloseDialog(user)
    })

    it('keeps ARIA controls in sync when a detached handle is recreated while open', async () => {
      const { rerender } = render(DetachedControlledOpen, {
        props: { handle: Dialog.createHandle() }
      })

      let trigger = screen.getByRole('button', { name: 'Trigger' })
      let popup = await screen.findByTestId('popup')
      await waitFor(() =>
        expect(trigger.getAttribute('aria-controls')).toBe(popup.getAttribute('id'))
      )

      await rerender({ handle: Dialog.createHandle() })

      trigger = screen.getByRole('button', { name: 'Trigger' })
      popup = await screen.findByTestId('popup')
      await waitFor(() =>
        expect(trigger.getAttribute('aria-controls')).toBe(popup.getAttribute('id'))
      )
    })

    it('keeps detached triggers clickable when reparented during handle recreation', async () => {
      const user = userEvent.setup()
      const { rerender } = render(DetachedNesting, {
        props: { handle: Dialog.createHandle(), nesting: 3 }
      })

      await openAndCloseDialog(user)

      await rerender({ handle: Dialog.createHandle(), nesting: 2 })
      await openAndCloseDialog(user)

      await rerender({ handle: Dialog.createHandle(), nesting: 1 })
      await openAndCloseDialog(user)

      await rerender({ handle: Dialog.createHandle(), nesting: 0 })
      await openAndCloseDialog(user)
    })

    it('closes a non-modal dialog with Escape from an inactive detached trigger', async () => {
      const user = userEvent.setup()
      render(TwoDetachedNonModal)

      await user.click(screen.getByRole('button', { name: 'Trigger 1' }))
      await waitFor(() => expect(screen.queryByText('Dialog Content')).not.toBe(null))

      const inactiveTrigger = screen.getByRole('button', { name: 'Trigger 2' })
      inactiveTrigger.focus()
      await user.keyboard('{Escape}')

      await waitFor(() => expect(screen.queryByText('Dialog Content')).toBe(null))
    })

    it('sets the payload and renders content based on its value', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle<number>()
      render(DetachedPayload, { props: { handle } })

      const trigger1 = screen.getByRole('button', { name: 'Trigger 1' })
      const trigger2 = screen.getByRole('button', { name: 'Trigger 2' })

      await user.click(trigger1)
      await waitFor(() => expect(screen.getByTestId('content').textContent).toBe('1'))

      await user.click(trigger2)
      await waitFor(() => expect(screen.getByTestId('content').textContent).toBe('2'))
    })

    it('reuses the popup DOM node when switching triggers', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle<number>()
      render(DetachedPayload, { props: { handle } })

      const trigger2 = screen.getByRole('button', { name: 'Trigger 2' })
      await user.click(screen.getByRole('button', { name: 'Trigger 1' }))
      const popupElement = screen.getByTestId('dialog-popup')

      await user.click(trigger2)
      expect(screen.getByTestId('dialog-popup')).toBe(popupElement)
    })

    it('keeps the payload reactive', async () => {
      const user = userEvent.setup()
      const handle = Dialog.createHandle<() => number>()
      render(ReactivePayloadDetached, { props: { handle } })

      await user.click(screen.getByRole('button', { name: 'Dialog 1' }))
      await waitFor(() => expect(screen.getByTestId('content').textContent).toBe('1'))

      await user.click(screen.getByRole('button', { name: 'Update payloads' }))
      await waitFor(() => expect(screen.getByTestId('content').textContent).toBe('8'))
    })

    it('handle.open(triggerId) sets that trigger payload', async () => {
      const handle = Dialog.createHandle<number>()
      render(DetachedPayload, { props: { handle } })
      await nextTick()

      const trigger1 = screen.getByRole('button', { name: 'Trigger 1' })
      const trigger2 = screen.getByRole('button', { name: 'Trigger 2' })

      handle.open('trigger2')
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBe(null))

      expect(screen.getByTestId('content').textContent).toBe('2')
      expect(trigger2).toHaveAttribute('aria-expanded', 'true')
      expect(trigger1).not.toHaveAttribute('aria-expanded', 'true')
    })

    it('handle.openWithPayload renders the given payload value', async () => {
      const handle = Dialog.createHandle<number>()
      render(DetachedPayload, { props: { handle } })
      await nextTick()

      const trigger1 = screen.getByRole('button', { name: 'Trigger 1' })
      const trigger2 = screen.getByRole('button', { name: 'Trigger 2' })

      handle.openWithPayload(8)
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBe(null))

      expect(screen.getByTestId('content').textContent).toBe('8')
      expect(trigger1).not.toHaveAttribute('aria-expanded', 'true')
      expect(trigger2).not.toHaveAttribute('aria-expanded', 'true')
    })
  })

  describe.skipIf(isJSDOM)('detached trigger reparenting', () => {
    it('returns focus to menu trigger when a detached dialog trigger unmounts', async () => {
      const user = userEvent.setup()
      render(MenuDialogDetachedTrigger)

      const menuTrigger = screen.getByRole('button', { name: 'Open menu' })
      await user.click(menuTrigger)

      const menu = await screen.findByRole('menu')
      await waitFor(() => {
        expect(menu.contains(document.activeElement)).toBe(true)
      })

      const dialogTrigger = await screen.findByRole('button', { name: 'Open dialog' })
      await user.click(dialogTrigger)

      await waitFor(() => {
        expect(screen.queryByRole('menu')).toBeNull()
        expect(screen.queryByRole('dialog')).not.toBeNull()
      })

      await user.keyboard('{Escape}')

      await waitFor(() => {
        expect(screen.queryByRole('dialog')).toBeNull()
      })
      await waitFor(() => {
        expect(menuTrigger).toHaveFocus()
      })
    })

    it('stays clickable when reparented (remove wrappers)', async () => {
      const user = userEvent.setup()
      render(DetachedTriggerReparenting, { props: { handle: Dialog.createHandle() } })

      await user.click(screen.getByTestId('set-3'))
      await openAndCloseDialog(user)
      await user.click(screen.getByTestId('set-2'))
      await openAndCloseDialog(user)
      await user.click(screen.getByTestId('set-1'))
      await openAndCloseDialog(user)
      await user.click(screen.getByTestId('set-0'))
      await openAndCloseDialog(user)
    })

    it('stays clickable when reparented (add wrappers)', async () => {
      const user = userEvent.setup()
      render(DetachedTriggerReparenting, { props: { handle: Dialog.createHandle() } })

      await user.click(screen.getByTestId('set-0'))
      await openAndCloseDialog(user)
      await user.click(screen.getByTestId('set-1'))
      await openAndCloseDialog(user)
      await user.click(screen.getByTestId('set-2'))
      await openAndCloseDialog(user)
      await user.click(screen.getByTestId('set-3'))
      await openAndCloseDialog(user)
    })
  })
})
