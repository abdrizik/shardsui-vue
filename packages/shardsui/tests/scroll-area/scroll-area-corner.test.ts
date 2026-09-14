import { render, screen, waitFor } from '@testing-library/vue'
import { expect } from 'vitest'
import { isJSDOM } from '../test-utils'
import ConfigurableArea from './fixtures/configurable-area.vue'

describe('<ScrollArea.Corner />', () => {
  describe('rendering', () => {
    it('renders a custom as element', async () => {
      render(ConfigurableArea, {
        props: {
          corner: true,
          cornerAs: 'section',
          keepMounted: true,
          mockMetrics: true
        }
      })
      expect((await screen.findByTestId('corner')).tagName.toLowerCase()).toBe('section')
    })
  })

  describe.skipIf(isJSDOM)('sizing', () => {
    it('applies the correct corner size when both scrollbars are present', async () => {
      render(ConfigurableArea, {
        props: {
          corner: true,
          vScrollbarStyle: 'width: 10px;',
          hScrollbarStyle: 'height: 10px;'
        }
      })

      const corner = await screen.findByTestId('corner')

      await waitFor(() => {
        expect(getComputedStyle(corner).getPropertyValue('--scroll-area-corner-width')).toBe('10px')
      })
      expect(getComputedStyle(corner).getPropertyValue('--scroll-area-corner-height')).toBe('10px')
    })
  })
})
