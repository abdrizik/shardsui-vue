import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { nextTick } from 'vue'
import { isJSDOM } from '../test-utils'
import AnimatedIndicatorMenu from './fixtures/animated-indicator-menu.vue'
import CheckboxItemIndicatorOutsideItem from './fixtures/checkbox-item-indicator-outside-item.vue'
import MenuWithIndicators from './fixtures/menu-with-indicators.vue'
import RadioItemIndicatorOutsideItem from './fixtures/radio-item-indicator-outside-item.vue'

describe('<Menu.CheckboxItemIndicator /> / <Menu.RadioItemIndicator />', () => {
  it('throws when the checkbox indicator is rendered outside <Menu.CheckboxItem>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(CheckboxItemIndicatorOutsideItem)).toThrow(
        'ShardsUI: this part must be rendered inside <Menu.CheckboxItem>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('throws when the radio indicator is rendered outside <Menu.RadioItem>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(RadioItemIndicatorOutsideItem)).toThrow(
        'ShardsUI: this part must be rendered inside <Menu.RadioItem>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it.skipIf(isJSDOM)(
    'removes the checkbox indicator when there is no exit animation defined',
    async () => {
      const user = userEvent.setup()
      render(MenuWithIndicators)

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.queryByTestId('checkbox-indicator')).not.toBeInTheDocument()

      await user.click(screen.getByTestId('checkbox-item'))
      await waitFor(() => expect(screen.getByTestId('checkbox-indicator')).toBeInTheDocument())

      await user.click(screen.getByTestId('checkbox-item'))
      await waitFor(() =>
        expect(screen.queryByTestId('checkbox-indicator')).not.toBeInTheDocument()
      )
    }
  )

  it.skipIf(isJSDOM)(
    'removes the radio indicator when there is no exit animation defined',
    async () => {
      const user = userEvent.setup()
      render(MenuWithIndicators, { props: { value: 'a' } })

      await user.click(screen.getByRole('button', { name: 'Open' }))

      expect(screen.getByTestId('radio-indicator-a')).toBeInTheDocument()
      expect(screen.queryByTestId('radio-indicator-b')).not.toBeInTheDocument()

      await user.click(screen.getByTestId('radio-item-b'))

      await waitFor(() => expect(screen.getByTestId('radio-indicator-b')).toBeInTheDocument())
      expect(screen.queryByTestId('radio-indicator-a')).not.toBeInTheDocument()
    }
  )

  describe.skipIf(isJSDOM)('exit animation', () => {
    beforeEach(() => {
      globalThis.SHARDSUI_ANIMATIONS_DISABLED = false
    })

    it('removes the indicators when the animation finishes', async () => {
      const user = userEvent.setup()
      let animationsFinished = 0
      render(AnimatedIndicatorMenu, {
        props: {
          onAnimationEnd: () => {
            animationsFinished += 1
          }
        }
      })

      expect(screen.getByTestId('checkbox-indicator')).not.toHaveAttribute('hidden')
      expect(screen.getByTestId('radio-indicator')).not.toHaveAttribute('hidden')

      await user.click(screen.getByText('Close'))

      await waitFor(() => expect(animationsFinished).toBe(2))
    })

    it('keeps the indicators mounted to play their exit animation without keepMounted', async () => {
      render(AnimatedIndicatorMenu, { props: { keepMounted: false, onAnimationEnd: () => {} } })

      expect(screen.getByTestId('checkbox-indicator')).toBeInTheDocument()
      expect(screen.getByTestId('radio-indicator')).toBeInTheDocument()

      fireEvent.click(screen.getByText('Close'))
      await nextTick()

      expect(screen.getByTestId('checkbox-indicator')).toHaveAttribute('data-ending-style')
      expect(screen.getByTestId('radio-indicator')).toHaveAttribute('data-ending-style')

      await waitFor(() => {
        expect(screen.queryByTestId('checkbox-indicator')).toBe(null)
        expect(screen.queryByTestId('radio-indicator')).toBe(null)
      })
    })
  })
})
