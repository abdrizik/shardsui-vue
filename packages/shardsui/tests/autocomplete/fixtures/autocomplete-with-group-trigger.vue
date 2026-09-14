<script setup lang="ts">
import { computed, shallowRef } from 'vue'
import { Autocomplete } from '@/components/autocomplete'

const allItems = ['alpha', 'beta']

const value = shallowRef('')

const filtered = computed(() =>
  value.value
    ? allItems.filter((item) => item.toLowerCase().includes(value.value.toLowerCase()))
    : allItems
)
</script>

<template>
  <Autocomplete.Root v-model:value="value" open-on-input-click>
    <Autocomplete.InputGroup data-testid="group">
      <Autocomplete.Input data-testid="input" />
      <Autocomplete.Trigger data-testid="trigger" />
    </Autocomplete.InputGroup>
    <Autocomplete.Portal>
      <Autocomplete.Positioner>
        <Autocomplete.Popup>
          <Autocomplete.List>
            <Autocomplete.Item v-for="item in filtered" :key="item" :value="item">
              {{ item }}
            </Autocomplete.Item>
          </Autocomplete.List>
        </Autocomplete.Popup>
      </Autocomplete.Positioner>
    </Autocomplete.Portal>
  </Autocomplete.Root>
</template>
