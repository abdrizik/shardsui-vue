import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import BasicMeter from './fixtures/basic-meter.vue'

describe('<Meter.Track />', () => {
  it('renders a custom as element', () => {
    render(BasicMeter, { props: { trackAs: 'nav' } })
    expect(screen.getByTestId('track').tagName.toLowerCase()).toBe('nav')
  })
})
