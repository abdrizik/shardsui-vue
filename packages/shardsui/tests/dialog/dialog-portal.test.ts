import { render, screen } from '@testing-library/vue'
import { expect } from 'vitest'
import DialogKeepMounted from './fixtures/dialog-keep-mounted.vue'

describe('<Dialog.Portal />', () => {
  describe('prop: keepMounted', () => {
    it('keeps the dialog mounted but inaccessible when keepMounted=true', () => {
      render(DialogKeepMounted, { props: { keepMounted: true, open: false } })

      expect(screen.queryByRole('dialog', { hidden: true })).toBeInTheDocument()
      expect(screen.queryByRole('dialog')).toBeNull()
    })

    it('does not keep the dialog mounted when keepMounted=false', () => {
      render(DialogKeepMounted, { props: { keepMounted: false, open: false } })

      expect(screen.queryByRole('dialog', { hidden: true })).toBeNull()
    })

    it('does not keep the dialog mounted when keepMounted=undefined', () => {
      render(DialogKeepMounted, { props: { open: false } })

      expect(screen.queryByRole('dialog', { hidden: true })).toBeNull()
    })
  })
})
