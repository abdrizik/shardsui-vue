import { fireEvent, render, screen, waitFor } from '@testing-library/vue'
import userEvent from '@testing-library/user-event'
import { expect, vi } from 'vitest'
import { settleListeners } from '../test-utils'
import ButtonStub from '../stubs/button.vue'
import SectionStub from '../stubs/section.vue'
import ButtonFixture from './fixtures/button-fixture.vue'
import ButtonInForm from './fixtures/button-in-form.vue'

describe('button', () => {
  describe('handler freshness', () => {
    it('calls the handler the owner passed most recently, not the one from mount', async () => {
      const first = vi.fn()
      const second = vi.fn()
      const view = render(ButtonFixture, { props: { onClick: first } })

      await view.rerender({ onClick: second })
      await settleListeners()

      fireEvent.click(screen.getByTestId('button'))

      expect(second).toHaveBeenCalledOnce()
      expect(first).not.toHaveBeenCalled()
    })

    it('calls the keydown handler the owner passed most recently', async () => {
      const first = vi.fn()
      const second = vi.fn()
      const view = render(ButtonFixture, { props: { onKeydown: first } })

      await view.rerender({ onKeydown: second })
      await settleListeners()

      const btn = screen.getByTestId('button')
      btn.focus()
      fireEvent.keyDown(btn, { key: 'Enter' })

      expect(second).toHaveBeenCalledOnce()
      expect(first).not.toHaveBeenCalled()
    })
  })

  describe('non-native button (span)', () => {
    it('can be activated with Enter key (fires click on keydown)', () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { onClick: spy } })
      const btn = screen.getByTestId('button')
      btn.focus()
      fireEvent.keyDown(btn, { key: 'Enter' })
      expect(spy).toHaveBeenCalledOnce()
    })

    it('Space fires keyup then click on non-composite buttons', () => {
      const clickSpy = vi.fn()
      const keydownSpy = vi.fn()
      const keyupSpy = vi.fn()
      render(ButtonFixture, {
        props: { onClick: clickSpy, onKeydown: keydownSpy, onKeyup: keyupSpy }
      })
      const btn = screen.getByTestId('button')
      btn.focus()
      expect(btn).toHaveFocus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(keydownSpy).toHaveBeenCalledTimes(1)
      expect(clickSpy).toHaveBeenCalledTimes(0)

      fireEvent.keyUp(btn, { key: ' ' })
      expect(keyupSpy).toHaveBeenCalledTimes(1)
      expect(clickSpy).toHaveBeenCalledTimes(1)
    })

    it('Space does not click when a consumer keyup handler calls preventDefault', async () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: { onClick: spy, onKeyup: (event) => event.preventDefault() }
      })
      const btn = screen.getByTestId('button')

      await userEvent.tab()
      expect(btn).toHaveFocus()
      await userEvent.keyboard('[Space]')
      expect(spy).toHaveBeenCalledTimes(0)
    })

    it('Enter does not click when a consumer keydown handler calls preventDefault', async () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: { onClick: spy, onKeydown: (event) => event.preventDefault() }
      })
      const btn = screen.getByTestId('button')

      await userEvent.tab()
      expect(btn).toHaveFocus()
      await userEvent.keyboard('[Enter]')
      expect(spy).toHaveBeenCalledTimes(0)
    })
  })

  describe('option: focusableWhenDisabled', () => {
    it('allows disabled buttons to be focused', () => {
      render(ButtonFixture, {
        props: { as: 'button', disabled: true, focusableWhenDisabled: true }
      })
      const btn = screen.getByTestId('button')
      btn.focus()
      expect(btn).toHaveFocus()
    })

    it('prevents interactions except focus and blur', async () => {
      const clickSpy = vi.fn()
      const keydownSpy = vi.fn()
      const keyupSpy = vi.fn()
      const focusSpy = vi.fn()
      const blurSpy = vi.fn()
      render(ButtonFixture, {
        props: {
          disabled: true,
          focusableWhenDisabled: true,
          onClick: clickSpy,
          onKeydown: keydownSpy,
          onKeyup: keyupSpy,
          onFocus: focusSpy,
          onBlur: blurSpy
        }
      })
      const btn = screen.getByTestId('button')
      expect(document.activeElement).not.toBe(btn)

      expect(focusSpy).toHaveBeenCalledTimes(0)
      await userEvent.tab()
      expect(btn).toHaveFocus()
      expect(focusSpy).toHaveBeenCalledTimes(1)

      await userEvent.keyboard('[Enter]')
      expect(keydownSpy).toHaveBeenCalledTimes(0)
      expect(clickSpy).toHaveBeenCalledTimes(0)

      await userEvent.keyboard('[Space]')
      expect(keyupSpy).toHaveBeenCalledTimes(0)
      expect(clickSpy).toHaveBeenCalledTimes(0)

      await userEvent.click(btn)
      expect(keydownSpy).toHaveBeenCalledTimes(0)
      expect(keyupSpy).toHaveBeenCalledTimes(0)
      expect(clickSpy).toHaveBeenCalledTimes(0)

      expect(blurSpy).toHaveBeenCalledTimes(0)
      await userEvent.tab()
      expect(blurSpy).toHaveBeenCalledTimes(1)
      expect(document.activeElement).not.toBe(btn)
    })
  })

  describe('option: tabindex', () => {
    it('defaults to tabindex 0 when the host is a native button', () => {
      render(ButtonFixture, { props: { as: 'button' } })
      expect(screen.getByTestId('button')).toHaveProperty('tabIndex', 0)
    })

    it('defaults to tabindex 0 when the host is not a native button', () => {
      render(ButtonFixture)
      expect(screen.getByTestId('button')).toHaveProperty('tabIndex', 0)
    })

    it('applies the provided tabindex to a native button', () => {
      render(ButtonFixture, { props: { as: 'button', tabindex: 2 } })
      expect(screen.getByTestId('button')).toHaveAttribute('tabindex', '2')
    })
  })

  describe('composite mode (Space fires on keydown, not keyup)', () => {
    it('Space fires click on keydown and not again on keyup', () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { composite: true, onClick: spy } })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()

      fireEvent.keyUp(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()
    })

    it('preventShardsUIHandler stops click when called on keydown event', () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: {
          composite: true,
          onClick: spy,
          onKeydown: (e) => e.preventShardsUIHandler()
        }
      })
      const btn = screen.getByTestId('button')
      btn.focus()
      fireEvent.keyDown(btn, { key: ' ' })
      expect(spy).not.toHaveBeenCalled()
    })

    it('native composite button fires click on Space keydown and not again on keyup', () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { composite: true, as: 'button', onClick: spy } })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()

      fireEvent.keyUp(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()
    })

    it('does not fire duplicate clicks for Space on native composite buttons', async () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { composite: true, as: 'button', onClick: spy } })
      const btn = screen.getByTestId('button')
      btn.focus()
      expect(btn).toHaveFocus()

      await userEvent.keyboard('[Space]')
      expect(spy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Enter key for non-native button', () => {
    it('fires click on keydown (not keyup)', () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { onClick: spy } })
      const btn = screen.getByTestId('button')
      btn.focus()
      fireEvent.keyDown(btn, { key: 'Enter' })
      expect(spy).toHaveBeenCalledOnce()
      spy.mockReset()
      fireEvent.keyUp(btn, { key: 'Enter' })
      expect(spy).not.toHaveBeenCalled()
    })

    it('does not set a type attribute on a non-native button', () => {
      render(ButtonFixture, { props: { as: 'span' } })
      expect(screen.getByTestId('button')).not.toHaveAttribute('type')
    })
  })

  describe('keyboard activation dispatches real clicks', () => {
    it('bubbles a composed click with detail 0 to ancestors', () => {
      const onClick = vi.fn()
      const ancestorClick = vi.fn<(event: MouseEvent) => void>()
      render(ButtonFixture, { props: { onClick } })
      const btn = screen.getByTestId('button')
      btn.parentElement?.addEventListener('click', ancestorClick)
      btn.focus()

      fireEvent.keyDown(btn, { key: 'Enter' })

      expect(onClick).toHaveBeenCalledOnce()
      expect(ancestorClick).toHaveBeenCalledOnce()
      const event = ancestorClick.mock.calls[0][0]
      expect(event.detail).toBe(0)
      expect(event.bubbles).toBe(true)
      expect(event.composed).toBe(true)
    })

    it('carries modifier key state', () => {
      const onClick = vi.fn<(event: MouseEvent) => void>()
      render(ButtonFixture, { props: { onClick } })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: 'Enter', shiftKey: true, metaKey: true })

      const event = onClick.mock.calls[0][0]
      expect(event.shiftKey).toBe(true)
      expect(event.metaKey).toBe(true)
      expect(event.ctrlKey).toBe(false)
      expect(event.altKey).toBe(false)
    })

    it('preventShardsUIHandler on keydown and keyup cancels non-composite activation', () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: {
          onClick: spy,
          onKeydown: (event) => event.preventShardsUIHandler(),
          onKeyup: (event) => event.preventShardsUIHandler()
        }
      })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: 'Enter' })
      expect(spy).not.toHaveBeenCalled()

      fireEvent.keyDown(btn, { key: ' ' })
      fireEvent.keyUp(btn, { key: ' ' })
      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('links', () => {
    it('Space prevents the page from scrolling and activates on keyup', () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { as: 'a', href: '#test', onClick: spy } })
      const link = screen.getByTestId('button')
      link.focus()

      // `fireEvent` in testing-library/vue resolves to undefined rather than the dispatch
      // result, so the cancelable event is dispatched directly to read it.
      const keydown = new KeyboardEvent('keydown', { key: ' ', bubbles: true, cancelable: true })
      expect(link.dispatchEvent(keydown)).toBe(false)
      expect(spy).not.toHaveBeenCalled()

      fireEvent.keyUp(link, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe('composite links', () => {
    it('Space clicks the link on keydown', () => {
      const spy = vi.fn()
      render(ButtonFixture, { props: { as: 'a', href: '#test', composite: true, onClick: spy } })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()

      fireEvent.keyUp(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe('composite Space vs. text navigation', () => {
    it('does not click composite links when Space is prevented for text navigation', () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: {
          as: 'a',
          href: '#test',
          role: 'menuitem',
          composite: true,
          onClick: spy,
          onKeydown: (event) => event.preventDefault()
        }
      })
      const link = screen.getByRole('menuitem')
      link.focus()
      expect(link).toHaveFocus()

      fireEvent.keyDown(link, { key: ' ' })
      expect(spy).not.toHaveBeenCalled()
    })

    it('does not click composite gridcells when Space is prevented', () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: {
          as: 'div',
          role: 'gridcell',
          composite: true,
          tabindex: 0,
          onClick: spy,
          onKeydown: (event) => event.preventDefault()
        }
      })
      const gridcell = screen.getByRole('gridcell')
      gridcell.focus()
      expect(gridcell).toHaveFocus()

      fireEvent.keyDown(gridcell, { key: ' ' })
      expect(spy).not.toHaveBeenCalled()
    })

    it('prevents the browser from activating native composite menuitems on Space keyup', () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: {
          as: 'button',
          role: 'menuitem',
          composite: true,
          onClick: spy,
          onKeydown: (event) => event.preventDefault()
        }
      })
      const item = screen.getByRole('menuitem')
      item.focus()
      expect(item).toHaveFocus()

      fireEvent.keyDown(item, { key: ' ' })
      const keyup = new KeyboardEvent('keyup', { key: ' ', bubbles: true, cancelable: true })
      expect(item.dispatchEvent(keyup)).toBe(false)
      expect(spy).not.toHaveBeenCalled()
    })

    it('role=switch still activates on a prevented Space', () => {
      const spy = vi.fn()
      render(ButtonFixture, {
        props: {
          as: 'div',
          role: 'switch',
          composite: true,
          onClick: spy,
          onKeydown: (event) => event.preventDefault()
        }
      })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(spy).toHaveBeenCalledOnce()
    })
  })

  describe('native semantics survive composite Space', () => {
    it('type=submit still submits the form', () => {
      const onSubmit = vi.fn((event: SubmitEvent) => event.preventDefault())
      render(ButtonInForm, { props: { type: 'submit', onSubmit } })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(onSubmit).toHaveBeenCalledOnce()

      fireEvent.keyUp(btn, { key: ' ' })
      expect(onSubmit).toHaveBeenCalledOnce()
    })

    it('type=reset still resets the form', () => {
      const onReset = vi.fn((event: Event) => event.preventDefault())
      render(ButtonInForm, { props: { type: 'reset', onReset } })
      const btn = screen.getByTestId('button')
      btn.focus()

      fireEvent.keyDown(btn, { key: ' ' })
      expect(onReset).toHaveBeenCalledOnce()
    })
  })

  describe('a component in `as`', () => {
    it('warns when the component renders an element the part does not expect', async () => {
      const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})

      try {
        render(ButtonFixture, { props: { as: SectionStub, defaultTag: 'button' } })

        await waitFor(() =>
          expect(warn).toHaveBeenCalledWith(
            'ShardsUI: `as` renders <section>, but this part applies the semantics of <button>. Pass the tag to `as` instead when those semantics matter.'
          )
        )
      } finally {
        warn.mockRestore()
      }
    })

    it('keeps the native button semantics when the part renders a button', () => {
      render(ButtonFixture, { props: { as: ButtonStub, defaultTag: 'button' } })

      const button = screen.getByTestId('button')
      expect(button.tagName.toLowerCase()).toBe('button')
      expect(button).toHaveAttribute('type', 'button')
      expect(button).not.toHaveAttribute('role')
    })

    it('applies the button role and tabindex when the part renders something else', () => {
      render(ButtonFixture, { props: { as: SectionStub, defaultTag: 'section' } })

      const button = screen.getByTestId('button')
      expect(button.tagName.toLowerCase()).toBe('section')
      expect(button).not.toHaveAttribute('type')
      expect(button).toHaveAttribute('role', 'button')
      expect(button).toHaveAttribute('tabindex', '0')
    })
  })
})
