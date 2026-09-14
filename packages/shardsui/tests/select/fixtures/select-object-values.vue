<script setup lang="ts">
import { Select } from '@/components/select'

type User = { id: number; name: string; source?: string }

const {
  onValueChange,
  multiple = false,
  users = [
    { id: 1, name: 'Alice', source: 'item' },
    { id: 2, name: 'Bob', source: 'item' }
  ],
  isItemEqualToValue = (item: User, val: User) => item.id === val.id
} = defineProps<{
  onValueChange?: (v: unknown) => void
  multiple?: boolean
  users?: User[]
  isItemEqualToValue?: (item: User, value: User) => boolean
}>()

const value = defineModel<User | User[] | null>('value')
const open = defineModel<boolean>('open', { default: false })
</script>

<template>
  <Select.Root
    v-model:value="value as never"
    v-model:open="open"
    :multiple="multiple"
    :is-item-equal-to-value="isItemEqualToValue as never"
    :item-to-string-label="(item: User) => item.name"
    :item-to-string-value="(item: User) => String(item.id)"
    @update:value="onValueChange"
  >
    <Select.Trigger data-testid="trigger">
      <Select.Value data-testid="value" />
    </Select.Trigger>
    <Select.Portal>
      <Select.Positioner>
        <Select.Popup>
          <Select.Item v-for="user in users" :key="user.id" :value="user">
            {{ user.name }}
          </Select.Item>
        </Select.Popup>
      </Select.Positioner>
    </Select.Portal>
  </Select.Root>
</template>
