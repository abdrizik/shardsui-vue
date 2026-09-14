import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import OffsetContextMenu from './fixtures/offset-context-menu.vue'

// `vi.mock` is hoisted per test file, so the non-Mac platform needs a file of its own.
vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return { ...actual, isMac: false }
})

describe('<ContextMenu.Root /> (non-Mac)', () => {
  it('ignores context menu mouseup on non-Mac platforms', async () => {
    const onOpenChange = vi.fn()
    render(OffsetContextMenu, { props: { onOpenChange, alignOffset: 0 } })

    const trigger = screen.getByTestId('context-trigger')
    fireEvent.contextMenu(trigger, { clientX: 12, clientY: 12, button: 2 })

    await screen.findByTestId('context-popup')
    const item = screen.getByTestId('context-item')

    fireEvent.pointerMove(document.body, { clientX: 24, clientY: 24 })
    fireEvent.mouseUp(item, { button: 2, clientX: 24, clientY: 24 })

    await waitFor(() => {
      expect(screen.queryByTestId('context-popup')).not.toBe(null)
    })

    expect(onOpenChange).toHaveBeenCalledTimes(1)
  })
})
