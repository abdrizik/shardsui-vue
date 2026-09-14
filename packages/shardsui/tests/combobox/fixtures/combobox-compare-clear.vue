<script setup lang="ts">
import { shallowRef } from 'vue'
import { Combobox } from '@/components/combobox'

type User = { id: number; name: string }

const { isItemEqualToValue } = defineProps<{
  isItemEqualToValue?: (item: User, value: User) => boolean
}>()

const users: User[] = [
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' }
]

const value = shallowRef<User | null>(users[0]!)
const open = shallowRef(true)
</script>

<template>
  <Combobox.Root
    v-model:value="value"
    v-model:open="open"
    :items="users"
    name="user"
    :item-to-string-label="(item: User) => item.name"
    :item-to-string-value="(item: User) => String(item.id)"
    :is-item-equal-to-value="isItemEqualToValue"
  >
    <Combobox.Trigger>
      <Combobox.Value />
    </Combobox.Trigger>
    <Combobox.Clear data-testid="clear" />
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
