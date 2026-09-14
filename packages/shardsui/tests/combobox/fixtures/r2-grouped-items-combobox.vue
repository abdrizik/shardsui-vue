<script setup lang="ts">
import { Combobox } from '@/components/combobox'
import type { ComboboxShellProps } from '@/components/combobox/shell-props'

type ItemGroup = { value: string; items: string[] }

type RootProps = ComboboxShellProps<unknown, false>

const {
  limit,
  filter,
  groups = [
    { value: 'citrus', items: ['orange', 'lemon', 'lime'] },
    { value: 'berries', items: ['strawberry', 'blueberry', 'raspberry'] }
  ],
  staticItems,
  groupLabel = (group: ItemGroup) => group.value
} = defineProps<{
  limit?: number
  filter?: RootProps['filter']
  groups?: ItemGroup[]
  staticItems?: string[]
  groupLabel?: (group: ItemGroup) => string
}>()

const open = defineModel<boolean>('open')
</script>

<template>
  <Combobox.Root
    :open="open"
    :limit="limit"
    :filter="filter"
    :items="staticItems ? undefined : groups"
  >
    <Combobox.Input data-testid="input" />
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup data-testid="popup">
          <Combobox.List data-testid="list">
            <template v-if="staticItems">
              <Combobox.Item v-for="item in staticItems" :key="item" :value="item">
                {{ item }}
              </Combobox.Item>
            </template>
            <Combobox.Collection v-else v-slot="{ item: group }">
              <Combobox.Group :items="(group as ItemGroup).items">
                <Combobox.GroupLabel>{{ groupLabel(group as ItemGroup) }}</Combobox.GroupLabel>
                <Combobox.Collection v-slot="{ item }">
                  <Combobox.Item :value="item">{{ item }}</Combobox.Item>
                </Combobox.Collection>
              </Combobox.Group>
            </Combobox.Collection>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
