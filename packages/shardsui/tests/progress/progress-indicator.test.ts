import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import { isJSDOM } from '../test-utils'
import BasicProgress from './fixtures/basic-progress.vue'

describe('<Progress.Indicator />', () => {
  describe('internal styles', () => {
    it('determinate', () => {
      render(BasicProgress, { props: { value: 33 } })
      const { style } = screen.getByTestId('indicator')
      expect(style.getPropertyValue('inset-inline-start')).toBe('0px')
      expect(style.width).toBe('33%')
    })

    it('sets zero width when value is 0', () => {
      render(BasicProgress, { props: { value: 0 } })
      const { style } = screen.getByTestId('indicator')
      expect(style.getPropertyValue('inset-inline-start')).toBe('0px')
      expect(style.width).toBe('0%')
    })

    it('indeterminate', () => {
      render(BasicProgress, { props: { value: null } })
      const { style } = screen.getByTestId('indicator')
      expect(style.getPropertyValue('inset-inline-start')).toBe('')
      expect(style.width).toBe('')
    })
  })

  describe.skipIf(isJSDOM)('computed styles', () => {
    it('determinate', () => {
      render(BasicProgress, { props: { value: 33, rootStyle: 'width:100px' } })

      const computed = getComputedStyle(screen.getByTestId('indicator'))
      expect(computed.insetInlineStart).toBe('0px')
      expect(computed.width).toBe('33px')
    })

    it('sets zero width when value is 0', () => {
      render(BasicProgress, { props: { value: 0, rootStyle: 'width:100px' } })

      const computed = getComputedStyle(screen.getByTestId('indicator'))
      expect(computed.insetInlineStart).toBe('0px')
      expect(computed.width).toBe('0px')
    })
  })
})
