import { render, screen, waitFor } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { isJSDOM } from '../test-utils'
import AnchorWidthCombobox from './fixtures/anchor-width-combobox.vue'
import ArrowOutsidePositioner from './fixtures/arrow-outside-positioner.vue'
import CappedHeightCombobox from './fixtures/capped-height-combobox.vue'
import IframeComboboxApp from './fixtures/iframe-combobox-app.vue'
import MultipleCombobox from './fixtures/multiple-combobox.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false
  }
})

describe('<Combobox.Positioner />', () => {
  it('throws a descriptive error when a required consumer is outside the positioner', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(ArrowOutsidePositioner)).toThrow(
        'ShardsUI: this part must be rendered inside <Combobox.Positioner>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('leaves the document scrollable while a controlled empty multi-select stays closed', async () => {
    document.body.removeAttribute('style')
    document.documentElement.removeAttribute('style')

    render(MultipleCombobox, { props: { value: [] } })

    await waitFor(() => expect(screen.getByRole('combobox')).toBeInTheDocument())

    expect(document.body.style.overflowX).not.toBe('hidden')
    expect(document.body.style.overflowY).not.toBe('hidden')
    expect(document.documentElement.style.overflowX).not.toBe('hidden')
    expect(document.documentElement.style.overflowY).not.toBe('hidden')
  })

  it.skipIf(!isJSDOM)('locks scrolling in the document that owns the combobox', async () => {
    document.body.removeAttribute('style')
    document.documentElement.removeAttribute('style')

    render(IframeComboboxApp)

    const iframe = (await screen.findByTestId('iframe')) as HTMLIFrameElement
    const iframeDocument = iframe.contentDocument ?? iframe.contentWindow?.document
    expect(iframeDocument).not.toBeUndefined()

    await waitFor(() => {
      const html = iframeDocument!.documentElement
      const body = iframeDocument!.body
      expect(html.style.overflowY === 'hidden' || body.style.overflowY === 'hidden').toBe(true)
    })

    expect(document.body.style.overflowY).not.toBe('hidden')
    expect(document.documentElement.style.overflowY).not.toBe('hidden')
  })

  it.skipIf(isJSDOM)('stays on the preferred side when the capped list fits below', async () => {
    render(CappedHeightCombobox, {})

    await waitFor(() => {
      expect(screen.getByTestId('positioner')).toHaveAttribute('data-side', 'bottom')
    })
  })

  describe.skipIf(isJSDOM)('default anchor', () => {
    it('measures the input when no input group is rendered', async () => {
      const inputWidth = 120
      const triggerWidth = 240
      let anchorWidth = 0

      render(AnchorWidthCombobox, {
        props: {
          inputWidth,
          triggerWidth,
          onAnchorWidth: (width: number) => (anchorWidth = width)
        }
      })

      const input = screen.getByTestId('input')

      await waitFor(() => {
        expect(anchorWidth).toBeCloseTo(input.getBoundingClientRect().width, 0)
      })
      expect(anchorWidth).not.toBeCloseTo(triggerWidth, 0)
    })

    it('measures the input group when one is rendered', async () => {
      const inputGroupWidth = 240
      let anchorWidth = 0

      render(AnchorWidthCombobox, {
        props: {
          withInputGroup: true,
          inputGroupWidth,
          inputWidth: 120,
          onAnchorWidth: (width: number) => (anchorWidth = width)
        }
      })

      await waitFor(() => {
        expect(anchorWidth).toBeCloseTo(inputGroupWidth, 0)
      })
    })
  })
})
