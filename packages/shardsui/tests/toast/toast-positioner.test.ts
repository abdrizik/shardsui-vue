import { Toast } from '@/components/toast'
import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { isJSDOM } from '../test-utils'
import AnchoredPositionerToast from './fixtures/anchored-positioner-toast.vue'
import PositionerIndexToast from './fixtures/positioner-index-toast.vue'
import PositionerOverrideToast from './fixtures/positioner-override-toast.vue'
import PositionerToast from './fixtures/positioner-toast.vue'

describe('<Toast.Positioner />', () => {
  it.skipIf(isJSDOM)('positions an anchored toast against its anchor element', async () => {
    render(AnchoredPositionerToast, { props: { sideOffset: 8 } })

    const anchor = screen.getByRole('button', { name: 'anchor' })
    fireEvent.click(anchor)

    const positioner = await screen.findByTestId('anchored')
    await waitFor(() => expect(positioner).toHaveAttribute('data-side', 'bottom'))

    const anchorRect = anchor.getBoundingClientRect()
    await waitFor(() =>
      expect(positioner.getBoundingClientRect().top).toBeCloseTo(anchorRect.bottom + 8, 0)
    )
  })

  it('falls back to the viewport when no anchor is provided', async () => {
    render(PositionerToast)

    fireEvent.click(screen.getByTestId('add-button'))

    const positioner = await screen.findByTestId('positioner')
    expect(positioner).toHaveAttribute('data-side', 'top')
    expect(positioner).toHaveAttribute('data-align', 'center')
    expect(positioner).toHaveAttribute('role', 'presentation')
    expect(positioner).toHaveTextContent('title')
  })

  it('lets positioner props override the ones carried on the toast', async () => {
    render(PositionerOverrideToast)

    fireEvent.click(screen.getByTestId('add-button'))

    const positioner = await screen.findByTestId('positioner')
    expect(positioner).toHaveAttribute('data-side', 'left')
    expect(positioner).toHaveAttribute('data-align', 'end')
  })

  describe('--toast-index', () => {
    it('keeps the DOM index while a toast animates out', async () => {
      render(PositionerIndexToast)

      fireEvent.click(screen.getByTestId('add-oldest'))
      fireEvent.click(screen.getByTestId('add-newest'))
      await nextTick()

      const newest = screen.getByTestId('newest')
      const oldest = screen.getByTestId('oldest')

      expect(newest.style.getPropertyValue('--toast-index')).toBe('0')
      expect(oldest.style.getPropertyValue('--toast-index')).toBe('1')

      fireEvent.click(screen.getByTestId('close-newest'))
      await nextTick()

      expect(newest.style.getPropertyValue('--toast-index')).toBe('0')
      expect(oldest.style.getPropertyValue('--toast-index')).toBe('0')
    })
  })

  it('throws a descriptive error when rendered outside <Toast.Provider>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() =>
        render(Toast.Positioner, { props: { toast: { id: 'test', title: 'Toast title' } } })
      ).toThrow('ShardsUI: this part must be rendered inside <Toast.Provider>.')
    } finally {
      warn.mockRestore()
    }
  })
})
