import { render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import ComboboxWithGroups from './fixtures/combobox-with-groups.vue'
import GroupLabelSwap from './fixtures/group-label-swap.vue'

vi.mock('@/internal/detect-browser', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/internal/detect-browser')>()
  return {
    ...actual,
    isIOS: false
  }
})

describe('<Combobox.GroupLabel />', () => {
  describe('a11y attributes', () => {
    it('wires to group aria-labelledby', async () => {
      render(ComboboxWithGroups, { props: { open: true } })
      await nextTick()

      const group = screen.getByTestId('group-fruits')
      const label = screen.getByTestId('group-label-fruits')

      expect(group).toHaveAttribute('aria-labelledby', label.id)
    })

    it('uses a provided id in aria-labelledby', async () => {
      render(ComboboxWithGroups, { props: { open: true, groupLabelId: 'test-group' } })
      await nextTick()

      expect(screen.getByTestId('group-fruits')).toHaveAttribute('aria-labelledby', 'test-group')
      expect(screen.getByTestId('group-label-fruits')).toHaveAttribute('id', 'test-group')
    })

    it('does not let an older label cleanup clear a newer label', async () => {
      const { rerender } = render(GroupLabelSwap, { props: { labels: 'old' } })
      const group = screen.getByTestId('group')
      await nextTick()

      expect(group).toHaveAttribute('aria-labelledby', 'old-label')

      await rerender({ labels: 'both' })
      expect(group).toHaveAttribute('aria-labelledby', 'new-label')

      await rerender({ labels: 'new' })
      expect(group).toHaveAttribute('aria-labelledby', 'new-label')
    })
  })
})
