import { render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { isJSDOM } from '../test-utils'
import AnimatedPanelTabs from './fixtures/animated-panel-tabs.vue'
import BasicTabs from './fixtures/basic-tabs.vue'
import PanelOutsideRoot from './fixtures/panel-outside-root.vue'
import ShadowedPanelTabs from './fixtures/shadowed-panel-tabs.vue'
import TabsListPanels from './fixtures/tabs-list-panels.vue'

describe('<Tabs.Panel />', () => {
  it('throws a descriptive error when rendered outside <Tabs.Root>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(PanelOutsideRoot)).toThrow(
        'ShardsUI: this part must be rendered inside <Tabs.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  describe('panels sharing a value', () => {
    it('keeps the surviving registration when a shadowed panel unmounts', async () => {
      const { rerender } = render(ShadowedPanelTabs)
      await nextTick()

      const tabB = screen.getAllByRole('tab')[1]!
      const owner = screen.getByTestId('owner')

      expect(tabB).toHaveAttribute('aria-controls', owner.id)

      await rerender({ shadowedMounted: false })

      expect(screen.queryByTestId('shadowed')).toBeNull()
      expect(tabB).toHaveAttribute('aria-controls', owner.id)
    })
  })

  describe('panel visibility', () => {
    it('only the active panel is visible', () => {
      render(BasicTabs, { props: { value: 1 } })
      const panels = screen.getAllByRole('tabpanel', { hidden: true })
      expect(panels[0]).toHaveAttribute('hidden')
      expect(panels[1]).not.toHaveAttribute('hidden')
      expect(panels[2]).toHaveAttribute('hidden')
    })
  })

  describe('id', () => {
    it('forwards a user-supplied id and points the tab aria-controls at it', async () => {
      render(TabsListPanels)
      await nextTick()

      expect(screen.getByTestId('panel-2')).toHaveAttribute('id', 'custom-panel-id')
      expect(screen.getByTestId('tab-2')).toHaveAttribute('aria-controls', 'custom-panel-id')
    })
  })

  describe.skipIf(isJSDOM)('animations', () => {
    const TRANSITION_CSS = `
      .animation-test-panel { transition: opacity 1ms; }
      .animation-test-panel[data-starting-style],
      .animation-test-panel[data-ending-style] { opacity: 0; }
    `

    const ANIMATION_CSS = `
      @keyframes test-anim { to { opacity: 0; } }
      .animation-test-panel[data-ending-style] { animation: test-anim 100ms; }
    `

    it('triggers enter animation via data-starting-style when mounting', async () => {
      const user = userEvent.setup()
      globalThis.SHARDSUI_ANIMATIONS_DISABLED = false

      let transitionFinished = false

      render(AnimatedPanelTabs, {
        props: {
          css: TRANSITION_CSS,
          onTransitionend: () => {
            transitionFinished = true
          }
        }
      })

      expect(screen.queryByTestId('panel-two')).toBeNull()

      await user.click(screen.getByRole('tab', { name: 'Two' }))

      await waitFor(() => expect(transitionFinished).toBe(true))
      expect(screen.getByTestId('panel-two')).not.toBeNull()
    })

    it('applies data-ending-style before unmount', async () => {
      const user = userEvent.setup()
      globalThis.SHARDSUI_ANIMATIONS_DISABLED = false

      render(AnimatedPanelTabs, { props: { value: 'two', css: ANIMATION_CSS } })

      await waitFor(() => expect(screen.getByTestId('panel-two')).toBeInTheDocument())

      await user.click(screen.getByRole('tab', { name: 'One' }))

      await waitFor(() =>
        expect(screen.getByTestId('panel-two')).toHaveAttribute('data-ending-style')
      )
      await waitFor(() => expect(screen.queryByTestId('panel-two')).toBeNull())
    })
  })
})
