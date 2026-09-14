<script setup lang="ts">
import { Combobox } from '@/components/combobox'

type User = { id: number; name: string; source?: string }

const {
  multiple = false,
  isItemEqualToValue = (item: User, v: User) => item.id === v.id,
  users = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ] as User[]
} = defineProps<{
  multiple?: boolean
  isItemEqualToValue?: (item: User, v: User) => boolean
  users?: User[]
}>()

const value = defineModel<unknown>('value')
const open = defineModel<boolean>('open', { default: true })
</script>

<template>
  <Combobox.Root
    :items="users as never"
    :value="value as never"
    :multiple="multiple"
    v-model:open="open"
    :item-to-string-label="(item: User) => item.name"
    :item-to-string-value="(item: User) => String(item.id)"
    :is-item-equal-to-value="isItemEqualToValue as never"
  >
    <Combobox.Input data-testid="input" />
    <span data-testid="value">
      <Combobox.Value />
    </span>
    <Combobox.Portal>
      <Combobox.Positioner>
        <Combobox.Popup>
          <Combobox.List>
            <Combobox.Item v-for="user in users" :key="user.id" :value="user">
              {{ user.name }}
            </Combobox.Item>
          </Combobox.List>
        </Combobox.Popup>
      </Combobox.Positioner>
    </Combobox.Portal>
  </Combobox.Root>
</template>
