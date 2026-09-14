import { Fieldset } from '@/components/fieldset'
import { fireEvent, render, screen } from '@testing-library/vue'
import { expect, vi } from 'vitest'
import { nextTick } from 'vue'
import BasicFieldset from './fixtures/basic-fieldset.vue'
import LegendAssociation from './fixtures/legend-association.vue'

describe('<Fieldset.Legend />', () => {
  it('updates and clears the legend association', async () => {
    render(LegendAssociation)
    await nextTick()

    expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'legend-a')

    await fireEvent.click(screen.getByRole('button', { name: 'Change id' }))
    expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'legend-b')

    await fireEvent.click(screen.getByRole('button', { name: 'Remove legend' }))
    expect(screen.getByRole('group')).not.toHaveAttribute('aria-labelledby')
  })

  it('renders the element specified by the as prop', () => {
    render(BasicFieldset, { props: { as: 'span' }, attrs: { 'data-testid': 'legend' } })
    expect(screen.getByTestId('legend').tagName).toBe('SPAN')
  })

  it('sets aria-labelledby on the fieldset pointing to the legend id', async () => {
    render(BasicFieldset)
    await nextTick()
    const legendId = screen.getByText('My Legend').id
    expect(legendId).toBeTruthy()
    expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', legendId)
  })

  it('sets aria-labelledby with a custom legend id', async () => {
    render(BasicFieldset, { props: { id: 'legend-id' } })
    await nextTick()
    expect(screen.getByText('My Legend')).toHaveAttribute('id', 'legend-id')
    expect(screen.getByRole('group')).toHaveAttribute('aria-labelledby', 'legend-id')
  })

  it('throws a descriptive error when rendered outside <Fieldset.Root>', () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      expect(() => render(Fieldset.Legend)).toThrow(
        'ShardsUI: this part must be rendered inside <Fieldset.Root>.'
      )
    } finally {
      warn.mockRestore()
    }
  })

  it('does not set `aria-labelledby` when legend is absent', () => {
    render(Fieldset.Root, { attrs: { 'data-testid': 'fieldset' } })
    expect(screen.getByTestId('fieldset')).not.toHaveAttribute('aria-labelledby')
  })
})
