import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import BasicDirectionProvider from './fixtures/basic-direction-provider.vue'
import DirectionProbe from './fixtures/direction-probe.vue'

describe('<DirectionProvider />', () => {
  it('defaults getDirection to ltr outside a provider', () => {
    render(DirectionProbe)

    expect(screen.getByTestId('direction')).toHaveTextContent('ltr')
  })

  it('provides the configured direction to descendants', async () => {
    const { rerender } = render(BasicDirectionProvider, { props: { direction: 'rtl' } })

    expect(screen.getByTestId('direction')).toHaveTextContent('rtl')

    await rerender({ direction: 'ltr' })

    expect(screen.getByTestId('direction')).toHaveTextContent('ltr')
  })
})
