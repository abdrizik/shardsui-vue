import { waitFor } from '@testing-library/vue'
import { expect, it } from 'vitest'
import { effectScope, nextTick, shallowRef } from 'vue'
import {
  createComboboxItemRegistry,
  type ComboboxItemRegistryOptions
} from '@/components/combobox/item-registry'

function makeContainer(count: number) {
  const container = document.createElement('div')
  const elements = Array.from({ length: count }, () => {
    const element = document.createElement('div')
    container.append(element)
    return element
  })
  document.body.append(container)
  return { container, elements }
}

function defaults(
  overrides: Partial<ComboboxItemRegistryOptions> = {}
): ComboboxItemRegistryOptions {
  return {
    loopFocus: false,
    autoHighlight: false,
    virtualized: false,
    grid: false,
    itemCount: 0,
    container: null,
    ...overrides
  }
}

describe('ComboboxItemRegistry', () => {
  afterEach(() => {
    document.body.replaceChildren()
  })

  it('keeps registered items in document order regardless of registration order', async () => {
    const { elements } = makeContainer(3)

    const scope = effectScope()
    await scope.run(async () => {
      const registry = createComboboxItemRegistry(defaults())

      registry.registerItem(elements[2]!, { value: 'c' })
      registry.registerItem(elements[0]!, { value: 'a' })
      registry.registerItem(elements[1]!, { value: 'b' })

      expect(registry.items.value.map((it) => it.value)).toEqual(['a', 'b', 'c'])
      expect(registry.indexOf(elements[0]!)).toBe(0)
      expect(registry.indexOf(elements[1]!)).toBe(1)
      expect(registry.indexOf(elements[2]!)).toBe(2)
      expect(registry.firstIndex()).toBe(0)
    })

    scope.stop()
  })

  describe('virtualized', () => {
    it('clears a highlight left past the item count when the list shrinks', async () => {
      const itemCount = shallowRef(11)

      const scope = effectScope()
      await scope.run(async () => {
        const registry = createComboboxItemRegistry(defaults({ virtualized: true, itemCount }))

        registry.setHighlightedIndex(10, 'keyboard')
        expect(registry.highlightedIndex.value).toBe(10)

        itemCount.value = 3
        await nextTick()

        expect(registry.highlightedIndex.value).toBe(-1)
        expect(registry.lastHighlightReason.value).toBe('none')
      })

      scope.stop()
    })

    it('ignores a stale teardown when a different element holds the index', async () => {
      const { elements } = makeContainer(2)

      const scope = effectScope()
      await scope.run(async () => {
        const registry = createComboboxItemRegistry(defaults({ virtualized: true, itemCount: 10 }))

        const unregister = registry.registerVirtualItem(3, elements[1]!)
        registry.registerVirtualItem(3, elements[0]!)
        unregister()

        expect(registry.getItemElement(3)).toBe(elements[0])
      })

      scope.stop()
    })
  })

  describe('document-order re-sorting', () => {
    it('re-sorts recorded indices when a node moves inside the popup', async () => {
      const { container, elements } = makeContainer(3)
      let registry!: ReturnType<typeof createComboboxItemRegistry>

      const scope = effectScope()
      await scope.run(async () => {
        registry = createComboboxItemRegistry(defaults({ container }))

        for (const [i, element] of elements.entries()) {
          registry.registerItem(element, { value: i })
        }
        await nextTick()

        container.append(elements[0]!)
      })

      await waitFor(() => {
        expect(registry.items.value.map((it) => it.value)).toEqual([1, 2, 0])
      })

      expect(registry.indexOf(elements[0]!)).toBe(2)
      expect(registry.indexOf(elements[1]!)).toBe(0)

      scope.stop()
    })
  })
})
